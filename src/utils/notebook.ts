import { log } from "./public"

/**
 * 获取选中的卡片
 */
const getSelectNodes = (): MbBookNote[] => {
  const MindMapNodes: any[] = self.studyController.notebookController.mindmapView.selViewLst
  if (MindMapNodes) return MindMapNodes.map(item => item.note.note)
  else return []
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
      notes.push(Database.sharedInstance().getNoteById(comment.noteid)!)
  }
  return notes
}

const getNoteById = (noteid: string): MbBookNote => {
  return Database.sharedInstance().getNoteById(noteid)!
}

/**
 * 可撤销的动作，所有修改数据的动作都应该用这个方法包裹
 */
const undoGrouping = (notebookid: string, action: () => void) => {
  UndoManager.sharedInstance().undoGrouping("_NAME_", notebookid, () => {
    action()
    // 同步修改到数据库
    Database.sharedInstance().setNotebookSyncDirty(notebookid)
  })
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo('RefreshAfterDBChange', self, { topicid: notebookid })
}

const getCommentIndex = (node: MbBookNote, commentNote: MbBookNote) => {
  const comments = node.comments
  // 除了抛出异常，没办法终止 foreach
  // comments.forEach((value, index) => {
  //   if (value.type == "LinkNote" && value.noteid == commentNote.noteId)
  //     return index
  // })
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i]
    // 如果直接用 comments[i] 貌似不能触发类型保护
    if (comment.type == "LinkNote" && comment.noteid == commentNote.noteId)
      return i
  }
  return -1
}

export {
  getSelectNodes,
  excerptNotes,
  undoGrouping,
  getCommentIndex,
  getNoteById
}