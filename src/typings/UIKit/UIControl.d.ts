import { UIView } from "."
import { UIControlEvents } from "./enum"
export class UIControl extends UIView {
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
