import { UILocalNotification, UIViewController, UIWindow } from "typings/UIKit"

/**
 * LifeCycle of Addon
 */
declare class JSExtension {
  [k: string]: any
  /**
   *
   * @type {UIWindow}
   * @memberof JSExtension
   */
  readonly window?: UIWindow
  /** 
   * Do something when MarginNote open a window
   * @memberof JSExtension
   * @returns {void}
   */
  sceneWillConnect(): void
  /**
   *  Do something when MarginNote close a window
   * @memberof JSExtension
   */
  sceneDidDisconnect(): void
  /** 
   * Do something when MarginNote window resign active
   * @memberof JSExtension
   */
  sceneWillResignActive(): void
  /** 
   * Do something when activate MarginNote window
   * @memberof JSExtension
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
   * @returns {void}
   */
  documentWillClose(docmd5: string): void
  /**
   * Query Addon Status, usally used for checking if activate the addon
   * @returns {NSDictionary*}
   * @memberof JSExtension
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
     * @memberof JSExtension
     * image size must be 44x44 px
    */
    image: string
    /**
     * object of the function, usually self
     * @type {JSExtension}
     * @memberof JSExtension
     */
    object: WrapperObj<any>
    /**
     * selector of the function, for another word, when you click(tap) on the icon, what function will be executed
     * @type {string}
     * @memberof JSExtension
     */
    selector: string
    /**
     * checked status
     * @type {boolean}
     * @memberof JSExtension
     */
    checked: boolean
  } | null
  
  /**
   * @returns {NSArray*}
   * @param topicid NSString*
   * @memberof JSExtension
   */
  additionalTitleLinksOfNotebook(topicid: string): Array<any>
  /**
   * @returns {UIViewController*}
   * @param titleLink NSString*
   * @memberof JSExtension
   */
  viewControllerForTitleLink(titleLink: string): UIViewController
  /**
   * @returns {void}
   * @param controller UIViewController*
   * @memberof JSExtension
   */
  controllerWillLayoutSubviews(controller: UIViewController): void
  /**
   * @returns {NSArray*}
   * @memberof JSExtension
   */
  additionalShortcutKeys(): Array<any>
  /**
   * @returns {NSDictionary*}
   * @param command NSString*
   * @param keyFlags NSInteger
   * @memberof JSExtension
   */
  queryShortcutKeyWithKeyFlags(command: string, keyFlags: number): DictObj
  /**
   * @param command NSString*
   * @param keyFlags NSInteger
   * @returns {void}
   * @memberof JSExtension
   */
  processShortcutKeyWithKeyFlags(command: string, keyFlags: number): void
  /**
   * Do something when addon finish loading
   * @returns {void}
   * @memberof JSExtension
   */
  static addonDidConnect(): void
  /**
   * Do something when addon shuts down
   * @returns {void}
   * @memberof JSExtension
   */
  static addonWillDisconnect(): void
  /**
   * Do something when application enter background
   * @returns {void}
   * @memberof JSExtension
   */
  static applicationDidEnterBackground(): void
  /**
   * Do something when application enter foreground
   * @returns {void}
   * @memberof JSExtension
   */
  static applicationWillEnterForeground(): void
  /**
   * @param notify UILocalNotification*
   * @returns {void}
   * @memberof JSExtension
   */
  static applicationDidReceiveLocalNotification(
    notify: UILocalNotification
  ): void
}
