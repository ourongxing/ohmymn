import { StudyMode, MbBookNote } from "../low-level"
import { MN, postNotification } from "."

/**
 * Check if a url is a note link.
 * @param url note link
 */
export function isNoteLink(url: string) {
  return url.startsWith(MN.scheme + "://note/")
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
  if (MN.currnetNotebookId) {
    UndoManager.sharedInstance().undoGrouping(
      String(Date.now()),
      MN.currnetNotebookId,
      f
    )
    MN.db.setNotebookSyncDirty(MN.currnetNotebookId)
    postNotification("RefreshAfterDBChange", {
      notebookid: MN.currnetNotebookId
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
