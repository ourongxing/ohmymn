import { UIView, UIViewController, UIWindow } from "typings/UIKit"
import { docMapSplitMode, osType, studyMode } from "./enum"
import { MbBookNote } from "./MbBookNote"
import { MbBook } from "./NoteDatabase"
import { EventHandler } from "typings/Addon/index"

 /**
   * Document Controller. Get a document controller to get document information, such as docMd5, notebookID etc.
   * 
   * sender.userInfo will contain a DocumentController object, reference to {@link EventHandler} sender
   * 
   * @example
   * ```
   * sender: {
   * // depends on the specific situation
   * userInfo: {
   *   key: string
   *   option: number
   *   row: IRowButton
   *   content: string
   *   name: string
   *   type: "text" | "card"
   *   status: boolean
   *   note: MbBookNote
   *   selections: number[]
   *   noteid: string
   *   arrow: DirectionOfSelection
   *   documentController: DocumentController
   *   winRect: string
   *  }
   * }
   * ```
   * @property {MbBook} document
   * @property {string} docMd5
   * @property {string} notebookId
   * @property {MbBookNote} focusNote
   * @property {MbBookNote} visibleFocusNote
   * @property {string} selectionText
   * @function imageFromSelection
   * @example
   * ```
   * const documentController = sender.userInfo.documentController
   * ```
   */
export class DocumentController {
  /**
   * Get the document {@link MbBook} object.
   * @type {MbBook}
   * @memberof DocumentController
   * @example
   * ```
   * const documentController = sender.userInfo.documentController
   * const document = documentController.document
   * ```
   */
  readonly document?: MbBook
  /**
    * MD5 of the document.
    * @type {string}
    * @memberof DocumentController
    * @example
    * ```
    * const documentController = sender.userInfo.documentController
    * const docMd5 = documentController.docMd5
    * ```
  */
  readonly docMd5?: string
  /**
   * ID of Notebook
   * @type {string}
   * @memberof DocumentController
   * @example
   * ```
   * const documentController = sender.userInfo.documentController
   * const notebookId = documentController.notebookId
   * ```
  */
  readonly notebookId?: string
  /**
   * FocusNote
   * @type {MbBookNote}
   * @memberof DocumentController
  */
  readonly focusNote?: MbBookNote
  /**
   * VisibleFocusNote
   * @type {MbBookNote}
   * @memberof DocumentController
  */
  readonly visibleFocusNote?: MbBookNote
  /**
   * Select text
   * @type {string}
   * @memberof DocumentController
  */
  readonly selectionText?: string
  /**
   * Image from selection
   * @type {NSData}
   * @memberof DocumentController
   * @example
   * ```
   * imgBase64 = documentController.imageFromSelection().base64Encoding()
   * ```
   */
  imageFromSelection(): NSData
  /**
   * @type {NSData}
   * @memberof DocumentController
   */
  imageFromFocusNote(): NSData
}

/**
 * MindMap Node
 * @property {MbBookNote} note
 * @property {MindMapNode} parentNode
 * @property {Array} summaryLinks
 * @property {Array} childNodes
 * @property {CGRect} frame 
*/
export class MindMapNode {
  /**
   * Note
   * @type {MbBookNote}
   * @memberof MindMapNode
   */
  readonly note: MbBookNote
  /**
   * Parent node
   * @type {MindMapNode}
   * @memberof MindMapNode
   */
  readonly parentNode?: MindMapNode
  /**
   * Summary links
   * @type {Array<any>}
   * @memberof MindMapNode
   */
  readonly summaryLinks?: Array<any>
  /**
   * Child nodes
   * @type {Array<MindMapNode>}
   * @memberof MindMapNode
   */
  readonly childNodes?: Array<MindMapNode>
  /**
   * Frame
   * @type {CGRect}
   * @memberof MindMapNode
   */
  readonly frame: CGRect
}

/**
 * View of MindMap, inherit from UIView
 * 
 * inherit from {@link UIView}
 * 
 * @extends {UIView}
 * @property {Array<MindMapNode>} mindMapNodes
 * @property {Array} selViewLst
 */
export class MindMapView extends UIView {
  /**
   * MindMap Nodes
   * @type {Array<MindMapNode>}
   * @memberof MindMapView
   */
  readonly mindmapNodes?: Array<MindMapNode>
  /**
   * Selected view list
   * 
   * @type {Array<{
   *     note: MindMapNode
   *     view: UIView
   *   }>}
   * @memberof MindMapView
   */

  readonly selViewLst?: Array<{
    note: MindMapNode
    view: UIView
  }>
}

/**
 * Controller of notebook
 * @property {UIview} view
 * @property {WrapperObj<OutlineView>} outlineView
 * @property {WrapperObj<MindMapView>} mindMapView
 * @property {string} notebookId
 * @property {MbBookNote} focusNote
 * @property {MbBookNote} visibleFocusNote
 */
export class NotebookController {
  /**
   * view of notebook Controller
   * inherit from {@link UIView}
   * @type {UIView}
   * @memberof NotebookController
   */
  readonly view: UIView
  /**
   * Outline view
   *
   * @type {WrapperObj<OutlineView>}
   * @memberof NotebookController
   */
  readonly outlineView: WrapperObj<OutlineView>
  /**
   * MindMap view
   *
   * @type {WrapperObj<MindMapView>}
   * @memberof NotebookController
   */
  readonly mindmapView: WrapperObj<MindMapView>
  /**
   * Notebook id
   *
   * @type {string}
   * @memberof NotebookController
   */
  readonly notebookId?: string
  /**
   * Focus note
   *
   * @type {MbBookNote}
   * @memberof NotebookController
   */
  readonly focusNote?: MbBookNote
  /**
   * Visible focus note
   *
   * @type {MbBookNote}
   * @memberof NotebookController
   */
  readonly visibleFocusNote?: MbBookNote
}

/**
 * Outline view
 * @function noteFromIndexPath
 */
export class OutlineView {
  /**
   * @returns MbBookNote*
   * @param indexPath NSIndexPath*
   */
  noteFromIndexPath(indexPath: NSIndexPath): MbBookNote
}

/**
 * Reader Controller
 * @property {WrapperObj<DocumentController>} currentDocumentController
 * @property {NSMutableArray} documentControllers
 * @property {UIView} view
 *
 */
export class ReaderController {
  /**
   * Current document controller
   *  
   * inherit from {@link DocumentController}
   * 
   * @type {WrapperObj<DocumentController>}
   * @memberof ReaderController
   */
  readonly currentDocumentController: WrapperObj<DocumentController>
  /**
   * Document controllers
   * 
   * @type {NSMutableArray}
   * @memberof ReaderController
   */
  readonly documentControllers?: NSMutableArray
  /**
   * view of ReaderController
   *
   * {@link UIView}
   * @type {UIView}
   * @memberof ReaderController
   */
  view: UIView
}

/**
 * Study Controller, inherit from UIViewController
 * 
 * inherit from {@link UIViewController}
 * 
 * @property {UIView} view
 * @property {studyMode} studyMode
 * @property {boolean} narrowMode
 * @property {docMapSplitMode} docMapSplitMode
 * @property {boolean} rightMapMode
 * @property {WrapperObj<NotebookController>} notebookController
 * @property {WrapperObj<ReaderController>} readerController
 * @function focusNoteInMindMapById
 * @function focusNoteInDocumentById
 * @function refreshAddonCommands
 */
export class StudyController extends UIViewController {
  /**
   * View of the study controller
   * 
   * {@link UIView}
   * @type {UIView}
   * @memberof StudyController
   * @example 
   * ```
   * // add sub UIview to study controller
   * const studyController = Application.sharedInstance().studyController(self.window)
   * studyController.view.addSubview(UIView())
   */
  view: UIView
  /**
   * Study Mode
   * 
   * {@link studyMode}
   * @type {studyMode}
   * @memberof StudyController
   * @example
   * ```
   * // studymode
   * const studyController = Application.sharedInstance().studyController(self.window)
   * const studyMode = studyController.studyMode
   * ```
   */
  readonly studyMode: studyMode
  /**
   * Narrow Mode
   * @type {boolean}
   * @memberof StudyController
   * @example
   * ```
   * // narrow mode
   * const studyController = Application.sharedInstance().studyController(self.window)
   * const narrowMode = studyController.narrowMode
   * ```
   */
  readonly narrowMode: boolean //when narrowmode, book split mode 1 is disabled
  /**
  * DocMap Split Mode
  * 
  * {@link docMapSplitMode}
  * @type {docMapSplitMode}
  * @memberof StudyController
  * @example
  * ```
  * // docmap split mode
  * const studyController = Application.sharedInstance().studyController(self.window)
  * const docMapSplitMode = studyController.docMapSplitMode
  * ```
  */
  docMapSplitMode: docMapSplitMode
  /**
   * Right Map Mode
   *
   * @type {boolean}
   * @memberof StudyController
   * @example
   * ```
   * // right map mode
   * const studyController = Application.sharedInstance().studyController(self.window)
   * const rightMapMode = studyController.rightMapMode
   * ```
   */
  rightMapMode: boolean
  /**
   * Get notebook controller
   * 
   * {@link notebookController}
   * @type {WrapperObj<NotebookController>}
   * @memberof StudyController
   * @example
   * ```
   * // notebook controller
   * const studyController = Application.sharedInstance().studyController(self.window)
   * const notebookController = studyController.notebookController
   * ```
   */
  readonly notebookController: WrapperObj<NotebookController>
  /**
   * Get reader controller
   * 
   * {@link ReaderController}
   * @type {WrapperObj<ReaderController>}
   * @memberof StudyController
   * @example
   * ```
   * // reader controller
   * const studyController = Application.sharedInstance().studyController(self.window)
   * const readerController = studyController.readerController
   * ```
   */
  readonly readerController: WrapperObj<ReaderController>
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
   * @returns Application
   * @property {Application} sharedApplication
   * @property {UIColor} defaultTintColorForDarkBackground
   * @property {UIColor} defaultTintColorForSelected
   * @property {UIColor} defaultTintColor
   * @property {UIColor} defaultBookPageColor
   * @property {UIColor} defaultTextColor
   * @property {UIColor} defaultDisableColor
   * @property {UICOlor} defaultHighlightBlendColor
   * @property {UIColor} defaultHighlightBlendColor
   * @property {UIWindow} focusWindow
   * @property {string} dbPath
   * @property {string} documentPath
   * @property {string} cachePath
   * @property {string} tempPath
   * @property {osType} osType
   * @function refreshAfterDBChanged
   * @function queryCommandWithKeyFlagsInWindow
   * @function processCommandWithKeyFlagsInWindow
   * @function openURL
   * @function alert
   * @function showHUD
   * @function waitHUDOnView
   * @function stopWaitHUDOnView
   * @function saveFileWithUti
   * @function studyController
   * @function checkNotifySenderInWindow
   * @function openFileWithUTIs
   * @function regsiterHtmlCommentEditor
   * @function unregsiterHtmlCommentEditor
   */
  class Application {
    /**
     * Create an Application object
     * @type {Application}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * ```
     */
    static sharedInstance(): Application
    /**
     * Current theme
     * @type {string}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const cuurentTheme = app.currentTheme!
     * ```
     */
    readonly currentTheme?: string
    /**
     * default tint color for dark background
     *
     * @type {UIColor}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const defaultTintColorForDarkBackground = app.defaultTintColorForDarkBackground!
     * ```
     */
    readonly defaultTintColorForDarkBackground?: UIColor
    /**
     * default tint color for selected
     *
     * @type {UIColor}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const defaultTintColorForSelected = app.defaultTintColorForSelected!
     * ```
     */
    readonly defaultTintColorForSelected?: UIColor
    /**
     * default tint color
     *
     * @type {UIColor}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const defaultTintColor = app.defaultTintColor!
     * ```
     */
    readonly defaultTintColor?: UIColor
    /**
     * default book page color
     *
     * @type {UIColor}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const defaultBookPageColor = app.defaultBookPageColor!
     * ```
     */
    readonly defaultBookPageColor?: UIColor
    /**
     * default note book color
     *
     * @type {UIColor}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const defaultTextColor = app.defaultTextColor!
     * ```
     */
    readonly defaultNotebookColor?: UIColor
    /**
     * default text color
     *
     * @type {UIColor}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const defaultTextColor = app.defaultTextColor!
     * ```
     */
    readonly defaultTextColor?: UIColor
    /**
     * default disable color
     *
     * @type {UIColor}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const defaultDisableColor = app.defaultDisableColor!
     * ```
     */
    readonly defaultDisableColor?: UIColor
    /**
     * default highlight blend color
     *
     * @type {UIColor}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const defaultHighlightBlendColor = app.defaultHighlightBlendColor!
     * ```
     */
    readonly defaultHighlightBlendColor?: UIColor
    /**
     * Focus window
     *
     * @type {UIWindow}
     * @memberof Application
     */
    readonly focusWindow?: UIWindow
    /**
     * Database path
     *
     * @type {string}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const dbPath = app.dbPath!
     * ```
     */
    readonly dbPath?: string
    /**
     * Document relative path
     *
     * @type {string}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const documentPath = app.documentPath!
     * ```
     */
    readonly documentPath?: string
    /**
     * Cache path
     *
     * @type {string}
     * @memberof Application
     * @example
     * ```
     * const app = Application.sharedInstance()
     * const cachePath = app.cachePath!
     * ```
     */
    readonly cachePath?: string
    /**
     * Temp path
     *
     * @type {string}
     * @memberof Application
     */
    readonly tempPath?: string
    /**
     * OS type
     *
     * @type {osType}
     * @memberof Application
     */
    readonly osType: osType
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
    /**
     * @returns void
     * @param url NSURL*
     * @example 
     * ```
     * //Open Google site
     * Application.openURL(NSURL.URLWithString("https://www.google.com"))
     * ```
     */
    openURL(url: NSURL): void
    /**
     * show Alert
     * @returns void
     * @param message NSString*
     * @example
     * ```
     * //show alert
     * Application.showAlert("Alert")
     * ```
     */
    alert(message: string): void
    /**
     * show HUD, used to notify the user
     * @returns void
     * @param message NSString*
     * @param view UIView*
     * @param duration double
     * @example
     * ```
     * Application.showHUD("loading", self.view, 1)
     * ```
     */
    showHUD(message: string, view: UIView, duration: number): void
    /**
     * @returns void
     * @param message NSString*
     * @param view UIView*
     */
    waitHUDOnView(message: string, view: UIView): void
    /**
     * @returns void
     * @param view UIView*
     */
    stopWaitHUDOnView(view: UIView): void
    /**
     * @returns void
     * @param mfile NSString*
     * @param uti NSString*
     */
    saveFileWithUti(mfile: string, uti: string): void
    /**
     * @returns id<JSBStudyController>
     * @param window UIWindow*
     */
    studyController(window: UIWindow): WrapperObj<StudyController>
    /**
     * @returns void
     * @param window UIWindow*
     */
    checkNotifySenderInWindow(obj: WrapperObj<any>, window: UIWindow): boolean
    /**
     * @returns void
     * @param types NSArray<NSString*>*
     * @param controller UIViewController*
     * @param block JSValue*
     */
    openFileWithUTIs(
      types: Array<string>,
      controller: UIViewController,
      block: JSValue
    ): void
    /**
     * register a html comment editor(For note card editor), click link below to see an example
     
     * @link https://github.com/MarginNote/CKEditor
     * @returns void
     * @param commentEditor NSDictionary*
     * @param htmlEditor JSValue*
     * @param htmlRender JSValue*
     * @param commentTag NSString*o
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
     * @param commentTag NSString*
     */
    unregsiterHtmlCommentEditor(commentTag: string): void
  }
}
