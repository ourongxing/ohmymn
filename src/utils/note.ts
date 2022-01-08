import { MbBookNote, MbTopic } from "types/MarginNote"
import { delay, postNotification } from "./common"
import { MN } from "const"

/**
 * 获取选中的卡片
 */
const getSelectNodes = (): MbBookNote[] => {
  const MindMapNodes: any[] | undefined =
    MN.studyController().notebookController.mindmapView.selViewLst
  if (MindMapNodes?.length) return MindMapNodes.map(item => item.note.note)
  else return []
}

/**
 * 获取选中的卡片，包括子节点
 */
const getSelectNodesAll = (onlyChildrenNode = false): MbBookNote[] => {
  const nodes = getSelectNodes()
  const allNodes: MbBookNote[] = []
  const getChildren = (nodes: MbBookNote[], onlyChildrenNode = false) => {
    nodes.forEach((node: MbBookNote) => {
      if (!onlyChildrenNode) allNodes.push(node)
      if (node.childNotes?.length) getChildren(node.childNotes)
    })
  }
  getChildren(nodes, onlyChildrenNode)
  return allNodes
}

/**
 * 获取卡片中的所有摘录
 */
const excerptNotes = (node: MbBookNote): MbBookNote[] => {
  const notes: MbBookNote[] = [node]
  // 包括作为评论的摘录
  const comments = node.comments
  for (const comment of comments) {
    if (comment.type == "LinkNote")
      notes.push(MN.db.getNoteById(comment.noteid)!)
  }
  return notes
}

const getNoteById = (noteid: string): MbBookNote => MN.db.getNoteById(noteid)!

// topic 就是 notebook
const getNotebookById = (notebookid: string): MbTopic =>
  MN.db.getNotebookById(notebookid)!

/**
 * 可撤销的动作，所有修改数据的动作都应该用这个方法包裹
 */
const undoGrouping = (f: () => void) => {
  UndoManager.sharedInstance().undoGrouping(
    String(Date.now()),
    self.notebookid,
    f
  )
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

const getCommentIndex = (node: MbBookNote, commentNote: MbBookNote) => {
  const comments = node.comments
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i]
    if (comment.type == "LinkNote" && comment.noteid == commentNote.noteId)
      return i
  }
  return -1
}

/**
 * 获取卡片内所有的文字
 */
const getAllText = (note: MbBookNote, separator = "\n", highlight = true) => {
  const textArr = []
  if (note.excerptText)
    textArr.push(
      highlight ? note.excerptText : note.excerptText.replace(/\*\*/g, "")
    )
  note.comments.forEach(comment => {
    switch (comment.type) {
      case "TextNote":
      case "HtmlNote":
        const text = comment.text.trim()
        if (text && !text.includes("marginnote3app")) textArr.push(text)
        break
      case "LinkNote":
        if (comment.q_htext) textArr.push(comment.q_htext.trim())
    }
  })
  return textArr.join(separator)
}

export {
  getSelectNodes,
  getSelectNodesAll,
  excerptNotes,
  getCommentIndex,
  getNotebookById,
  getNoteById,
  getAllText,
  undoGrouping,
  undoGroupingWithRefresh,
  RefreshAfterDBChange
}
