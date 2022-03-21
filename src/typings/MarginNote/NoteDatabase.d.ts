import { MbBookNote } from "./MbBookNote"
/**
 * @property {string} currentTopicId
 * @property {Date} lastVisit
 * @property {string} docMd5
 * @property {string} pathFile
 * @property {string} docTitle
 */
export class MbBook {
  /**
   * Current topic ID
   *
   * @type {string}
   * @memberof MbBook
   */
  readonly currentTopicId?: string
  /**
   * Date of last visit
   *
   * @type {Date}
   * @memberof MbBook
   */
  readonly lastVisit?: Date
  /**
   * docMd5 of the book
   *
   * @type {string}
   * @memberof MbBook
   */
  readonly docMd5?: string
  /**
   * pathFile of the book
   *
   * @type {string}
   * @memberof MbBook
   */
  readonly pathFile?: string
  /**
   * Title of the book
   *
   * @type {string}
   * @memberof MbBook
   */
  readonly docTitle?: string
}

/**
 * @property {string} title
 * @property {string} topicId
 * @property {Date} lastVisit
 * @property {string} mainDocMd5
 * @property {number|boolean} syncMode
 * @property {string} categoryList
 * @property {string} hashtags
 * @property {string} docTitle
 * @property {DictObj} options
 * @property {Array<any>} documents
 * @property {Array<any>} notes
 * @property {boolean} hideLinksInMindMapNode
 */
export class MbTopic {
  /**
   *
   * @type {string}
   * @memberof MbTopic
   */
  title?: string
  /**
   * 
   *
   * @type {string}
   * @memberof MbTopic
   */
  readonly topicId?: string
  /**
   *
   *
   * @type {Date}
   * @memberof MbTopic
   */
  readonly lastVisit?: Date
  /**
   *
   *
   * @type {string}
   * @memberof MbTopic
   */
  readonly mainDocMd5?: string
  /**
   *
   *
   * @type {Date}
   * @memberof MbTopic
   */
  readonly historyDate?: Date
  /**
   *
   *
   * @type {(number | boolean)}
   * @memberof MbTopic
   */
  readonly syncMode?: number | boolean
  /**
   *
   *
   * @type {string}
   * @memberof MbTopic
   */
  readonly categoryList?: string
  /**
   *
   *
   * @type {string}
   * @memberof MbTopic
   */
  readonly hashtags?: string
  /**
   *
   *
   * @type {string}
   * @memberof MbTopic
   */
  readonly docList?: string
  /**
   *
   *
   * @type {DictObj}
   * @memberof MbTopic
   */
  readonly options?: DictObj
  /**
   *
   *
   * @type {Array<any>}
   * @memberof MbTopic
   */
  readonly documents?: Array<any>
  /**
   *
   *
   * @type {Array<any>}
   * @memberof MbTopic
   */
  readonly notes?: Array<any>
  /**
   *
   *
   * @type {boolean}
   * @memberof MbTopic
   */
  hideLinksInMindMapNode: boolean
}

/**
 * @function getNotebookById
 * @function getMediaByHash
 * @function getNoteById
 * @function getDocumentById
 * @function getFlashcardByNoteId
 * @function getFlashcardsByNoteId
 * @function hasFlashcardByNoteId
 * @function savedb
 * @function allNotebooks
 * @function allDocuments
 * @function setNotebookSyncDirty
 * @function saveHistoryArchiveKey
 * @function loadHistoryArchiveKey
 * @function deleteBookNote
 * @function deleteBookNoteTree
 * @function cloneNotesToTopic
 * @function cloneNotesToFlashcardsToTopic
 * @function exportNotebookStorePath
 * @function importNotebookFromStorePathMerge
 */
export class MbModelTool {
  /**
   * not accessible as a static function in global scope, use {@link Database} instead
   * @returns {MbModelTool*}
   */
  // static sharedInstance(): MbModelTool;
  /**
   * get Notebook by ID
   * @param topicid NSString*
   * @returns {MbTopic*}
   * @memberof MbModelTool
   * @example
   * ```
   * Database.sharedInstance().getNotebookById(node.notebookId)
   * ```
   */
  getNotebookById(topicid: string): WrapperObj<MbTopic> | undefined
  /**
   * @returns {NSData*}
   * @param hash NSString*
   * @memberof MbModelTool
   * 
   */
  getMediaByHash(hash: string): NSData | undefined
  /**
   * @param noteid NSString*
   * @returns {MbBookNote*}
   * @memberof MbModelTool
   */
  getNoteById(noteid: string): WrapperObj<MbBookNote> | undefined
  /**
   * @param md5 NSString*
   * @returns {MbBookNote*}
   * @memberof MbModelTool
   */
  getDocumentById(md5: string): WrapperObj<MbBook> | undefined
  /**
   * @param noteid NSString*
   * @param topicid NSString*
   * @returns {MbBookNote*}
   * @memberof MbModelTool
   */
  getFlashcardByNoteId(
    noteid: string,
    topicid: string
  ): WrapperObj<MbBookNote> | undefined
  /**
   * @returns {NSArray*}
   * @param noteid NSString*
   * @memberof MbModelTool
   * 
   */
  getFlashcardsByNoteId(noteid: string): Array<MbBookNote> | undefined
  /**
   * @param noteid NSString*
   * @returns {boolean}
   * @memberof MbModelTool
   */
  hasFlashcardByNoteId(noteid: string): boolean
  /**
   * @memberof MbModelTool
   * @returns {void}
   */
  savedb(): void
  /**
   * @memberof MbModelTool
   * @returns {NSArray*}
   */
  allNotebooks(): Array<MbTopic>
  /**
   * @memberof MbModelTool
   * @returns {NSArray*}
   */
  allDocuments(): Array<MbBook>
  /**
   * @param topicid NSString*
   * @returns {void}
   * @memberof MbModelTool
   */
  setNotebookSyncDirty(topicid: string): void
  /**
   * @returns {NSArray*}
   * @param topicid NSString*
   * @param key NSString*
   * @memberof MbModelTool
   */
  saveHistoryArchiveKey(topicid: string, key: string): Array<any>
  /**
   * @returns {NSArray*}
   * @param topicid NSString*
   * @param key NSString*
   * @memberof MbModelTool
   */
  loadHistoryArchiveKey(topicid: string, key: string): Array<any>
  /**
   * @param noteid NSString*
   * @returns {void}
   * @memberof MbModelTool
   */
  deleteBookNote(noteid: string): void
  /**
   * @param noteid NSString*
   * @returns {void}
   * @memberof MbModelTool
   */
  deleteBookNoteTree(noteid: string): void
  /**
   * @returns {NSArray*}
   * @param notes NSArray*
   * @param topicid NSString*
   * @memberof MbModelTool
   */
  cloneNotesToTopic(
    notes: Array<MbBookNote>,
    topicid: string
  ): Array<MbBookNote>
  /**
   * @returns {NSArray*}
   * @param notes NSArray*
   * @param topicid NSString*
   * @memberof MbModelTool
   */
  cloneNotesToFlashcardsToTopic(
    notes: Array<MbBookNote>,
    topicid: string
  ): Array<MbBookNote>
  /**
   * @param topicid NSString*
   * @param storePath NSString*
   * @returns {boolean}
   * @memberof MbModelTool
   */
  exportNotebookStorePath(topicid: string, storePath: string): boolean
  /**
   * @param storePath NSString*
   * @returns {WrapperObj<any>}
   * @memberof MbModelTool
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
     * @returns {MbModelTool*}
     */
    static sharedInstance(): MbModelTool
  }
}
