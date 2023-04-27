import { MbBookNote } from "./MbBookNote"
import type { NSValue, NSData, DictObj } from ".."
import { MN } from "src/high-level"

export const enum NotebookType {
  Hiden = 0,
  Doc = 1,
  MindMap = 2,
  FlashCard = 3
}

interface TextContent {
  /**
   * @example
   * String.fromCharCode(Number(char))
   */
  readonly char: string
  readonly rect: NSValue
}

/**
 * MarginNote document object
 */
export declare class MbBook {
  /**
   * Last notebook which the document is in and opened
   */
  readonly currentTopicId?: string
  /**
   * Date of last visit
   */
  readonly lastVisit?: Date
  /**
   * docMd5 of the document
   */
  readonly docMd5?: string
  /**
   * pathFile of the document
   */
  readonly pathFile?: string
  /**
   * Title of the document
   */
  readonly docTitle?: string
  /**
   * Page count of the document
   */
  readonly pageCount: number
  /**
   * Content of text layer of the document, not including OCR Pro layer
   * Each row and each character is an element of the array
   */
  textContentsForPageNo(pageNo: number): TextContent[][]
}

/**
 * MarginNote notebook object
 */
export declare class MbTopic {
  /**
   * notebook title, can be modified
   */
  title?: string
  /**
   * nodebook id
   */
  readonly topicId?: string
  readonly lastVisit?: Date
  /**
   * main document md5
   */
  readonly mainDocMd5?: string
  readonly historyDate?: Date
  readonly syncMode?: number | boolean
  readonly categoryList?: string
  readonly hashtags?: string
  readonly docList?: string
  readonly options?: DictObj
  readonly documents?: MbBook[]
  readonly notes?: MbBookNote[]
  readonly flags: NotebookType
  hideLinksInMindMapNode: boolean
}

/**
 * MarginNote database object
 */
export declare class MbModelTool {
  getNotebookById(notebookid: string): MbTopic | undefined
  getMediaByHash(hash: string): NSData | undefined
  getNoteById(noteid: string): MbBookNote | undefined
  getDocumentById(md5: string): MbBook | undefined
  getFlashcardByNoteId(
    noteid: string,
    notebookid: string
  ): MbBookNote | undefined
  getFlashcardsByNoteId(noteid: string): MbBookNote[] | undefined
  hasFlashcardByNoteId(noteid: string): boolean
  savedb(): void
  allNotebooks(): MbTopic[]
  allDocuments(): MbBook[]
  setNotebookSyncDirty(notebookid: string): void
  saveHistoryArchiveKey(notebookid: string, key: string): any[]
  loadHistoryArchiveKey(notebookid: string, key: string): any[]
  deleteBookNote(noteid: string): void
  deleteBookNoteTree(noteid: string): void
  cloneNotesToTopic(notes: MbBookNote[], notebookid: string): MbBookNote[]
  cloneNotesToFlashcardsToTopic(
    notes: MbBookNote[],
    notebookid: string
  ): MbBookNote[]
  exportNotebookStorePath(notebookid: string, storePath: string): boolean
  importNotebookFromStorePathMerge(storePath: string, merge: boolean): any
  getSketchNotesForMindMap(notebookid: string): MbBookNote[]
  getSketchNotesForDocumentMd5Page(
    notebookid: string,
    docmd5: string,
    page: number
  ): MbBookNote[]
}

declare global {
  const Database: {
    /**
     * @recommended use {@link MN.db}
     */
    sharedInstance(): MbModelTool
    transDictionaryToJSCompatible(dic: any): any
    transArrayToJSCompatible(arr: any): any
  }
}
