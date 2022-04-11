import { UIAlertViewStyle } from "./enum"

declare global {
  class UIAlertView {
    static showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      title: string,
      message: string,
      style: UIAlertViewStyle,
      cancelButtonTitle: string,
      otherButtonTitles: Array<string>,
      tapBlock: Function
    ): void
    static makeWithTitleMessageDelegateCancelButtonTitleOtherButtonTitles(
      title: string,
      message: string,
      delegate: WrapperObj<any>,
      cancelButtonTitle: string,
      otherButtonTitles: Array<string>
    ): void
    textFieldAtIndex(textFieldIndex: number): UITextField
  }
}
