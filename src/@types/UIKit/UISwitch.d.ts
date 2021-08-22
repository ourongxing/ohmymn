export {}

declare global {
  class UISwitch extends UIControl{
    onTintColor: UIColor;
    on: boolean;
    setOn(on: boolean, animated: boolean): void;
  }
}
