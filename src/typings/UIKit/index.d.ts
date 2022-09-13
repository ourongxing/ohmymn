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

export type UIWindow = any
export type UILocalNotification = any
export type UILabel = any
export type UIImageView = any
export type UITouch = any

declare global {
  type CGFloat = number
  type CGBlendMode = any
  type CGPoint = { x: number; y: number }
  type CGSize = { width: number; height: number }
  type CGRect = {
    x: number
    y: number
    width: number
    height: number
  }
  class UIDevice {
    static currentDevice(): UIDevice
    systemVersion: string
  }
}
