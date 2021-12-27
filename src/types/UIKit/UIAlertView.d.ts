export {}
declare global {
  const enum UIAlertViewStyle {
    // A standard alert.
    Default,
    // Allows the user to enter text, but the text field is obscured.
    SecureTextInput,
    // Allows the user to enter text.
    PlainTextInput,
    // Allows the user to enter a login id and a password.
    LoginAndPasswordInput
  }
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
