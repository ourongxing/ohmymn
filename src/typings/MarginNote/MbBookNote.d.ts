import { GroupMode } from "~/enum"
import { MbBook, MbTopic } from "./NoteDatabase"
/**
 * @class MbBookNote
 */
export interface MNPic {
  /**
   * hash value, used to get image info. Usually used to get [base64](https://en.wikipedia.org/wiki/Base64) image data.
   * For example: {@link MbBookNote.excerptPic}
   */
  paint: string
  size: NSValue
}

/**
 * inherit from {@link MNPic}
 */
export interface excerptPic extends MNPic {
  selLst: {
    [key: number]: {
      /**
       * Rotation of the picture
       */
      rotation: number
      /**
       * Cannot be read(which means you can only log it and see it but cannot transform it to any type by using JS or TS)，
       * but you can use end pos and start pos to get the position and size
       */
      imgRect: NSValue
      /**
       * CGRect Value
       */
      rect: NSValue
      pageNo: number
    }
  }
}
/**
 * All type of comment
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 */
export type noteComment = textComment | htmlComment | linkComment | paintComment

/**
 * Basic Comment，when merging Note, title will be merged of this type
 * Another three types of comments are {@link htmlComment}, {@link textComment}, {@link linkComment}
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 */
export interface textComment {
  type: "TextNote"
  /**
   * Get the content of the comment
   */
  text: string
  /**
   * NoteID of the note
   */
  noteid?: string
}
/**
 * Generate when html copied to note
 * Another three types of comments are {@link textComment}, {@link linkComment}, {@link paintComment}
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 */
export interface htmlComment {
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
 * Link text or picture Comments
 * Another three types of comments are {@link textComment}, {@link htmlComment}, {@link paintComment}
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 * more detail see {@link linkComment_pic} and {@link linkComment_text}
 */
export type linkComment = linkComment_text | linkComment_pic

/**
 * Link text Comments
 * Another related interface is {@link linkComment_pic}, and makes {@link linkComment}
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 */
export interface linkComment_text {
  type: "LinkNote"
  /**
   * NoteID of the note
   */
  noteid: string
  /**
   * Text of the comment : {@link textComment.text}
   */
  q_htext: textComment["text"]
}

/**
 * Link picture Comments
 * Another related interface is {@link linkComment_text}, and makes {@link linkComment}
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 */
export interface linkComment_pic {
  type: "LinkNote"
  /**
   * NoteID of the note
   */
  noteid: string
  /**
   * Text of the comment : {@link textComment.text}
   */
  q_htext?: textComment["text"]
  /**
   * Image of the comment : {@link MNPic}
   */
  q_hpic: MNPic
}

/**
 * Picture comment
 * Another three types of comments are {@link textComment}, {@link htmlComment}, {@link linkComment}
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}, inherit from {@link MNPic}
 */
export interface paintComment extends MNPic {
  type: "PaintNote"
}

/**
 * Type of {@link MbBookNote.linkedNotes}
 */
export interface LinkedNote {
  summary: boolean
  /**
   * nodeid of the linked note
   */
  noteid: string
  /**
   * text of the linked note
   */
  linktext: string
}

export class MbBookNote {
  /**
   * Excerpt text of the note
   */
  excerptText?: string
  /**
   * Title of the note(card)
   */
  noteTitle?: string
  /**
   * int
   * Index of the color
   */
  colorIndex: number
  /**
   * int
   */
  fillIndex: number
  /**
   * not work
   */
  mindmapPosition: CGPoint
  /**
   * Note id, usually get from sender
   * const noteid = sender.userInfo.noteid;
   */
  readonly noteId: string
  /**
   * MD5 of the document
   */
  readonly docMd5?: string
  /**
   * Notebook id, you can get it from lifeCyle
   */
  readonly notebookId?: string
  /**
   * Page number of the start position(int)
   */
  readonly startPage?: number
  /**
   * Page number of the end position(int)
   */
  readonly endPage?: number
  /**
   * Used to get the size of the picture, which can not be directly getten from {@link excerptPic.selLst} imgrect
   */
  readonly startPos?: string
  /**
   * Used to get the size of the picture, which can not be directly getten from {@link excerptPic.selLst} imgrect
   */
  readonly endPos?: string
  /**
   * Excerpt picture of the note
   */
  readonly excerptPic?: excerptPic
  /**
   * Date of the note created
   */
  readonly createDate: Date
  /**
   * Date of the note modified
   */
  readonly modifiedDate?: Date
  /**
   * List of media hash seprated by '-'
   */
  readonly mediaList?: string
  /**
   * Origin note id
   */
  readonly originNoteId?: string
  readonly mindmapBranchClose?: number
  readonly notesText?: string
  /**
   * groupNoteID used to locate the note card
   */
  readonly groupNoteId?: string
  /**
   * Comments of the note card, different from the excerptText
   */
  readonly comments: noteComment[]
  /**
   * Parent-note ID, used to locate the parent note card
   */
  readonly parentNote?: MbBookNote
  /**
   * List of Linked-note ID, used to locate the linked note card
   */
  readonly linkedNotes: LinkedNote[]
  /**
   * List of Child-note ID, used to locate the child note card
   */
  readonly childNotes?: MbBookNote[]
  /**
   * Array of summarized note-id
   */
  readonly summaryLinks: string[]
  /**
   * int
   */
  readonly zLevel?: number
  /**
   * Show if the card is hidden
   */
  readonly hidden?: boolean
  /**
   * int
   */
  readonly toc?: number
  readonly annotation?: boolean
  /**
   * Whether the image has been OCR to text
   */
  readonly textFirst: boolean
  /**
   * int
   */
  readonly groupMode?: GroupMode
  /**
   * int
   */
  readonly flashcard?: number
  /**
   * int
   */
  readonly summary: number
  /**
   * int
   */
  readonly flagged?: number
  readonly textHighlight?: {
    highlight_text: string
    coords_hash: string
    maskList?: string[]
    textSelLst?: any[]
  }
  readonly options?: DictObj

  paste(): void
  /**
   * Clear format of the note
   * @returns void
   */
  clearFormat(): void
  /**
   * @returns NSString*
   */
  allNoteText(): string
  /**
   * @returns void
   * @param note MbBookNote*
   */
  merge(note: MbBookNote): void
  /**
   * Append one HTML comment to the note
   * @returns void
   * @param html NSString*
   * @param text NSString*
   * @param size CGSize
   * @param tag NSString*
   */
  appendHtmlComment(html: string, text: string, size: CGSize, tag: string): void
  /**
   * Append one text comment to the note
   * @returns void
   * @param text NSString*
   */
  appendTextComment(text: string): void
  /**
   * Append Note Link to the note
   * @returns void
   * @param note MbBookNote*
   */
  appendNoteLink(note: MbBookNote): void
  /**
   * Remove comment by index
   */
  removeCommentByIndex(index: number): void
  /**
   * @return 手写笔画数
   */
  getStrokesCount(): number
}

declare global {
  class Note {
    /**
     * @returns MbBookNote*
     * @param title NSString*
     * @param topic MbTopic*
     * @param book MbBook*
     */
    static createWithTitleNotebookDocument(
      title: string,
      topic: MbTopic,
      book: MbBook
    ): MbBookNote
  }
}
