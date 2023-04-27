import { DictObj, MNPic, MbBookNote } from ".."

/**
 * Note comments
 * @see {@link MbBookNote.comments}
 */
export type NoteComment = TextComment | HtmlComment | LinkComment | PaintComment

/**
 * Basic Comment, just text you typed
 * @see {@link NoteComment}
 */
export interface TextComment {
  type: "TextNote"
  /**
   * Get the content of the comment
   */
  text: string
  /**
   * NoteID of the note, is only valid after merging the notes
   */
  noteid?: string
}

/**
 * Generate when html copied to note
 * @see {@link NoteComment}
 */
export interface HtmlComment {
  type: "HtmlNote"
  /**
   * Size of the render image
   */
  htmlSize: DictObj
  /**
   * RTF
   */
  rtf: DictObj
  /**
   * HTML code
   */
  html: string
  /**
   * Text
   */
  text: string
  /**
   * NoteID of the note
   */
  noteid?: string
}

/**
 * Picture comment
 * @see {@link NoteComment}
 */
export interface PaintComment extends MNPic {
  type: "PaintNote"
}

/**
 * It not means link to another note and it will be generated when merge notes.
 * The notes merged into is the LinkComment
 * @see {@link NoteComment}
 */
export type LinkComment = LinkCommentText | LinkCommentPic

/**
 * @see {@link LinkComment}
 */
export interface LinkCommentText {
  type: "LinkNote"
  /**
   * NoteID of the note
   */
  noteid: string
  /**
   * Text of the comment
   */
  q_htext: TextComment["text"]
}

/**
 * @see {@link LinkComment}
 */
export interface LinkCommentPic {
  type: "LinkNote"
  /**
   * NoteID of the note
   */
  noteid: string
  /**
   * Text of the comment : {@link TextComment.text}
   */
  q_htext?: TextComment["text"]
  /**
   * Image of the comment : {@link MNPic}
   */
  q_hpic: MNPic
}
