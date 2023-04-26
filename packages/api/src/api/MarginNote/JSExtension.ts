import { DictObj } from ".."
import { UIWindow, UIViewController, UILocalNotification } from "../UIKit"

/**
 * Addon of MarginNote
 */
export declare class JSExtension {
  [k: string]: any
  readonly window?: UIWindow
  /**
   * Query Addon Status, usally used for checking if activate the addon
   * @returns NSDictionary*
   */
  queryAddonCommandStatus(): {
    /**
     * path to icon file
     * image size must be 44x44 px
     */
    image: string
    /**
     * object of the function, usually self
     */
    object: any
    /**
     * selector of the function, for another word, when you click(tap) on the icon, what function will be executed
     * @example
     * toggle:
     */
    selector: string
    /**
     * checked status
     */
    checked: boolean
  } | null
  additionalTitleLinksOfNotebook(notebookid: string): any[]
  viewControllerForTitleLink(titleLink: string): UIViewController
  controllerWillLayoutSubviews(controller: UIViewController): void
  additionalShortcutKeys(): any[]
  queryShortcutKeyWithKeyFlags(command: string, keyFlags: number): DictObj
  processShortcutKeyWithKeyFlags(command: string, keyFlags: number): void
}

/**
 * LifeCycle of Addon
 */
export declare namespace JSExtensionLifeCycle {
  type InstanceMethods = Partial<{
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
    notebookWillOpen(notebookid: string): void
    /**
     * Do something when notebook close
     * @param topicid NSString*
     */
    notebookWillClose(notebookid: string): void
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
  }>
  type ClassMethods = Partial<{
    /**
     * Do something when addon finish loading
     * @returns void
     */
    addonDidConnect(): void
    /**
     * Do something when addon shuts down
     * @returns void
     */
    addonWillDisconnect(): void
    /**
     * Do something when application enter background
     * @returns void
     */
    applicationDidEnterBackground(): void
    /**
     * Do something when application enter foreground
     * @returns void
     */
    applicationWillEnterForeground(): void
    /**
     * @param notify UILocalNotification*
     * @returns void
     */
    applicationDidReceiveLocalNotification(notify: UILocalNotification): void
  }>
}
