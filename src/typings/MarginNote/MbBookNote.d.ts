import { GroupMode } from "~/enum"
import { MbBook, MbTopic } from "./NoteDatabase"
/**
 * @class MbBookNote
 */
export interface MNPic {
  /**
   * hash value, used to get image info. Usually used to get [base64](https://en.wikipedia.org/wiki/Base64) image data.
   * For example: {@link MbBookNote.excerptPic}
   * @type {string}
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
 *
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 *
 */
export type noteComment = textComment | htmlComment | linkComment | paintComment

/**
 * Basic Comment，when merging Note, title will be merged of this type
 * Another three types of comments are {@link htmlComment}, {@link textComment}, {@link linkComment}
 *
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 */
export interface textComment {
  /**
   * identifier of the comment
   * @type {string}
   * @example
   * ```
   * // Judge if the first comment is a text comment
   * const noteid = sender.userInfo.noteid;
   * const note = Database.sharedInstance().getNoteById(noteid);
   * const comment = note.comment;
   * if(comment[0].type == "TextNote"){
   *  // do something
   * }
   * ```
   */
  type: "TextNote"
  /**
   * Get the content of the comment
   * @type {string}
   */
  text: string
  /**
   * NoteID of the note
   * @type {string}
   */
  noteid?: string
}
/**
 * Generate when html copied to note
 * Another three types of comments are {@link textComment}, {@link linkComment}, {@link paintComment}
 *
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 */
export interface htmlComment {
  /**
   * identifier of the comment
   * @type {string}
   * @example
   * ```
   * // Judge if the first comment is a html comment
   * const noteid = sender.userInfo.noteid;
   * const note = Database.sharedInstance().getNoteById(noteid);
   * const comment = note.comment;
   * if(comment[0].type == "HtmlNote"){
   * // do something
   * }
   * ```
   */
  type: "HtmlNote"
  /**
   * Size of the render image
   * @type {DictObj}
   */
  htmlSize: DictObj
  /**
   * RTF
   * @type {DictObj}
   */
  rtf: DictObj
  /**
   * HTML code
   * @type {string}
   */
  html: string
  /**
   * Text
   * @type {string}
   */
  text: string
  /**
   * NoteID of the note
   * @type {string}
   */
  noteid?: string
}

/**
 * Link text or picture Comments
 * Another three types of comments are {@link textComment}, {@link htmlComment}, {@link paintComment}
 *
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 * more detail see {@link linkComment_pic} and {@link linkComment_text}
 */
export type linkComment = linkComment_text | linkComment_pic

/**
 * Link text Comments
 * Another related interface is {@link linkComment_pic}, and makes {@link linkComment}
 *
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 */
export interface linkComment_text {
  /**
   * identifier of the comment
   * @type {string}
   * @example
   * ```
   * // Judge if the first comment is a link comment
   * const noteid = sender.userInfo.noteid;
   * const note = Database.sharedInstance().getNoteById(noteid);
   * const comment = note.comment;
   * if(comment[0].type == "LinkNote"){
   * // do something
   * }
   * ```
   */
  type: "LinkNote"
  /**
   * NoteID of the note
   * @type {string}
   */
  noteid: string
  /**
   * Text of the comment : {@link textComment.text}
   * @type {string}
   */
  q_htext: textComment["text"]
}

/**
 * Link picture Comments
 * Another related interface is {@link linkComment_text}, and makes {@link linkComment}
 *
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}
 */
export interface linkComment_pic {
  /**
   * identifier of the comment
   * @type {string}
   * @example
   * ```
   * // Judge if the first comment is a link comment
   * const noteid = sender.userInfo.noteid;
   * const note = Database.sharedInstance().getNoteById(noteid);
   * const comment = note.comment;
   * if(comment[0].type == "LinkNote"){
   * // do something
   * }
   * ```
   */
  type: "LinkNote"
  /**
   * NoteID of the note
   * @type {string}
   */
  noteid: string
  /**
   * Text of the comment : {@link textComment.text}
   * @type {string}
   */
  q_htext?: textComment["text"]
  /**
   * Image of the comment : {@link MNPic}
   * @type {string}
   */
  q_hpic: MNPic
}

/**
 * Picture comment
 * Another three types of comments are {@link textComment}, {@link htmlComment}, {@link linkComment}
 *
 * @class MbBookNote
 * Get it by {@link MbBookNote.comment}, inherit from {@link MNPic}
 */
export interface paintComment extends MNPic {
  /**
   * identifier of the comment
   * @type {string}
   * @example
   * ```
   * // Judge if the first comment is a paint comment
   * const noteid = sender.userInfo.noteid;
   * const note = Database.sharedInstance().getNoteById(noteid);
   * const comment = note.comment;
   * if(comment[0].type == "PaintNote"){
   * // do something
   * }
   * ```
   */
  type: "PaintNote"
}

/**
 * Type of {@link MbBookNote.linkedNotes}
 */
export interface LinkedNote {
  /**
   * @type {boolean}
   */
  summary: boolean
  /**
   * nodeid of the linked note
   * @type {string}
   */
  noteid: string
  /**
   * text of the linked note
   * @type {string}
   */
  linktext: string
}

/**
 * @property {string} excerptText
 * @property {string} noteTitle
 * @property {number} colorIndex
 * @property {number} fillIndex
 * @property {string} noteid
 * @property {string} docMd5
 * @property {string} notebookId
 * @property {number} startPage
 * @property {number} endPage
 * @property {string} startPos
 * @property {string} endPos
 * @property {excerptPic} excerptPic
 * @property {Date} createDate
 * @property {Date} modifyDate
 * @property {string} mediaList
 * @property {string} originNoteId
 * @property {number} mindmapBranchClose
 * @property {string} notesText
 * @property {string} groupNoteId
 * @property {noteComment[]} comments
 * @property {MbBookNote} parentNote
 * @property {LinkedNote[]} linkedNotes
 * @property {MbBookNote[]} childNotes
 * @property {string} summaryLinks
 * @property {number} zLevel
 * @property {boolean} hidden
 * @property {number} toc
 * @property {boolean} annotation
 * @property {boolean} textFirst
 * @property {groupMode} groupMode
 * @property {number} flashcard
 * @property {number} summary
 * @property {number} flagged
 * @property {DictObj} textHighlight
 * @property {DictObj} options
 *
 * @function paste
 * @function clearFormat
 * @function allNoteText
 * @function merge
 * @function appendHtmlComment
 * @function appendTextComment
 * @function appendNoteLink
 * @function removeCommentByIndex
 */
export class MbBookNote {
  /**
   * Excerpt text of the note
   * @example
   * ```
   * const noteid = sender.userInfo.noteid;
   * const note = Database.sharedInstance().getNoteById(noteid);
   * const text = note.excerptText;
   * ```
   * @type {string}
   */
  excerptText?: string
  /**
   * Title of the note(card)
   * @example
   * ```
   * const noteid = sender.userInfo.noteid;
   * const note = Database.sharedInstance().getNoteById(noteid);
   * const note.noteTitle = "This is a Test" //Change the title of the note
   * Application.sharedInstance().showHUD(note.noteTitle,self.window,1) //Display the title with showHUD
   * ```
   * @type {string}
   */
  noteTitle?: string
  /**
   * int
   * Index of the color
   * @type {number}
   */
  colorIndex: number
  /**
   * int
   * @type {number}
   */
  fillIndex: number
  // mindmapPosition: CGPoint
  /**
   * Note id, usually get from sender
   * const noteid = sender.userInfo.noteid;
   * @type {string}
   */
  readonly noteId: string
  /**
   * MD5 of the document
   *
   * @type {string}
   */
  readonly docMd5?: string
  /**
   * Notebook id, you can get it from lifeCyle
   * @example
   * ```
   * const notebookWillOpen = (notebookid: string) => {
   * self.notebookid = notebookid
   * }
   * ```
   * @type {string}
   */
  readonly notebookId?: string
  /**
   * Page number of the start position(int)
   * @type {number}
   */
  readonly startPage?: number
  /**
   * Page number of the end position(int)
   * @type {number}
   */
  readonly endPage?: number
  /**
   * Used to get the size of the picture, which can not be directly getten from {@link excerptPic.selLst} imgrect
   *
   * @type {string}
   * @example
   * ```
   * //get the pos and size of the picture
   * const getExcerptArea(note: MbBookNote) {
   * const [x1, y1, x2, y2] = (
   *   reverseEscape(`[${note.startPos},${note.endPos}]`) as number[]
   * ).map(item => Number(item))
   * const width = Math.abs(x1-x2)
   * const height = Math.abs(y1-y2)
   * const output = {"width":width,"height":height}
   * return output
   *},
   * ```
   */
  readonly startPos?: string
  /**
   * Used to get the size of the picture, which can not be directly getten from {@link excerptPic.selLst} imgrect
   *
   * @type {string}
   * @example
   * ```
   * //get the pos and size of the picture
   * const getExcerptArea(note: MbBookNote) {
   * const [x1, y1, x2, y2] = (
   *   reverseEscape(`[${note.startPos},${note.endPos}]`) as number[]
   * ).map(item => Number(item))
   * const width = Math.abs(x1-x2)
   * const height = Math.abs(y1-y2)
   * const output = {"width":width,"height":height}
   * return output
   *},
   * ```
   */
  readonly endPos?: string
  /**
   * Excerpt picture of the note
   * @example
   * ```
   * // Get base64 string of the image
   * const noteid = sender.userInfo.noteid;
   * const note = Database.sharedInstance().getNoteById(noteid);
   * const pic_input = note.excerptPic;
   * const hash = (pic_input?.paint) ? pic_input.paint : ""
   * try{const pic_info = Database.sharedInstance().getMediaByHash(hash)}catch(error){showHUD('Cannot Find the Picture')}
   * const pic_base64 = (pic_info) ? pic_info?.base64Encoding() : ""
   * ```
   * @type {excerptPic}
   */
  readonly excerptPic?: excerptPic
  /**
   * Date of the note created
   *
   * @type {Date}
   */
  readonly createDate: Date
  /**
   * Date of the note modified
   *
   * @type {Date}
   */
  readonly modifiedDate?: Date
  /**
   * List of media hash seprated by '-'
   * @type {string}
   */
  readonly mediaList?: string
  /**
   * Origin note id
   *
   * @type {string}
   */
  readonly originNoteId?: string
  /**
   *
   *
   * @type {number}
   */
  readonly mindmapBranchClose?: number
  /**
   *
   *
   * @type {string}
   */
  readonly notesText?: string
  /**
   * groupNoteID used to locate the note card
   * @example
   * ```
   * // get all comments of the note card
   * const note = getNoteById(note.groupNoteId)
   * const comments = note.comments
   * ```
   * @type {string}
   */
  readonly groupNoteId?: string
  /**
   * Comments of the note card, different from the excerptText
   * @example
   * ```
   * // get all comments of the note card
   * const note = getNoteById(note.groupNoteId)
   * const comments = note.comments
   * ```
   * @type {noteComment[]}
   */
  readonly comments: noteComment[]
  /**
   * Parent-note ID, used to locate the parent note card
   * @example
   * ```
   * \\get ID of the parent note card
   * const note = getNoteById(note.groupNoteId)
   * const parentNoteId = note.parentNoteId
   * const parentNote = getNoteById(parentNoteId)
   * ```
   * @type {MbBookNote}
   */
  readonly parentNote?: MbBookNote
  /**
   * List of Linked-note ID, used to locate the linked note card
   * @example
   * ```
   * // get all linked note card and display
   * const note = getNoteById(note.groupNoteId)
   * const linkedNoteIds = note.linkedNoteIds
   * for(const i = 0; i < linkedNoteIds.length; i++){
   * const linkedNote = getNoteById(linkedNoteIds[i])
   * }
   * ```
   * @type {LinkedNote[]}
   */
  readonly linkedNotes: LinkedNote[]
  /**
   * List of Child-note ID, used to locate the child note card
   * @example
   * ```
   * // get all child note card and display
   * const note = getNoteById(note.groupNoteId)
   * const childNoteIds = note.childNoteIds
   * for(const i = 0; i < childNoteIds.length; i++){
   * const childNote = getNoteById(childNoteIds[i])
   * }
   * ```
   * @type {MbBookNote[]}
   */
  readonly childNotes?: MbBookNote[]
  /**
   * Array of summarized note-id
   *
   * @type {string[]}
   */
  readonly summaryLinks: string[]

  /**
   * int
   * @type {number}
   */
  readonly zLevel?: number
  /**
   * Show if the card is hidden
   *
   * @type {boolean}
   */
  readonly hidden?: boolean
  /**
   * int
   * @type {number}
   */
  readonly toc?: number
  /**
   *
   * @type {boolean}
   */
  readonly annotation?: boolean
  /**
   *
   * Whether the image has been OCR to text
   * @type {boolean}
   */
  readonly textFirst: boolean
  /**
   * int
   * @type {GroupMode}
   */
  readonly groupMode?: GroupMode
  /**
   * int
   * @type {number}
   */
  readonly flashcard?: number
  /**
   * int
   * @type {number}
   */
  readonly summary: number
  /**
   * int
   * @type {number}
   */
  readonly flagged?: number
  /**
   *
   *
   * @type {{
   *     highlight_text: string
   *     coords_hash: string
   *     maskList?: string[]
   *     textSelLst?: any[]
   *   }}
   */
  readonly textHighlight?: {
    highlight_text: string
    coords_hash: string
    maskList?: string[]
    textSelLst?: any[]
  }
  readonly options?: DictObj

  /**
   * @returns void
   */
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
   * @example
   * ```
   * // append a HTML comment to the note, text will be used if html is invalid
   * const note = getNoteById(note.groupNoteId)
   * const html = '<p>This is a comment</p>'
   * const text = 'This is a comment'
   * const size = {width: 100, height: 100}
   * const tag = 'comment' // if use tag = 'MNCKEditor' and install CKEditor add-on, users can edit the comment with CKEditor
   * note.appendComment(html, text, size, tag)
   * ```
   */
  appendHtmlComment(html: string, text: string, size: CGSize, tag: string): void
  /**
   * Append one text comment to the note
   * @returns void
   * @param text NSString*
   * @example
   * ```
   * // append a Text comment to the note
   * const note = getNoteById(note.groupNoteId)
   * const text = 'This is a comment'
   * note.appendTextComment(text)
   * ```
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
   * Index Explanation:
   * index = -1 => excerptPic pr excerptText (excerptText cannot be removed; excerptText can be deconsted if noteTitle exists)
   * index = 0,1,2... => other comments below
   * @returns void
   * @param index NSInteger
   * @example
   * ```
   * // remove the first comment(Note:not the excerptPic or excerptText)
   * const note = getNoteById(note.groupNoteId)
   * note.removeComment(0)
   */
  removeCommentByIndex(index: number): void
  /**
   * @return 手写笔画数
   */
  getStrokesCount(): number
}

declare global {
  /**
   * note
   */
  class Note {
    /**
     * @returns MbBookNote*
     * @param title NSString*
     * @param topic MbTopic*
     * @param book MbBook*
     */
    static createWithTitleNotebookDocument(
      /**
       * @type {string}
       */
      title: string,
      /**
       * @type {MbTopic}
       */
      topic: MbTopic,
      /**
       * @type {MbBook}
       */
      book: MbBook
    ): MbBookNote
  }
}
