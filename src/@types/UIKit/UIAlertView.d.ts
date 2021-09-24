export {}
declare global {
  const enum UIAlertViewStyle {}
  class UIAlertView {
    static showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      title: string,
      message: string,
      style: UIAlertViewStyle,
      cancelButtonTitle: string,
      otherButtonTitles: Array<string>,
      tapBlock: object
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
