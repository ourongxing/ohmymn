import { MbBookNote } from "./MbBookNote"
interface TextContent {
  /** decimal unicode value, you should change to hexadecimal, and append \u */
  readonly char: string
  readonly rect: NSValue
}
export class MbBook {
  /**
   * Current topic ID
   */
  readonly currentTopicId?: string
  /**
   * Date of last visit
   */
  readonly lastVisit?: Date
  /**
   * docMd5 of the book
   */
  readonly docMd5?: string
  /**
   * pathFile of the book
   */
  readonly pathFile?: string
  /**
   * Title of the book
   */
  readonly docTitle?: string
  readonly pageCount: number
  textContentsForPageNo(pageNo: number): TextContent[][]
}

export class MbTopic {
  title?: string
  readonly topicId?: string
  readonly lastVisit?: Date
  readonly mainDocMd5?: string
  readonly historyDate?: Date
  readonly syncMode?: number | boolean
  readonly categoryList?: string
  readonly hashtags?: string
  readonly docList?: string
  readonly options?: DictObj
  readonly documents?: Array<any>
  readonly notes?: Array<any>
  hideLinksInMindMapNode: boolean
}

export class MbModelTool {
  /**
   * not accessible as a static function in global scope, use {@link Database} instead
   * @returns MbModelTool*
   */
  // static sharedInstance(): MbModelTool;
  /**
   * get Notebook by ID
   * @param topicid NSString*
   * @returns MbTopic*
   * @example
   * ```
   * Database.sharedInstance().getNotebookById(node.notebookId)
   * ```
   */
  getNotebookById(topicid: string): WrapperObj<MbTopic> | undefined
  /**
   * @returns NSData*
   * @param hash NSString*
   *
   */
  getMediaByHash(hash: string): NSData | undefined
  /**
   * @param noteid NSString*
   * @returns MbBookNote*
   */
  getNoteById(noteid: string): WrapperObj<MbBookNote> | undefined
  /**
   * @param md5 NSString*
   * @returns MbBookNote*
   */
  getDocumentById(md5: string): WrapperObj<MbBook> | undefined
  /**
   * @param noteid NSString*
   * @param topicid NSString*
   * @returns MbBookNote*
   */
  getFlashcardByNoteId(
    noteid: string,
    topicid: string
  ): WrapperObj<MbBookNote> | undefined
  /**
   * @returns NSArray*
   * @param noteid NSString*
   *
   */
  getFlashcardsByNoteId(noteid: string): Array<MbBookNote> | undefined
  /**
   * @param noteid NSString*
   * @returns boolean
   */
  hasFlashcardByNoteId(noteid: string): boolean
  /**
   * @returns void
   */
  savedb(): void
  /**
   * @returns NSArray*
   */
  allNotebooks(): Array<MbTopic>
  /**
   * @returns NSArray*
   */
  allDocuments(): Array<MbBook>
  /**
   * @param topicid NSString*
   * @returns void
   */
  setNotebookSyncDirty(topicid: string): void
  /**
   * @returns NSArray*
   * @param topicid NSString*
   * @param key NSString*
   */
  saveHistoryArchiveKey(topicid: string, key: string): Array<any>
  /**
   * @returns NSArray*
   * @param topicid NSString*
   * @param key NSString*
   */
  loadHistoryArchiveKey(topicid: string, key: string): Array<any>
  /**
   * @param noteid NSString*
   * @returns void
   */
  deleteBookNote(noteid: string): void
  /**
   * @param noteid NSString*
   * @returns void
   */
  deleteBookNoteTree(noteid: string): void
  /**
   * @returns NSArray*
   * @param notes NSArray*
   * @param topicid NSString*
   */
  cloneNotesToTopic(
    notes: Array<MbBookNote>,
    topicid: string
  ): Array<MbBookNote>
  /**
   * @returns NSArray*
   * @param notes NSArray*
   * @param topicid NSString*
   */
  cloneNotesToFlashcardsToTopic(
    notes: Array<MbBookNote>,
    topicid: string
  ): Array<MbBookNote>
  /**
   * @param topicid NSString*
   * @param storePath NSString*
   * @returns boolean
   */
  exportNotebookStorePath(topicid: string, storePath: string): boolean
  /**
   * @param storePath NSString*
   * @returns WrapperObj<any>
   */
  importNotebookFromStorePathMerge(
    storePath: string,
    merge: boolean
  ): WrapperObj<any>
}

declare global {
  class Database {
    /**
     * accessor to MbModelTool in global scope
     * @returns MbModelTool*
     */
    static sharedInstance(): MbModelTool
    static transDictionaryToJSCompatible(dic: any): any
    static transArrayToJSCompatible(arr: any): any
  }
}
