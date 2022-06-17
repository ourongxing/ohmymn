import { MN } from "~/const"
import { MbBookNote, MNPic } from "~/typings"
import { unique } from "."
import { postNotification } from "./common"
import { escapeURLParam } from "~/utils"

/**
 * Cancellable actions, all actions that modify data should be wrapped in this method.
 * @param f f:()=>void, the action need to be cancelled.
 * @returns void
 */
const undoGrouping = (f: () => void) => {
  UndoManager.sharedInstance().undoGrouping("", self.notebookid, f)
}

/**
 * Undo group and then refresh the view.
 * @param f f:()=>void, the action need to be cancelled.
 * @returns void
 */
const undoGroupingWithRefresh = (f: () => void) => {
  undoGrouping(f)
  RefreshAfterDBChange()
}

/**
 * Refresh the view after database change.
 * @returns void
 */
const RefreshAfterDBChange = () => {
  MN.db.setNotebookSyncDirty(self.notebookid)
  postNotification("RefreshAfterDBChange", {
    topicid: self.notebookid
  })
}

/**
 * Get infomation of the selected nodes.
 * @returns Array which contains the infomation of the selected nodes.
 * @example
 * ```
 * //get the infomation of the first selected node
 * const mySelection = getSelection()[0]
 * ```
 */
const getSelectNodes = (): MbBookNote[] => {
  const MindMapNodes: any[] | undefined =
    MN.studyController().notebookController.mindmapView.selViewLst
  return MindMapNodes?.length ? MindMapNodes.map(item => item.note.note) : []
}

/**
 * Get card tree recursively, including all the node's children,grandchildren and grandgrandchildren etc.
 * @param node The card that you want to get its children node information.
 * @returns MbBookNote[] - An array which contains all the children nodes.
 * @example
 * ```
 * const { treeIndex, onlyChildren } = getNodeTree(node)
 * ```
 *  If the node has no child node,
 * return {
      onlyChildren: [],
      onlyFirstLevel: [],
      allNodes: [node],
      treeIndex: [[]] as number[][]
    }
    If the node has child node,
    return {
    // only has child node
    onlyChildren: children,
    // only has the first level child node
    onlyFirstLevel: node.childNotes!,
    // card selected and its children nodes
    allNodes: [node, ...children],
    //index of the node in the tree
    treeIndex
  }
    ```
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

/**
 * Get ancester nodes recursively, including all the node's parent, grandparent and grandgrandparent etc.
 * @param node The card that you want to get its ancestor nodes information.
 * @returns MbBookNote[] - An array which contains all the ancestor nodes.
 *
 */
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
 * Get all excerptions of one node.
 * @param node The card that you want to get its excerptions.
 * @returns Array Each element of the array contains one excerpt note's info.
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

/**
 * Get picture base64 code by {@param} pic.
 * @param pic {@link MNPic}
 * @returns Base64 code of the picture.
 */
const exportPic = (pic: MNPic, mdsize = "") => {
  const base64 = MN.db.getMediaByHash(pic.paint)?.base64Encoding()
  return base64
    ? {
        base64,
        img: `data:image/jpeg;base64,${escapeURLParam(base64)}`,
        html: `<img src="data:image/jpeg;base64,${base64}"/>`,
        md: `![${mdsize}](data:image/jpeg;base64,${escapeURLParam(base64)})`
      }
    : undefined
}

/**
 * Get all excerpt text in a card.
 * @param node The card that you want to get its excerpt text.
 * @param highlight Highlighted by default.
 * @param pic Text after OCR by default.
 * @returns Dict of excerpt text.
 */
const getExcerptText = (node: MbBookNote, highlight = true, mdsize = "") => {
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
      const imgs = exportPic(cur.excerptPic, mdsize)
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
 * Get index of comments.
 * @param node The card that you want to get its comments' index.
 * @param comment The comment that you want to get its index.
 * @returns Number The index of the comment.
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
 * Get all the text in the card, include excerpt text, comment, tags.
 * @param node MindMap node, a card.
 * @param separator The separator between the text and comments.
 * @param highlight default true, will retention highlight symbol, **.
 * @returns string
 */
const getAllText = (
  node: MbBookNote,
  separator = "\n",
  highlight = true,
  mdsize = ""
) => {
  return [
    ...getExcerptText(node, highlight, mdsize).ocr,
    ...getAllCommnets(node, mdsize).nopic,
    getAllTags(node).join(" ")
  ].join(separator)
}

/**
 * Remove the highlight symbol in the text.
 * @param text The text that you want to remove the highlight symbol.
 * @returns Processed text.
 */
const removeHighlight = (text: string) => text.replace(/\*\*/g, "")

/**
 * Get all tags of one node.
 * @param node The card that you want to get its tags.
 * @param hash True by default. If false, will delete "#" in the tag.
 * @returns Array of strings. Each element is a tag.
 */
const getAllTags = (node: MbBookNote, hash = true) => {
  const tags = node.comments.reduce((acc, cur) => {
    if (cur.type == "TextNote" || cur.type == "HtmlNote") {
      acc.push(...cur.text.split(/\s/).filter(k => k.startsWith("#")))
    }
    return acc
  }, [] as string[])
  return hash ? tags : tags.map(k => k.slice(1))
}

/**
 * Get all comments of one node.
 * @param node The card that you want to get all kind of its comments.
 * @returns Resource dict.
 */
const getAllCommnets = (node: MbBookNote, mdsize = "") => {
  const res = {
    nopic: [] as string[],
    base64: [] as string[],
    img: [] as string[],
    html: [] as string[],
    md: [] as string[]
  }
  return node.comments.reduce((acc, cur) => {
    if (cur.type === "PaintNote") {
      const imgs = exportPic(cur, mdsize)
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
 * Add labels, and remove emphasis
 * @param node The card that you want to process.
 * @param tags The tags that you want to add.
 * @param force Force merging tags, even if no tags are added
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

  const tagLine = unique([...existingTags, ...tags]).reduce((acc, cur) => {
    if (cur) return acc ? `${acc} #${cur}` : `#${cur}`
    else return acc
  }, "")

  tagLine && node.appendTextComment(removeHighlight(tagLine))
}

const modifyNodeTitle = (node: MbBookNote, title: string | string[]) => {
  node = node.groupNoteId ? MN.db.getNoteById(node.groupNoteId)! : node
  if (typeof title !== "string") title = title.join("; ")
  title = removeHighlight(title)
  if (node.excerptText === node.noteTitle) {
    node.noteTitle = title
    node.excerptText = title
  } else {
    node.noteTitle = title
  }
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
  removeHighlight,
  exportPic,
  modifyNodeTitle
}
