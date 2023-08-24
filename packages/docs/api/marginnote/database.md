# Database
从全局读取数据，是对数据库操作的封装。

```ts
const Database: {
  /**
   * @recommended use {@link MN.db}
   */
  sharedInstance(): MbModelTool
  /**
   * Transfrom unreadable OC dictionary to JS compatible
   */
  transDictionaryToJSCompatible(dic: any): any
  /**
   * Transfrom unreadable OC array to JS compatible
   */
  transArrayToJSCompatible(arr: any): any
}
```

```ts
export declare class MbModelTool {
  getNotebookById(notebookid: string): MbTopic | undefined
  getMediaByHash(hash: string): NSData | undefined
  getNoteById(noteid: string): MbBookNote | undefined
  getDocumentById(md5: string): MbBook | undefined
  /**
   * Get note in review mode
   */
  getFlashcardByNoteId(
    noteid: string,
    notebookid: string
  ): MbBookNote | undefined
  /**
   * Get notes in review mode
   */
  getFlashcardsByNoteId(noteid: string): MbBookNote[] | undefined
  /**
   * Whether has note in review mode
   */
  hasFlashcardByNoteId(noteid: string): boolean
  savedb(): void
  /**
   * Fetch all notebooks
   */
  allNotebooks(): MbTopic[]
  /**
   * Fetch all documents
   */
  allDocuments(): MbBook[]
  setNotebookSyncDirty(notebookid: string): void
  saveHistoryArchiveKey(notebookid: string, key: string): any[]
  loadHistoryArchiveKey(notebookid: string, key: string): any[]
  deleteBookNote(noteid: string): void
  /**
   * Delete note and its all descendant notes
   */
  deleteBookNoteTree(noteid: string): void
  /**
   * Clone notes to a notebook, and return the cloned notes
   */
  cloneNotesToTopic(notes: MbBookNote[], notebookid: string): MbBookNote[]
  cloneNotesToFlashcardsToTopic(
    notes: MbBookNote[],
    notebookid: string
  ): MbBookNote[]
  exportNotebookStorePath(notebookid: string, storePath: string): boolean
  importNotebookFromStorePathMerge(storePath: string, merge: boolean): any
  /**
   * Get handwriting notes in notebook mindmap
   */
  getSketchNotesForMindMap(notebookid: string): MbBookNote[]
  getSketchNotesForDocumentMd5Page(
    notebookid: string,
    docmd5: string,
    page: number
  ): MbBookNote[]
}
```

## SQLiteDatabase
如果你想直接访问数据库，十分不建议，数据库数据结构非常复杂，而且直接修改容易损坏数据库。
```ts
declare global {
  const SQLiteDatabase: {
    databaseWithPath(path: string): SQLiteDatabase
  }
}

export declare type SQLiteDatabase = {
  open(): boolean
  close(): boolean
  executeQueryWithArgumentsInArray(sql: string, args: any[]): SQLiteResultSet
}

export declare class SQLiteResultSet {
  stringForColumn(columnName: string): string
  next(): boolean
  close(): void
  resultDictionary(): DictObj
}
```
但是你确实可以通过这个读取 SQLite 数据库。比如 OhMyMN 就通过这个方法来读取来一个词典数据库，查看 [源码](https://github.com/ourongxing/ohmymn/blob/929f62c4ad5f62ae7f9451b39f110172074595dd/packages/addon/src/modules/autocomplete/utils.ts#L153)。