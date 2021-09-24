export {}
declare global {
  class JSExtension {
    [k: string]: any
    readonly window?: UIWindow
    /** Window initialize */
    sceneWillConnect(): void
    /** Window disconnect */
    sceneDidDisconnect(): void
    /** Window resign active */
    sceneWillResignActive(): void
    /** Window become active */
    sceneDidBecomeActive(): void
    /**
     * @param topicid NSString*
     */
    notebookWillOpen(topicid: string): void
    /**
     * @param topicid NSString*
     */
    notebookWillClose(topicid: string): void
    /**
     * @param docmd5 NSString*
     */
    documentDidOpen(docmd5: string): void
    /**
     * @param docmd5 NSString*
     */
    documentWillClose(docmd5: string): void
    /**
     * @returns NSDictionary*
     */
    queryAddonCommandStatus(): {
      /** path to icon file */
      image: string
      object: WrapperObj<any>
      /** the function name of handler to toggle plugin in {@link InstMember} */
      selector: string
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
     */
    processShortcutKeyWithKeyFlags(command: string, keyFlags: number): void

    static addonDidConnect(): void
    static addonWillDisconnect(): void
    static applicationDidEnterBackground(): void
    static applicationWillEnterForeground(): void
    /**
     * @param notify UILocalNotification*
     */
    static applicationDidReceiveLocalNotification(
      notify: UILocalNotification
    ): void
  }
}
