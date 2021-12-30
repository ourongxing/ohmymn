import { MbBook, MbTopic } from "./NoteDatabase"

interface pic {
  paint: string
  size: unknown
}

interface excerptPic extends pic {
  selLst: {
    [key: number]: {
      rotation: number
      imgRect: unknown
      rect: unknown
      pageNo: number
    }
  }
}

export type noteComment = textComment | htmlComment | linkComment | paintComment

/**
 * 基本的Comment，合并Note时其title也被合并为此类型
 */
export interface textComment {
  type: "TextNote"
  text: string
  /**为被合并Note的内容时存在*/
  noteid?: string
}
/**
 * 复制html内容进Note时产生
 */
export interface htmlComment {
  type: "HtmlNote"
  htmlSize: DictObj
  rtf: DictObj
  html: string
  text: string
  /**为被合并Note的内容时存在*/
  noteid?: string
}
/**
 * 合并Note时产生
 */
export type linkComment = linkComment_text | linkComment_pic

export interface linkComment_text {
  type: "LinkNote"
  noteid: string
  q_htext: textComment["text"]
}

export interface linkComment_pic {
  type: "LinkNote"
  noteid: string
  q_htext?: textComment["text"]
  q_hpic: pic
}

export interface paintComment extends pic {
  type: "PaintNote"
}

export interface LinkedNote {
  summary: boolean
  noteid: string
  linktext: string
}

export class MbBookNote {
  excerptText?: string
  noteTitle?: string
  /**int */
  colorIndex: number
  /**int */
  fillIndex: number
  // mindmapPosition: CGPoint

  readonly noteId?: string
  readonly docMd5?: string
  readonly notebookId?: string
  /** int */
  readonly startPage?: number
  /** int */
  readonly endPage?: number
  readonly startPos?: string
  readonly endPos?: string
  readonly excerptPic?: excerptPic
  readonly createDate?: Date
  readonly modifiedDate?: Date
  /** list of media hash seprated by '-' */
  readonly mediaList?: string
  readonly originNoteId?: string
  readonly mindmapBranchClose?: number
  readonly notesText?: string
  readonly groupNoteId?: string

  readonly comments: noteComment[]

  readonly parentNote?: MbBookNote
  readonly linkedNotes: LinkedNote[]
  readonly childNotes: MbBookNote[]
  /**
   * Array of summarized note-id
   */
  readonly summaryLinks: string[]

  /** int */
  readonly zLevel?: number
  readonly hidden?: boolean
  /** int */
  readonly toc?: number
  readonly annotation?: boolean
  readonly textFirst?: boolean
  /** int */
  readonly groupMode?: number
  /** int */
  readonly flashcard?: number
  /** int */
  readonly summary: number
  /** int */
  readonly flagged?: number
  readonly textHighlight?: {
    highlight_text: string
    coords_hash: string
    maskList?: string[]
    textSelLst?: any[]
  }
  readonly options?: DictObj

  paste(): void
  clearFormat(): void
  /**
   * @returns NSString*
   */
  allNoteText(): string
  /**
   * @param note MbBookNote*
   */
  merge(note: MbBookNote): void
  /**
   * @param html NSString*
   * @param text NSString*
   * @param tag NSString*
   */
  appendHtmlComment(html: string, text: string, tag: string): void
  /**
   * @param text NSString*
   */
  appendTextComment(text: string): void
  /**
   * @param note MbBookNote*
   */
  appendNoteLink(note: MbBookNote): void
  /**
   * @param index NSInteger
   */
  removeCommentByIndex(index: number): void
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
