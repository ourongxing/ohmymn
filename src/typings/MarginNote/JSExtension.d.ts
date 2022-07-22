import {
  UILocalNotification,
  UIViewController,
  UIWindow
} from "~/typings/UIKit"

/**
 * LifeCycle of Addon
 */
declare class JSExtension {
  [k: string]: any
  /**
   *
   * @type {UIWindow}
   */
  readonly window?: UIWindow
  /**
   * Do something when MarginNote open a window
   * @returns void
   */
  sceneWillConnect(): void
  /**
   *  Do something when MarginNote close a window
   */
  sceneDidDisconnect(): void
  /**
   * Do something when MarginNote window resign active
   */
  sceneWillResignActive(): void
  /**
   * Do something when activate MarginNote window
   */
  sceneDidBecomeActive(): void
  /**
   * Do something when notebook open
   * @param topicid NSString*
   */
  notebookWillOpen(topicid: string): void
  /**
   * Do something when notebook close
   * @param topicid NSString*
   */
  notebookWillClose(topicid: string): void
  /**
   * Do something when document open
   * @param docmd5 NSString*
   */
  documentDidOpen(docmd5: string): void
  /**
   * Do something when document close
   * @param docmd5 NSString*
   * @returns void
   */
  documentWillClose(docmd5: string): void
  /**
   * Query Addon Status, usally used for checking if activate the addon
   * @returns NSDictionary*
   * @example
   * ```
   * const queryAddonCommandStatus = () => {
   * // appear when in studycontroller
   * return MN.studyController().studyMode == studyMode.study
   * ? {
   *     image: "logo.png", // logo size:44x44 px
   *     object: self,
   *     selector: "switchPanel:", // selector of the function
   *     checked: self.panelStatus // checked status
   *   }
   * : null
   * }
   * ```
   */
  queryAddonCommandStatus(): {
    /**
     * path to icon file
     * @type {string}
     * image size must be 44x44 px
     */
    image: string
    /**
     * object of the function, usually self
     * @type {JSExtension}
     */
    object: any
    /**
     * selector of the function, for another word, when you click(tap) on the icon, what function will be executed
     * @type {string}
     */
    selector: string
    /**
     * checked status
     * @type {boolean}
     */
    checked: boolean
  } | null

  /**
   * @returns NSArray*
   * @param topicid NSString*
   */
  additionalTitleLinksOfNotebook(topicid: string): Array<any>
  /**
   * @returns UIViewController*
   * @param titleLink NSString*
   */
  viewControllerForTitleLink(titleLink: string): UIViewController
  /**
   * @returns void
   * @param controller UIViewController*
   */
  controllerWillLayoutSubviews(controller: UIViewController): void
  /**
   * @returns NSArray*
   */
  additionalShortcutKeys(): Array<any>
  /**
   * @returns NSDictionary*
   * @param command NSString*
   * @param keyFlags NSInteger
   */
  queryShortcutKeyWithKeyFlags(command: string, keyFlags: number): DictObj
  /**
   * @param command NSString*
   * @param keyFlags NSInteger
   * @returns void
   */
  processShortcutKeyWithKeyFlags(command: string, keyFlags: number): void
  /**
   * Do something when addon finish loading
   * @returns void
   */
  static addonDidConnect(): void
  /**
   * Do something when addon shuts down
   * @returns void
   */
  static addonWillDisconnect(): void
  /**
   * Do something when application enter background
   * @returns void
   */
  static applicationDidEnterBackground(): void
  /**
   * Do something when application enter foreground
   * @returns void
   */
  static applicationWillEnterForeground(): void
  /**
   * @param notify UILocalNotification*
   * @returns void
   */
  static applicationDidReceiveLocalNotification(
    notify: UILocalNotification
  ): void
}
