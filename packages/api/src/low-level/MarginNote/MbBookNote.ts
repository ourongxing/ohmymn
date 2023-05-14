import { DictObj } from ".."
import { NSValue } from "../Foundation"
import { CGPoint, CGSize } from "../UIKit"
import { MbBook, MbTopic } from "./NoteDatabase"
import { NoteComment } from "./NoteComment"

export const enum GroupMode {
  Tree,
  Frame
}
/**
 * Notes of excerpt, mindmap nodes, and flashcards
 * @see {@link NodeNote} for better usage
 */
export declare class MbBookNote {
  /**
   * Excerpt text of the note
   */
  excerptText?: string
  /**
   * Title of the note
   */
  noteTitle?: string
  /**
   * A int value, 0-15
   * Index of the color
   */
  colorIndex: number
  /**
   * A int value, 0-2
   * Index of the fill type
   */
  fillIndex: number
  /**
   * @deprecated
   * not working
   */
  mindmapPosition: CGPoint
  /**
   * Note id
   */
  readonly noteId: string
  /**
   * MD5 of the document
   */
  readonly docMd5?: string
  /**
   * Notebook id
   */
  readonly notebookId?: string
  /**
   * Page number of the start position of the note
   */
  readonly startPage?: number
  /**
   * Page number of the end position of the note
   */
  readonly endPage?: number
  /**
   * Start position of the note, like x,y
   */
  readonly startPos?: string
  /**
   * End position of the note, like x,y
   */
  readonly endPos?: string
  /**
   * Excerpt picture of the note, just the area of you selected
   */
  readonly excerptPic?: ExcerptPic
  /**
   * Date of the note created
   */
  readonly createDate: Date
  /**
   * Date of the note modified
   */
  readonly modifiedDate?: Date
  /**
   * List of media hash value seprated by '-'
   * @example
   * "mediaHash1-mediaHash2-mediaHash3"
   * note.mediaList?.split("-").map(hash => MN.db.getMediaByHash(hash))
   */
  readonly mediaList?: string
  /**
   * Origin note id, will be valid after merging
   */
  readonly originNoteId?: string
  /**
   * Whether the note branch in mindmap is closed
   */
  readonly mindmapBranchClose?: number
  /**
   * All the note text
   * @recommand {@link NodeNote.allText}
   */
  readonly notesText?: string
  /**
   * It Will be valid after merging itself into another note. It's the note id of the note it merged into.
   * @deprecated MarginNote v4.0
   */
  readonly groupNoteId?: string
  /**
   * just the same as {@link MbBookNote.groupNoteId} in MarginNote v4.0
   */
  realGroupNoteIdForTopicId?(nodebookid: string): string
  /**
  //  * Comments of the note, different from the excerptText
   */
  readonly comments: NoteComment[]
  /**
   * Parent-notes of the note
   */
  readonly parentNote?: MbBookNote
  /**
   * List of Linked-note ID, used to locate the linked note card
   */
  readonly linkedNotes: {
    summary: boolean
    /**
     * nodeid of the linked note
     */
    noteid: string
    /**
     * text of the linked note
     */
    linktext: string
  }[]
  /**
   * Child-notes of the note
   */
  readonly childNotes?: MbBookNote[]
  /**
   * Array of summarized note-id
   */
  readonly summaryLinks: string[]
  /**
   * A int value
   */
  readonly zLevel?: number
  /**
   * Whether the card is hidden
   */
  readonly hidden?: boolean
  /**
   * A int value
   */
  readonly toc?: number
  readonly annotation?: boolean
  /**
   * Whether the image has been OCR to text
   */
  readonly textFirst: boolean
  /**
   * Mindmap group mode of the node branch
   */
  readonly groupMode?: GroupMode
  /**
   * A int value
   * Whether the note has a flashcard
   */
  readonly flashcard?: number
  /**
   * A int value
   */
  readonly summary: number
  /**
   * A int value
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
   */
  clearFormat(): void
  /**
   * @recommand {@link NodeNote.allText}
   */
  allNoteText(): string
  /**
   * Merge another note to this note
   */
  merge(note: MbBookNote): void
  /**
   * Append HTML comment to the note
   * @param html HTML text of the comment
   * @param text Pure text of the comment
   * @param size Size of the comment
   * @param tag Markdown editor plugin id. The HTML comment will be rendered by the plugin.
   * @example
   * note.appendHtmlComment(
   *    "```math\n" + res + "\n```",
   *    res,
   *    { width: 420, height: 100 },
   *    "MarkDownEditor"
   *  )
   */
  appendHtmlComment(html: string, text: string, size: CGSize, tag: string): void
  /**
   * Append one text comment to the note
   */
  appendTextComment(text: string): void
  /**
   * Append one text comment to the note, but it will be rendered as Markdown
   */
  appendMarkdownComment?(text: string): void
  /**
   * Append Note Link to the note
   */
  appendNoteLink(note: MbBookNote): void
  /**
   * Remove comment by index
   */
  removeCommentByIndex(index: number): void
  /**
   * Number of handwritten strokes
   */
  getStrokesCount(): number
}

/**
 * Base type of the picture in MarginNote
 */
export interface MNPic {
  /**
   * A hash value. Use it to get the picture from {@link MN.db.getMediaByHash} and encode it to base64
   * @example
   * MN.db.getMediaByHash(pic.paint)?.base64Encoding()
   */
  paint: string
  /**
   * CGSize, use {@link CGSizeValue2CGSize} to convert it to {@link CGSize}
   */
  size: NSValue
}

/**
 * The area of the excerpt
 */
export interface ExcerptPic extends MNPic {
  selLst: {
    [key: number]: {
      /**
       * Rotation of the picture
       */
      rotation: number
      /**
       * CGRect Value, the position of the picture in the note
       * use {@link CGRectValue2CGRect} to convert it to {@link CGRect}
       */
      rect: NSValue
      /**
       * CGRect Value, same as rect
       */
      imgRect: NSValue
      pageNo: number
    }
  }
}

declare global {
  const Note: {
    /**
     * Used to create a new note with title, notebook and document.
     * It can't be created to a specific position now.
     * @returns MbBookNote*
     * @example
     * Note.createWithTitleNotebookDocument('title', current-topic, current-book)
     */
    createWithTitleNotebookDocument(
      title: string,
      notebook: MbTopic,
      doc: MbBook
    ): MbBookNote
  }
}
