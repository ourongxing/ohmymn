export {}

declare global {
  type UIWindow = any
  type UILocalNotification = any
  type UILabel = any
  type UIImageView = any

  /** https://developer.apple.com/documentation/coregraphics/cgpoint */
  type CGPoint = any
  type CGSize = any
  type CGFloat = number
  type CGBlendMode = any
  type UIEdgeInsets = any
  interface CGRect {
    x: number
    y: number
    width: number
    height: number
  }
}
