export {}

declare global {
  const enum UIButtonType {
    system = 0
  }
  const enum UIControlState {}
  class UIButton extends UIControl {
    static buttonWithType(buttonType: UIButtonType): UIButton
    buttonType: UIButtonType
    setTitleForState(title: string, state: UIControlState): void
    setTitleColorForState(color: UIColor, state: UIControlState): void
    titleLabel: UILabel
  }
}
