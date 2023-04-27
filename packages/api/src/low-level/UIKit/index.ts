export * from "./UIAlertView"
export * from "./UIAlertView"
export * from "./UIApplication"
export * from "./UIButton"
export * from "./UIColor"
export * from "./UIControl"
export * from "./UIEvent"
export * from "./UIFont"
export * from "./UIImage"
export * from "./UIPasteboard"
export * from "./UIPopoverController"
export * from "./UIResponder"
export * from "./UISwitch"
export * from "./UITableView"
export * from "./UITableViewCell"
export * from "./UITableViewController"
export * from "./UITextField"
export * from "./UIVIewController"
export * from "./UIView"
export * from "./UIGestureRecognizer"
export * from "./UIWebView"
export * from "./UILabel"

export type UIWindow = any
export type UILocalNotification = any
export type UIImageView = any
export type UITouch = any

export declare type CGFloat = number
export declare type CGBlendMode = any
export declare type CGPoint = { x: number; y: number }
export declare type CGSize = { width: number; height: number }
export declare type CGRect = {
  x: number
  y: number
  width: number
  height: number
}

declare global {
  const UIDevice: {
    currentDevice(): UIDevice
  }
}
export declare type UIDevice = {
  systemVersion: string
}
