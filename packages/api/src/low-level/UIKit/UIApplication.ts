import type { JSValue, NSDictionary, NSURL } from "../Foundation"

declare global {
  const UIApplication: {
    sharedApplication(): UIApplication
  }
}

export declare type UIApplication = {
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
