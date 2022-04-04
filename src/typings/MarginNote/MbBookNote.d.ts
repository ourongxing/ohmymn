import { Dict } from "lang"
import { groupMode } from "./enum"
import { MbBook, MbTopic } from "./NoteDatabase"
/**
 * @class MbBookNote
 */
export interface MNPic {
  /** 
   * hash value, used to get image info. Usually used to get [base64](https://en.wikipedia.org/wiki/Base64) image data.
   * For example: {@link MbBookNote.excerptPic}
   * @type {string}
   * @memberof MNPic
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
   * 
  */
  paint: string
  size: unknown
}

/**
 * inherit from {@link MNPic}
 * @class MbBookNote
 */
export interface excerptPic extends MNPic {
  selLst: {
    [key: number]: {
      /**
       * Rotation of the picture
       * 
       * @type {number}
       * @memberof excerptPic
       */
      rotation: number
      /**
       * Cannot be read(which means you can only log it and see it but cannot transform it to any type by using JS or TS)，but you can use end pos and start pos to get the position and size
       * @type {NSValue}
       * @memberof excerptPic
       */
      imgRect: NSValue
      /**
       * CGRect Value
       * 
       * @type {NSValue}
       * @memberof excerptPic
       */
      rect: NSValue
      /**
       * @type {number}
       * @memberof excerptPic
       */
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
   * @memberof textComment
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
   * @memberof textComment
   */
  text: string
  /**
   * NoteID of the note
   * @type {string}
   * @memberof textComment
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
   * @memberof htmlComment
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
   * @memberof htmlComment
   */
  htmlSize: DictObj
  /**
   * RTF
   * @type {DictObj}
   * @memberof htmlComment
   */
  rtf: DictObj
  /**
   * HTML code
   * @type {string}
   * @memberof htmlComment
   */
  html: string
  /**
   * Text
   * @type {string}
   * @memberof htmlComment
   */
  text: string
  /**
   * NoteID of the note
   * @type {string}
   * @memberof htmlComment
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
   * @memberof linkComment_text
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
   * @memberof linkComment_text
   */
  noteid: string
  /**
   * Text of the comment : {@link textComment.text}
   * @type {string}
   * @memberof linkComment_text
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
   * @memberof linkComment_pic
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
   * @memberof linkComment_pic
   */
  noteid: string
  /**
   * Text of the comment : {@link textComment.text}
   * @type {string}
   * @memberof linkComment_pic
   */
  q_htext?: textComment["text"]
  /**
   * Image of the comment : {@link MNPic}
   * @type {string}
   * @memberof linkComment_pic
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
   * @memberof paintComment
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
   * @memberof LinkedNote
   */
  summary: boolean
  /**
   * nodeid of the linked note
   * @type {string}
   * @memberof LinkedNote
   */
  noteid: string
  /**
   * text of the linked note
   * @type {string}
   * @memberof LinkedNote
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
   * @memberof MbBookNote
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
   * @memberof MbBookNote
   */
  noteTitle?: string
  /**
   * int 
   * Index of the color
   * @type {number}
   * @memberof MbBookNote
  */
  colorIndex: number
  /**
   * int
   * @type {number}
   * @memberof MbBookNote
  */
  fillIndex: number
  // mindmapPosition: CGPoint
  /**
   * Note id, usually get from sender
   * const noteid = sender.userInfo.noteid;
   * @type {string}
   * @memberof MbBookNote
   */
  readonly noteId?: string
  /**
   * MD5 of the document
   *
   * @type {string}
   * @memberof MbBookNote
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
   * @memberof MbBookNote
   */
  readonly notebookId?: string
  /** 
   * Page number of the start position(int)
   * @type {number}
   * @memberof MbBookNote
  */
  readonly startPage?: number
  /** 
   * Page number of the end position(int)
   * @type {number}
   * @memberof MbBookNote
  */
  readonly endPage?: number
  /**
   * Used to get the size of the picture, which can not be directly getten from {@link excerptPic.selLst} imgrect
   * 
   * @type {string}
   * @memberof MbBookNote
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
   * @memberof MbBookNote
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
   * @memberof MbBookNote
   */
  readonly excerptPic?: excerptPic
  /**
   * Date of the note created
   *
   * @type {Date}
   * @memberof MbBookNote
   */
  readonly createDate?: Date
  /**
   * Date of the note modified
   *
   * @type {Date}
   * @memberof MbBookNote
   */
  readonly modifiedDate?: Date
  /** 
   * List of media hash seprated by '-' 
   * @type {string}
   * @memberof MbBookNote
  */
  readonly mediaList?: string
  /**
   * Origin note id
   *
   * @type {string}
   * @memberof MbBookNote
   */
  readonly originNoteId?: string
  /**
   * 
   *
   * @type {number}
   * @memberof MbBookNote
   */
  readonly mindmapBranchClose?: number
  /**
   * 
   *
   * @type {string}
   * @memberof MbBookNote
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
   * @memberof MbBookNote
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
   * @memberof MbBookNote
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
   * @memberof MbBookNote
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
   * @memberof MbBookNote
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
   * @memberof MbBookNote
   */
  readonly childNotes?: MbBookNote[]
  /**
   * Array of summarized note-id
   * 
   * @type {string[]}
   * @memberof MbBookNote
   */
  readonly summaryLinks: string[]

  /** 
   * int
   * @type {number}
   * @memberof MbBookNote  
   */
  readonly zLevel?: number
  /**
   * Show if the card is hidden
   *
   * @type {boolean}
   * @memberof MbBookNote
   */
  readonly hidden?: boolean
  /** 
   * int 
   * @type {number}
   * @memberof MbBookNote
   */
  readonly toc?: number
  /**
   *
   * @type {boolean}
   * @memberof MbBookNote
   */
  readonly annotation?: boolean
  /**
   *
   *
   * @type {boolean}
   * @memberof MbBookNote
   */
  readonly textFirst?: boolean
  /** 
   * int 
   * @type {groupMode}
   * @memberof MbBookNote
   */
  readonly groupMode?: groupMode
  /** 
   * int 
   * @type {number}
   * @memberof MbBookNote
   */
  readonly flashcard?: number
  /** 
   * int 
   * @type {number}
   * @memberof MbBookNote
   */
  readonly summary: number
  /** 
   * int 
   * @type {number}
   * @memberof MbBookNote
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
   * @memberof MbBookNote
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
  appendHtmlComment(html: string, text: string, size:CGSize, tag: string): void
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
       * @memberof Note
       */
      title: string,
      /** 
       * @type {MbTopic}
       * @memberof Note
      */
      topic: MbTopic,
      /**
       * @type {MbBook}
       * @memberof Note
      */
      book: MbBook
    ): MbBookNote
  }
}
