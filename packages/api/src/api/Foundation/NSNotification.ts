import { DictObj } from ".."

declare global {
  const NSNotification: {
    /**
     * @param name NSString*
     */
    notificationWithNameObject(name: string, anObject: any): NSNotification
    /**
     * @param name NSString*
     * @param aUserInfo NSDictionary*
     */
    notificationWithNameObjectUserInfo(
      name: string,
      anObject: any,
      aUserInfo: DictObj
    ): NSNotification
  }

  const NSNotificationCenter: {
    defaultCenter(): NSNotificationCenter
  }
}

export declare type NSNotification = {
  readonly name?: string
  readonly object: any
  readonly userInfo?: DictObj
  /**
   * @param name NSString*
   * @param userInfo NSDictionary*
   */
  initWithNameObjectUserInfo(
    name: string,
    object: any,
    userInfo: DictObj
  ): NSNotification
}

export declare type NSNotificationCenter = {
  init(): NSNotificationCenter
  /**
   * @param selector the function name of {@link EventHandler} in {@link InstMember}
   * @param name event name
   */
  addObserverSelectorName(observer: any, selector: string, name: string): void
  /**
   * @param notification NSNotification*
   */
  postNotification(notification: NSNotification): void
  /**
   * @param name NSString*
   */
  postNotificationNameObject(name: string, anObject: any): void
  /**
   * @param name NSString*
   * @param aUserInfo NSDictionary*
   */
  postNotificationNameObjectUserInfo(
    name: string,
    anObject: any,
    aUserInfo: DictObj
  ): void
  removeObserver(observer: any): void
  /**
   * @param name NSString*
   */
  removeObserverName(observer: any, name: string): void
}
