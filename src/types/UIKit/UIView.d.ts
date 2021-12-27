export {}

declare global {
  const enum UIViewAutoresizing {}
  class UIView extends UIResponder {
    constructor(frame?: CGRect)
    bounds: CGRect
    frame: CGRect
    layer: CALayer
    hidden: boolean
    addSubview(view: UIView): void
    autoresizingMask: UIViewAutoresizing
    superview: UIView
    center: CGPoint
    tag: number
    convertRectToView(rect: CGRect, view: UIView): CGRect
    autoresizesSubviews: boolean
    backgroundColor: UIColor
  }
  class CALayer {
    masksToBounds: boolean
    frame: CGRect
    cornerRadius: CGFloat
    borderWidth: CGFloat
    borderColor: UIColor
    opacity: CGFloat
  }
}
