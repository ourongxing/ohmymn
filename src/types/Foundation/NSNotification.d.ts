export {}
declare global {
  class NSNotification {
    /**
     * @param name NSString*
     */
    static notificationWithNameObject(
      name: string,
      anObject: WrapperObj<any>
    ): NSNotification
    /**
     * @param name NSString*
     * @param aUserInfo NSDictionary*
     */
    static notificationWithNameObjectUserInfo(
      name: string,
      anObject: WrapperObj<any>,
      aUserInfo: DictObj
    ): NSNotification
    readonly name?: string
    readonly object: WrapperObj<any>
    readonly userInfo?: DictObj
    /**
     * @param name NSString*
     * @param userInfo NSDictionary*
     */
    initWithNameObjectUserInfo(
      name: string,
      object: WrapperObj<any>,
      userInfo: DictObj
    ): NSNotification
  }

  class NSNotificationCenter {
    static defaultCenter(): NSNotificationCenter
    init(): NSNotificationCenter
    /**
     * @param selector the function name of {@link EventHandler} in {@link InstMember}
     * @param name event name
     */
    addObserverSelectorName(
      observer: WrapperObj<any>,
      selector: string,
      name: string
    ): void
    /**
     * @param notification NSNotification*
     */
    postNotification(notification: NSNotification): void
    /**
     * @param name NSString*
     */
    postNotificationNameObject(name: string, anObject: WrapperObj<any>): void
    /**
     * @param name NSString*
     * @param aUserInfo NSDictionary*
     */
    postNotificationNameObjectUserInfo(
      name: string,
      anObject: WrapperObj<any>,
      aUserInfo: DictObj
    ): void
    removeObserver(observer: WrapperObj<any>): void
    /**
     * @param name NSString*
     */
    removeObserverName(observer: WrapperObj<any>, name: string): void
  }
}
