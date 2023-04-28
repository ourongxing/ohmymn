import { StudyMode, MbBookNote } from "../low-level"
import { MN, postNotification } from "."

/**
 * Check if a url is a note link.
 * @param url note link
 */
export function isNoteLink(url: string) {
  return url.startsWith("marginnote3app://note/")
}

/**
 * Check if a note is exist
 * @param note MbBookNote or noteid
 */
export function isNoteExist(note: MbBookNote | string) {
  if (typeof note === "string") return MN.db.getNoteById(note) ? true : false
  else return MN.db.getNoteById(note.noteId) ? true : false
}

/**
 * Cancellable actions, all actions that will modify data should be wrapped in this method. And refresh after action done.
 * @param f Action need to be cancelled.
 */
export function undoGroupingWithRefresh(f: () => void) {
  if (MN.currnetNotebookid) {
    UndoManager.sharedInstance().undoGrouping(
      String(Date.now()),
      MN.currnetNotebookid,
      f
    )
    MN.db.setNotebookSyncDirty(MN.currnetNotebookid)
    postNotification("RefreshAfterDBChange", {
      notebookid: MN.currnetNotebookid
    })
  }
}

/**
 * Remove the highlight symbol in the text.
 */
export function removeHighlight(text: string) {
  if (text) return text.replace(/\*\*/g, "")
  return text
}

/**
 * Get a note link as the document link.
 */
export function getDocURL() {
  if (
    MN.studyController.studyMode !== StudyMode.study ||
    !MN.currentDocmd5 ||
    MN.currentDocmd5 === "00000000" ||
    !MN.currnetNotebookid
  )
    return
  const notebook = MN.db.getNotebookById(MN.currnetNotebookid)!
  const note = notebook.notes?.find(
    k => k.docMd5 === MN.currentDocmd5 && k.modifiedDate
  )
  return note?.noteId
    ? `marginnote3app://note/${note.noteId}`
    : `marginnote3app://notebook/${MN.currnetNotebookid}`
}
