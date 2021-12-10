export {}

declare global {
  class UIApplication {
    static sharedApplication(): UIApplication
    networkActivityIndicatorVisible: boolean
    idleTimerDisabled: boolean
    openURL(url: NSURL): boolean
    canOpenURL(url: NSURL): boolean
    openURLOptionsCompletionHandler(
      url: NSURL,
      options: NSDictionary,
      completionHandler: JSValue
    ): void
  }
}
