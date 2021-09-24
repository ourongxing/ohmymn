export {}
declare global {
  const enum osType {
    iPadOS = 0,
    iPhoneOS = 1,
    macOS = 2
  }

  class DocumentController {
    readonly document?: MbBook
    readonly docMd5?: string
    readonly notebookId?: string
    readonly focusNote?: MbBookNote
    readonly visibleFocusNote?: MbBookNote
    readonly selectionText?: string
  }

  class MindMapNode {
    readonly note?: MbBookNote
    readonly parentNode?: MindMapNode
    readonly summaryLinks?: Array<any>
    readonly childNodes?: Array<MindMapNode>
    readonly frame: CGRect
  }

  class MindMapView {
    readonly mindmapNodes?: Array<MindMapNode>
    readonly selViewLst?: Array<any>
  }

  class NotebookController {
    readonly outlineView: WrapperObj<OutlineView>
    readonly mindmapView: WrapperObj<MindMapView>
    readonly notebookId?: string
    readonly focusNote?: MbBookNote
    readonly visibleFocusNote?: MbBookNote
  }

  class OutlineView {
    /**
     * @returns MbBookNote*
     * @param indexPath NSIndexPath*
     */
    noteFromIndexPath(indexPath: NSIndexPath): MbBookNote
  }

  class ReaderController {
    readonly currentDocumentController: WrapperObj<DocumentController>
    readonly documentControllers?: NSMutableArray
  }

  const enum studyMode {
    doc0 = 0,
    doc1 = 1,
    study = 2,
    review = 3
  }

  const enum docMapSplitMode {
    allMap = 0,
    /** halfMap or halfDoc */
    half = 1,
    allDoc = 2
  }

  class StudyController {
    readonly studyMode: studyMode
    readonly narrowMode: boolean //when narrowmode, book split mode 1 is disabled
    /**
     *  int
     */
    docMapSplitMode: docMapSplitMode
    rightMapMode: boolean
    readonly notebookController: WrapperObj<NotebookController>
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

  class Application {
    static sharedInstance(): Application

    readonly currentTheme?: string
    readonly defaultTintColorForDarkBackground?: UIColor
    readonly defaultTintColorForSelected?: UIColor
    readonly defaultTintColor?: UIColor
    readonly defaultBookPageColor?: UIColor
    readonly defaultNotebookColor?: UIColor
    readonly defaultTextColor?: UIColor
    readonly defaultDisableColor?: UIColor
    readonly defaultHighlightBlendColor?: UIColor
    readonly focusWindow?: UIWindow
    readonly dbPath?: string
    readonly documentPath?: string
    readonly cachePath?: string
    readonly tempPath?: string
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
     * @param url NSURL*
     */
    openURL(url: NSURL): void
    /**
     * @param message NSString*
     */
    alert(message: string): void
    /**
     * @param message NSString*
     * @param view UIView*
     * @param duration double
     */
    showHUD(message: string, view: UIView, duration: number): void
    /**
     * @param message NSString*
     * @param view UIView*
     */
    waitHUDOnView(message: string, view: UIView): void
    /**
     * @param view UIView*
     */
    stopWaitHUDOnView(view: UIView): void
    /**
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
     * @param window UIWindow*
     */
    checkNotifySenderInWindow(obj: WrapperObj<any>, window: UIWindow): boolean
    /**
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
     * @param commentEditor NSDictionary*
     * @param htmlEditor JSValue*
     * @param htmlRender JSValue*
     * @param commentTag NSString*
     */
    regsiterHtmlCommentEditor(
      commentEditor: DictObj,
      htmlEditor: JSValue,
      htmlRender: JSValue,
      commentTag: string
    ): void
    /**
     * @param commentTag NSString*
     */
    unregsiterHtmlCommentEditor(commentTag: string): void
  }
}
