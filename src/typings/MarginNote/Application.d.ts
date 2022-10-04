import { UIView, UIViewController, UIWindow } from "../UIKit"
import { DocMapSplitMode, OSType, StudyMode } from "~/enum"
import { MbBookNote } from "./MbBookNote"
import { MbBook } from "./NoteDatabase"

export class DocumentController {
  /**
   * Get the document {@link MbBook} object.
   */
  readonly document?: MbBook
  /**
   * MD5 of the document.
   */
  readonly docMd5?: string
  /**
   * ID of Notebook
   */
  readonly notebookId?: string
  readonly focusNote?: MbBookNote
  readonly lastFocusNote?: MbBookNote
  readonly visibleFocusNote?: MbBookNote
  /**
   * Select text
   */
  readonly selectionText?: string
  /**
   * Image from selection, usually converted to base64 to use.
   * @example
   * ```
   * imgBase64 = documentController.imageFromSelection().base64Encoding()
   * ```
   */
  imageFromSelection(): NSData
  /**
   * Image from focusNode
   */
  imageFromFocusNote(): NSData
  /** start from 1. The virtual page has a large number of discontinuous pages */
  readonly currPageNo: number
  /** start from 0 */
  readonly currPageIndex: number
  indexFromPageNo(pageNo: number): number
  pageNoFromIndex(index: number): number
  setPageAtIndex(index: number): void
  // 对于虚拟化下的特殊情形，一个页码编号可能存在多个页码索引，可以用下面方法获得全部页索引
  indicesFromPageNo(pageNo: number): number[]
}

/**
 * MindMap Node
 */
export class MindMapNode {
  readonly note: MbBookNote
  readonly parentNode?: MindMapNode
  readonly summaryLinks?: Array<any>
  readonly childNodes?: Array<MindMapNode>
  readonly frame: CGRect
}

/**
 * View of MindMap, inherit from UIView
 * inherit from {@link UIView}
 */
export class MindMapView extends UIView {
  /**
   * MindMap Nodes
   */
  readonly mindmapNodes?: Array<MindMapNode>
  /**
   * Selected view list
   */
  readonly selViewLst?: Array<{
    note: MindMapNode
    view: UIView
  }>
}

/**
 * Controller of notebook
 */
export class NotebookController {
  /**
   * View of notebook Controller
   * inherit from {@link UIView}
   */
  readonly view: UIView
  /**
   * Outline view
   */
  readonly outlineView: OutlineView
  /**
   * MindMap view
   *
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
export class OutlineView {
  noteFromIndexPath(indexPath: NSIndexPath): MbBookNote
}

/**
 * Reader Controller
 */
export class ReaderController {
  /**
   * Current document controller
   *
   * inherit from {@link DocumentController}
   */
  readonly currentDocumentController: DocumentController
  /**
   * Document controllers
   */
  readonly documentControllers?: NSMutableArray
  /**
   * view of ReaderController
   *
   * {@link UIView}
   */
  view: UIView
}

/**
 * Study Controller, inherit from UIViewController
 *
 * inherit from {@link UIViewController}
 */
export class StudyController extends UIViewController {
  /**
   * View of the study controller
   *
   * {@link UIView}
   * @example
   * ```
   * // add sub UIview to study controller
   * const studyController = Application.sharedInstance().studyController(self.window)
   * studyController.view.addSubview(UIView())
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
   *
   * {@link DocMapSplitMode}
   */
  docMapSplitMode: DocMapSplitMode
  /**
   * Right Map Mode
   */
  rightMapMode: boolean
  /**
   * Get notebook controller
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

declare global {
  /**
   * Application Object
   */
  class Application {
    /**
     * Create an Application object
     * @example
     * ```
     * const app = Application.sharedInstance()
     * ```
     */
    static sharedInstance(): Application
    /**
     * Current theme
     */
    readonly currentTheme?: string
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
     * @param topicid NSString*
     */
    refreshAfterDBChanged(topicid: string): void
    /**
     * @returns NSDictionary*
     * @param command NSString*
     * @param keyFlags NSInteger
     * @param window UIWindow*
     */
    queryCommandWithKeyFlagsInWindow(
      command: string,
      keyFlags: number,
      window: UIWindow
    ): DictObj
    /**
     * @returns void
     * @param command NSString*
     * @param keyFlags NSInteger
     * @param window UIWindow*
     */
    processCommandWithKeyFlagsInWindow(
      command: string,
      keyFlags: number,
      window: UIWindow
    ): void
    openURL(url: NSURL): void
    /**
     * Show Alert
     */
    alert(message: string): void
    /**
     * Show HUD, used to notify the user
     */
    showHUD(message: string, view: UIView, duration: number): void
    waitHUDOnView(message: string, view: UIView): void
    stopWaitHUDOnView(view: UIView): void
    saveFileWithUti(mfile: string, uti: string): void
    /**
     * Get the studyController of current window.
     */
    studyController(window: UIWindow): StudyController
    /**
     * Check the notify sender is current window.
     * @param obj Usually sender
     * @param window
     */
    checkNotifySenderInWindow(obj: any, window: UIWindow): boolean
    openFileWithUTIs(
      types: Array<string>,
      controller: UIViewController,
      block: JSValue
    ): void

    /**
     * register a html comment editor(For note card editor), click link below to see an example
     * @returns void
     * @param commentTag NSString*, usually is the markdown editor name
     */
    regsiterHtmlCommentEditor(
      commentEditor: DictObj,
      htmlEditor: JSValue,
      htmlRender: JSValue,
      commentTag: string
    ): void

    /**
     * unregister a html comment editor
     * @returns void
     * @param commentTag NSString*, usually is the markdown editor name
     */
    unregsiterHtmlCommentEditor(commentTag: string): void
  }
}
