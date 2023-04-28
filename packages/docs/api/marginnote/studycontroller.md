---
outline: deep
---
# StudyController

学习模式下整个界面的控制器。

UI 的嵌套结构如下：

- StudyController
  - [NotebookController](#notebookcontroller)
    - [OutlineView](#outlineview)
    - [MindMapView](#mindmapview)
      - [MindMapNode](#mindmapnode)
  - [ReaderController](#readercontroller)
    - [DocumentController](#documentcontroller)

```ts
export declare class StudyController extends UIViewController {
  /**
   * View of the study controller
   * {@link UIView}
   */
  view: UIView
  /**
   * Study Mode
   */
  readonly studyMode: StudyMode
  /**
   * Narrow Mode
   */
  readonly narrowMode: boolean //when narrowmode, book split mode 1 is disabled
  /**
   * DocMap Split Mode
   * {@link DocMapSplitMode}
   */
  docMapSplitMode: DocMapSplitMode
  /**
   * Right Map Mode
   */
  rightMapMode: boolean
  /**
   * Get notebook controller
   * @recommended use {@link MN.notebookController}
   */
  readonly notebookController: NotebookController
  /**
   * Get reader controller
   */
  readonly readerController: ReaderController
  /**
   * @param noteId NSString*
   */
  focusNoteInMindMapById(noteId: string): void
  /**
   * @param noteId NSString*
   */
  focusNoteInDocumentById(noteId: string): void
  refreshAddonCommands(): void
}
```

## NotebookController
```ts
export declare class NotebookController {
  /**
   * View of notebook Controller
   */
  readonly view: UIView
  /**
   * Outline view
   */
  readonly outlineView: OutlineView
  /**
   * MindMap view
   */
  readonly mindmapView: MindMapView
  /**
   * Notebook id
   */
  readonly notebookId?: string
  /**
   * Focus note
   */
  readonly focusNote?: MbBookNote
  /**
   * Visible focus note
   */
  readonly visibleFocusNote?: MbBookNote
}
```
### OutlineView
```ts

export declare class OutlineView {
  noteFromIndexPath(indexPath: NSIndexPath): MbBookNote
}

```
### MindMapView
```ts
export declare class MindMapView extends UIView {
  /**
   * MindMap Nodes
   */
  readonly mindmapNodes?: MindMapNode[]
  /**
   * Nodes of selected
   */
  readonly selViewLst?: {
    note: MindMapNode
    view: UIView
  }[]
}

```
#### MindMapNode
```ts
export declare class MindMapView extends UIView {
  /**
   * MindMap Nodes
   */
  readonly mindmapNodes?: MindMapNode[]
  /**
   * Nodes of selected
   */
  readonly selViewLst?: {
    note: MindMapNode
    view: UIView
  }[]
}
```

## ReaderController
```ts
export declare class ReaderController {
  /**
   * @recommended use {@link MN.currentDocumentController}
   */
  readonly currentDocumentController: DocumentController
  /**
   * Document controllers
   */
  readonly documentControllers?: DocumentController[]
  /**
   * view of ReaderController
   * {@link UIView}
   */
  view: UIView
}
```
### DocumentController
```ts
export declare class DocumentController {
  readonly document?: MbBook
  /**
   * MD5 of the document.
   */
  readonly docMd5?: string
  /**
   * ID of Notebook
   */
  readonly notebookId?: string
  /**
   * Focus note of document, usually the note you are clicking on
   */
  readonly focusNote?: MbBookNote
  /**
   * Last focus note, only valid when you are selecting text
   */
  readonly lastFocusNote?: MbBookNote
  /**
   * Visible focus note
   */
  readonly visibleFocusNote?: MbBookNote
  /**
   * Text you are selecting
   */
  readonly selectionText?: string
  /**
   * Image from selection, usually converted to base64 to use.
   */
  imageFromSelection(): NSData
  /**
   * Image from focusNode
   */
  imageFromFocusNote(): NSData
  /**
   * start from 1. The virtual page has a large number of discontinuous pages
   * */
  readonly currPageNo: number
  /**
   * start from 0, but if page deleted, the index will be 0.
   * */
  readonly currPageIndex: number
  /**
   * convert page index to page number
   */
  indexFromPageNo(pageNo: number): number
  /**
   * convert page number to page index
   */
  pageNoFromIndex(index: number): number
  /**
   * Jump to the page index
   */
  setPageAtIndex(index: number): void
  /**
   * Get all page indices from page number, which is not one-to-one mapping.
   */
  indicesFromPageNo(pageNo: number): number[]
}
```