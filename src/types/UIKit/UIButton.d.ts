import { UIControl, UILabel } from "."

export const enum UIButtonType {
  system = 0
}
export const enum UIControlState {}
declare global {
  class UIButton extends UIControl {
    static buttonWithType(buttonType: UIButtonType): UIButton
    buttonType: UIButtonType
    setTitleForState(title: string, state: UIControlState): void
    setTitleColorForState(color: UIColor, state: UIControlState): void
    titleLabel: UILabel
  }
}
