import { UIControl, UILabel } from "."
import { NSLineBreakMode, UIButtonType, UIEdgeInsets } from "~/enum"

export enum UIControlState {}
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
