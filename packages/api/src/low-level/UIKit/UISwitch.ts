import { UIControl, UIColor } from "."

declare global {
  class UISwitch extends UIControl {
    onTintColor: UIColor
    on: boolean
  }
}
