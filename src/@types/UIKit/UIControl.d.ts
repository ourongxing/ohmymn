export {}

declare global {
  const enum UIControlEvents {}
  class UIControl extends UIView {
    enabled: boolean
    highlighted: boolean
    selected: boolean
    addTargetActionForControlEvents(
      target: WrapperObj<any>,
      action: string,
      controlEvent: UIControlEvents
    ): void
    removeTargetActionForControlEvents(
      target: WrapperObj<any>,
      action: string,
      controlEvent: UIControlEvents
    ): void
  }
}
