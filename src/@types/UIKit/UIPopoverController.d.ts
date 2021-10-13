export {}

declare global {
  class UIPopoverController extends UIControl {
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
