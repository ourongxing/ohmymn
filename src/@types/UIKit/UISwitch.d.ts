export {}

declare global {
  class UISwitch extends UIControl {
    onTintColor: UIColor
    on: boolean
    /** * not available */
    setOn(on: boolean, animated: boolean): void
  }
}
