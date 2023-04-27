export declare class UIControl extends UIView {
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

export const enum UIControlEvents {}
