import { UIControl, UIView, UIViewController } from "."

declare global {
  class UIPopoverController extends UIControl {
    delegate: WrapperObj<any>
    constructor(viewController: UIViewController)
    presentPopoverFromRect(
      rect: CGRect,
      view: UIView,
      arrowDirections: number,
      animated: boolean
    ): void
    dismissPopoverAnimated(animated: boolean): void
  }
}
