import { UIView } from "."
import { UIControlEvents } from "~/enum"
export class UIControl extends UIView {
  enabled: boolean
  highlighted: boolean
  selected: boolean
  addTargetActionForControlEvents(
    target: any,
    action: string,
    controlEvent: UIControlEvents
  ): void
  removeTargetActionForControlEvents(
    target: any,
    action: string,
    controlEvent: UIControlEvents
  ): void
}
