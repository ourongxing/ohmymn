import { CGPoint, UIEvent, UITouch } from "."
export const enum UIGestureRecognizerState {}
export const enum UISwipeGestureRecognizerDirection {
  Right = 1 << 0,
  Left = 1 << 1,
  Up = 1 << 2,
  Down = 1 << 3
}
declare global {
  class UIGestureRecognizer {
    constructor(target: any, action: string)
    state: UIGestureRecognizerState
    delegate: any
    enabled: boolean
    view: UIView
    cancelsTouchesInView: boolean
    delaysTouchesBegan: boolean
    delaysTouchesEnded: boolean
    numberOfTouches(): number
    addTargetAction(target: any, action: string): void
    removeTargetAction(target: any, action: string): void
    requireGestureRecognizerToFail(
      otherGestureRecognizer: UIGestureRecognizer
    ): void
    ignoreTouch(touch: UITouch): void
    ignoreTouchForEvevnt(touch: UITouch, event: UIEvent): void
    reset(): void
    locationInView(view: UIView): CGPoint
    translationInView(view: UIView): CGPoint
  }
  class UITapGestureRecognizer extends UIGestureRecognizer {
    numberOfTapsRequired: number
    numberOfTouchesRequired: number
  }
  class UISwipeGestureRecognizer extends UIGestureRecognizer {
    direction: UISwipeGestureRecognizerDirection
    numberOfTouchesRequired: number
  }
  class UIPanGestureRecognizer extends UIGestureRecognizer {}
}
