import { UIColor, CGRect, UIViewController, UIWindow } from "../UIKit"
import { MbBookNote } from "./MbBookNote"
import { MbBook } from "./NoteDatabase"
import type { JSValue, NSIndexPath, NSURL, NSData } from "../Foundation"
import { DictObj } from ".."

export const enum OSType {
  iPadOS = 0,
  iPhoneOS = 1,
  macOS = 2
}

export const enum StudyMode {
  doc0 = 0,
  doc1 = 1,
  /**
   * Mindmap mode
   */
  study = 2,
  review = 3
}

export const enum DocMapSplitMode {
  allMap = 0,
  half = 1,
  allDoc = 2
}

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

/**
 * MindMap Node
 */
export declare class MindMapNode {
  readonly note: MbBookNote
  readonly parentNode?: MindMapNode
  readonly summaryLinks?: any[]
  readonly childNodes?: MindMapNode[]
  /**
   * Node rect in mindmap view
   */
  readonly frame: CGRect
}

/**
 * View of MindMap
 */
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

/**
 * Controller of notebook
 */
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

/**
 * Outline view
 */
export declare class OutlineView {
  noteFromIndexPath(indexPath: NSIndexPath): MbBookNote
}

/**
 * Reader Controller
 */
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

/**
 * Study Controller
 */
export declare class StudyController extends UIViewController {
  /**
   * View of the study controller
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

export declare class Application {
  /**
   * @value 4.0.2(97)
   *
   * 4.0.2 is version, 97 is build num
   * @recommended use {@link MN.version}
   */
  readonly appVersion: string
  /**
   * @value 4.0.2(97)
   */
  readonly build: string
  /**
   * Current theme
   * @recommended use {@link MN.currentThemeColor}
   */
  readonly currentTheme: "Gray" | "Default" | "Dark" | "Green" | "Sepia"
  /**
   * default tint color for dark background
   */
  readonly defaultTintColorForDarkBackground?: UIColor
  /**
   * default tint color for selected
   */
  readonly defaultTintColorForSelected?: UIColor
  /**
   * default tint color
   */
  readonly defaultTintColor?: UIColor
  /**
   * default book page color
   */
  readonly defaultBookPageColor?: UIColor
  /**
   * default note book color
   */
  readonly defaultNotebookColor?: UIColor
  /**
   * default text color
   */
  readonly defaultTextColor?: UIColor
  /**
   * default disable color
   */
  readonly defaultDisableColor?: UIColor
  /**
   * default highlight blend color
   */
  readonly defaultHighlightBlendColor?: UIColor
  /**
   * Focus window
   */
  readonly focusWindow?: UIWindow
  /**
   * Database path
   */
  readonly dbPath?: string
  /**
   * Document relative path
   */
  readonly documentPath?: string
  /**
   * Cache path
   */
  readonly cachePath?: string
  /**
   * Temp path
   */
  readonly tempPath?: string
  /**
   * OS type
   */
  readonly osType: OSType
  /**
   * Refresh Note data
   */
  refreshAfterDBChanged(notebookid: string): void
  queryCommandWithKeyFlagsInWindow(
    command: string,
    keyFlags: number,
    window: UIWindow
  ): DictObj
  processCommandWithKeyFlagsInWindow(
    command: string,
    keyFlags: number,
    window: UIWindow
  ): void
  /**
   * @recommand {@link openURL}
   */
  openURL(url: NSURL): void
  /**
   * @recommand {@link alert}
   */
  alert(message: string): void
  /**
   * @recommand {@link showHUD}
   */
  showHUD(message: string, view: UIView, duration: number): void
  /**
   * @recommand {@link HUDController}
   */
  waitHUDOnView(message: string, view: UIView): void
  /**
   * @recommand {@link HUDController}
   */
  stopWaitHUDOnView(view: UIView): void
  /**
   * @recommand {@link saveFile}
   */
  saveFileWithUti(mfile: string, uti: string): void
  /**
   * @recommand {@link MN.studyController}
   */
  studyController(window: UIWindow): StudyController
  /**
   * Check the notify sender is current window.
   * @param obj Usually sender
   * @param window
   * @recommand MN.currentWindow === window
   */
  checkNotifySenderInWindow(obj: any, window: UIWindow): boolean
  /**
   * @recommand {@link openFile}
   */
  openFileWithUTIs(
    types: string[],
    controller: UIViewController,
    callback: (file: string) => void
  ): void

  /**
   * Register a html comment editor
   * @param commentTag The markdown editor plugin id
   * @see "https://github.com/marginnoteapp/milkdown/blob/main/src/jsExtension/lifeCycle.ts#L80"
   */
  regsiterHtmlCommentEditor(
    commentEditor: DictObj,
    htmlEditor: JSValue,
    htmlRender: JSValue,
    commentTag: string
  ): void

  /**
   * Unregister a html comment editor
   * @param commentTag The markdown editor plugin id
   */
  unregsiterHtmlCommentEditor(commentTag: string): void
}

declare global {
  /**
   * Application class
   */
  const Application: {
    /**
     * Create an Application instance
     * @recommended use {@link MN.app}
     */
    sharedInstance(): Application
  }
}
