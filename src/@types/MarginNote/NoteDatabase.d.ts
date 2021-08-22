export {}
declare global {
  class MbBook {
    readonly currentTopicId?: string;
    readonly lastVisit?: Date;
    readonly docMd5?: string;
    readonly pathFile?: string;
    readonly docTitle?: string;
  }

  class MbTopic {
    title?: string;
    readonly topicId?: string;
    readonly lastVisit?: Date;
    readonly mainDocMd5?: string;
    readonly historyDate?: Date;
    readonly syncMode?: number | boolean;
    readonly categoryList?: string;
    readonly hashtags?: string;
    readonly docList?: string;
    readonly options?: DictObj;
    readonly documents?: Array<any>;
    readonly notes?: Array<any>;
    hideLinksInMindMapNode: boolean;
  }

  class MbModelTool {
    /**
     * not accessible as a static function in global scope, use {@link Database} instead
     * @returns MbModelTool*
     */
    // static sharedInstance(): MbModelTool;
    /**
     * @param topicid NSString*
     */
    getNotebookById(topicid: string): WrapperObj<MbTopic> | undefined;
    /**
     * @returns NSData*
     * @param hash NSString*
     */
    getMediaByHash(hash: string): NSData | undefined;
    /**
     * @param noteid NSString*
     */
    getNoteById(noteid: string): WrapperObj<MbBookNote> | undefined;
    /**
     * @param md5 NSString*
     */
    getDocumentById(md5: string): WrapperObj<MbBook> | undefined;
    /**
     * @param noteid NSString*
     * @param topicid NSString*
     */
    getFlashcardByNoteId(
      noteid: string,
      topicid: string
    ): WrapperObj<MbBookNote> | undefined;
    /**
     * @returns NSArray*
     * @param noteid NSString*
     */
    getFlashcardsByNoteId(noteid: string): Array<MbBookNote> | undefined;
    /**
     * @param noteid NSString*
     */
    hasFlashcardByNoteId(noteid: string): boolean;
    savedb(): void;
    /**
     * @returns NSArray*
     */
    allNotebooks(): Array<MbTopic>;
    /**
     * @returns NSArray*
     */
    allDocuments(): Array<MbBook>;
    /**
     * @param topicid NSString*
     */
    setNotebookSyncDirty(topicid: string): void;
    /**
     * @returns NSArray*
     * @param topicid NSString*
     * @param key NSString*
     */
    saveHistoryArchiveKey(topicid: string, key: string): Array<any>;
    /**
     * @returns NSArray*
     * @param topicid NSString*
     * @param key NSString*
     */
    loadHistoryArchiveKey(topicid: string, key: string): Array<any>;
    /**
     * @param noteid NSString*
     */
    deleteBookNote(noteid: string): void;
    /**
     * @param noteid NSString*
     */
    deleteBookNoteTree(noteid: string): void;
    /**
     * @returns NSArray*
     * @param notes NSArray*
     * @param topicid NSString*
     */
    cloneNotesToTopic(
      notes: Array<MbBookNote>,
      topicid: string
    ): Array<MbBookNote>;
    /**
     * @returns NSArray*
     * @param notes NSArray*
     * @param topicid NSString*
     */
    cloneNotesToFlashcardsToTopic(
      notes: Array<MbBookNote>,
      topicid: string
    ): Array<MbBookNote>;
    /**
     * @param topicid NSString*
     * @param storePath NSString*
     */
    exportNotebookStorePath(topicid: string, storePath: string): boolean;
    /**
     * @param storePath NSString*
     */
    importNotebookFromStorePathMerge(
      storePath: string,
      merge: boolean
    ): WrapperObj<any>;
  }

  const Database: {
    /**
     * accessor to MbModelTool in global scope
     * @returns MbModelTool*
     */
    sharedInstance(): MbModelTool;
  };
}
