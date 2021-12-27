import { UIView } from "."
export const enum UIControlEvents {}
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
