# Application
```ts
const Application: {
  /**
   * Create an Application instance
   * @recommended use {@link MN.app}
   */
  sharedInstance(): Application
}
```

```ts
export declare type Application = {
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
```