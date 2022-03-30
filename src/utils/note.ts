import { MbBookNote, MNPic } from "typings"
import { postNotification } from "./common"
import { MN } from "const"
import { unique } from "utils"

/**
 * 可撤销的动作，所有修改数据的动作都应该用这个方法包裹
 */
const undoGrouping = (f: () => void) => {
  UndoManager.sharedInstance().undoGrouping("", self.notebookid, f)
}

const undoGroupingWithRefresh = (f: () => void) => {
  undoGrouping(f)
  RefreshAfterDBChange()
}

/**
 * 保存数据，刷新界面
 */
const RefreshAfterDBChange = () => {
  MN.db.setNotebookSyncDirty(self.notebookid)
  postNotification("RefreshAfterDBChange", {
    topicid: self.notebookid
  })
}

/**
 * 获取选中的卡片
 */
const getSelectNodes = (): MbBookNote[] => {
  const MindMapNodes: any[] | undefined =
    MN.studyController().notebookController.mindmapView.selViewLst
  return MindMapNodes?.length ? MindMapNodes.map(item => item.note.note) : []
}

/**
 * 获取整个卡片树
 */
const getNodeTree = (node: MbBookNote) => {
  const DFS = (
    nodes: MbBookNote[],
    level = 0,
    lastIndex = [] as number[],
    res = {
      children: [] as MbBookNote[],
      treeIndex: [] as number[][]
    }
  ) => {
    level++
    nodes.forEach((node, index) => {
      res.children.push(node)
      lastIndex = lastIndex.slice(0, level - 1)
      lastIndex.push(index)
      res.treeIndex.push(lastIndex)
      node.childNotes?.length && DFS(node.childNotes, level, lastIndex, res)
    })
    return res
  }
  if (!node.childNotes?.length)
    return {
      onlyChildren: [],
      onlyFirstLevel: [],
      allNodes: [node],
      treeIndex: [[]] as number[][]
    }
  const { children, treeIndex } = DFS(node.childNotes!)
  return {
    // 只有子节点
    onlyChildren: children,
    // 只有第一层的子节点
    onlyFirstLevel: node.childNotes!,
    // 选中的卡片及其子节点
    allNodes: [node, ...children],
    treeIndex
  }
}

const getAncestorNodes = (node: MbBookNote): MbBookNote[] => {
  const up = (node: MbBookNote, ancestorNodes: MbBookNote[]) => {
    if (node.parentNote) {
      ancestorNodes = up(node.parentNote, [...ancestorNodes, node.parentNote])
    }
    return ancestorNodes
  }
  return up(node, [])
}

/**
 * 获取卡片中的所有摘录节点
 */
const getExcerptNotes = (node: MbBookNote): MbBookNote[] => {
  return node.comments.reduce(
    (acc, cur) => {
      cur.type == "LinkNote" && acc.push(MN.db.getNoteById(cur.noteid)!)
      return acc
    },
    [node]
  )
}

const exportPic = (pic: MNPic) => {
  const base64 = MN.db.getMediaByHash(pic.paint)?.base64Encoding()
  return base64
    ? {
        base64,
        img: `data:image/jpeg;base64,${base64}`,
        html: `<img src="data:image/jpeg;base64,${base64}"/>`,
        md: `![](data:image/jpeg;base64,${base64})`
      }
    : undefined
}

/**
 * 获取卡片中的所有摘录文字
 * @param node 卡片节点
 * @param highlight 默认有重点
 * @param pic 默认为 OCR 后的文字
 */
const getExcerptText = (node: MbBookNote, highlight = true) => {
  const res = {
    ocr: [] as string[],
    base64: [] as string[],
    img: [] as string[],
    html: [] as string[],
    md: [] as string[]
  }
  return getExcerptNotes(node).reduce((acc, cur) => {
    const text = cur.excerptText?.trim() ?? ""
    if (cur.excerptPic) {
      const imgs = exportPic(cur.excerptPic)
      if (imgs)
        Object.entries(imgs).forEach(([k, v]) => {
          if (k in acc) acc[k].push(v)
        })
      text && acc.ocr.push(text)
    } else if (text) {
      Object.values(acc).forEach(k =>
        k.push(highlight ? text : removeHighlight(text))
      )
    }
    return acc
  }, res)
}

/**
 * 获取评论的索引
 */
const getCommentIndex = (note: MbBookNote, comment: MbBookNote | string) => {
  const comments = note.comments
  for (let i = 0; i < comments.length; i++) {
    const _comment = comments[i]
    if (typeof comment == "string") {
      if (_comment.type == "TextNote" && _comment.text == comment) return i
    } else if (_comment.type == "LinkNote" && _comment.noteid == comment.noteId)
      return i
  }
  return -1
}

/**
 * 获取卡片内所有的文字
 * @param note
 * @param separator 分隔符号
 * @param highlight 是否保留划重点
 * @returns
 */

const getAllText = (node: MbBookNote, separator = "\n", highlight = true) => {
  return [
    ...getExcerptText(node, highlight).ocr,
    ...getAllCommnets(node).nopic,
    getAllTags(node).join(" ")
  ].join(separator)
}

const removeHighlight = (text: string) => text.replace(/\*\*/g, "")

const getAllTags = (node: MbBookNote, hash = true) => {
  const tags = node.comments.reduce((acc, cur) => {
    if (cur.type == "TextNote" || cur.type == "HtmlNote") {
      acc.push(...cur.text.split(/\s/).filter(k => k.startsWith("#")))
    }
    return acc
  }, [] as string[])
  return hash ? tags : tags.map(k => k.slice(1))
}

const getAllCommnets = (node: MbBookNote) => {
  const res = {
    nopic: [] as string[],
    base64: [] as string[],
    img: [] as string[],
    html: [] as string[],
    md: [] as string[]
  }
  return node.comments.reduce((acc, cur) => {
    if (cur.type === "PaintNote") {
      const imgs = exportPic(cur)
      if (imgs)
        Object.entries(imgs).forEach(([k, v]) => {
          if (k in acc) acc[k].push(v)
        })
    } else if (cur.type == "TextNote" || cur.type == "HtmlNote") {
      const text = cur.text.trim()
      if (text && !text.includes("marginnote3app") && !text.startsWith("#"))
        Object.values(acc).map(k => k.push(text))
    }
    return acc
  }, res)
}

/**
 * 添加标签，并且会去除划重点
 * @param force 强制整理合并标签，就算没有添加标签
 */
const addTags = (node: MbBookNote, tags: string[], force = false) => {
  const existingTags: string[] = []
  const tagCommentIndex: number[] = []
  node.comments.forEach((comment, index) => {
    if (comment.type == "TextNote") {
      const _tags = comment.text.split(" ")
      if (_tags.every(tag => tag.startsWith("#"))) {
        existingTags.push(..._tags.map(tag => tag.slice(1)))
        tagCommentIndex.push(index)
      }
    }
  })

  // 如果该标签已存在，而且不是强制，就退出
  if (!force && (!tags.length || tags.every(tag => existingTags.includes(tag))))
    return

  // 从后往前删，索引不会变
  tagCommentIndex
    .reverse()
    .forEach(index => void node.removeCommentByIndex(index))

  const tagLine = unique([...existingTags, ...tags])
    .map(tag => `#${tag}`)
    .join(" ")

  tagLine && node.appendTextComment(removeHighlight(tagLine))
}

export {
  getSelectNodes,
  getNodeTree,
  getAncestorNodes,
  getExcerptNotes,
  getExcerptText,
  getCommentIndex,
  getAllText,
  undoGrouping,
  undoGroupingWithRefresh,
  RefreshAfterDBChange,
  addTags,
  getAllTags,
  getAllCommnets,
  removeHighlight
}
