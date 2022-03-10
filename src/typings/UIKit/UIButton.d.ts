import { UIControl, UILabel } from "."

export const enum UIButtonType {
  system = 0
}
export const enum NSLineBreakMode {}
export type UIEdgeInsets = {
  top: number
  left: number
  bottom: number
  right: number
}
export const enum UIControlState {}
declare global {
  class UIButton extends UIControl {
    static buttonWithType(buttonType: UIButtonType): UIButton
    buttonType: UIButtonType
    titleEdgeInsets: UIEdgeInsets
    lineBreakMode: NSLineBreakMode
    setTitleForState(title: string, state: UIControlState): void
    setTitleColorForState(color: UIColor, state: UIControlState): void
    titleLabel: UILabel
  }
}
