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

export type UIWindow = any
export type UILocalNotification = any
export type UILabel = any
export type UIImageView = any
export type UIEdgeInsets = any

declare global {
  type CGPoint = any
  type CGSize = any
  type CGFloat = number
  type CGBlendMode = any
  type CGRect = {
    x: number
    y: number
    width: number
    height: number
  }
}
