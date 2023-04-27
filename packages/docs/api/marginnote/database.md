# Database

```ts
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
```