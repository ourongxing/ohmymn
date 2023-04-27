export const enum UIAlertViewStyle {
  /**
   * The default alert view style. The default.
   */
  Default,
  /**
   * Allows the user to enter text, but the text field is obscured.
   */
  SecureTextInput,
  /**
   * Allows the user to enter text.
   */
  PlainTextInput,
  /**
   * Allows the user to enter a login id and a password.
   * @deprecated not support yet
   */
  LoginAndPasswordInput
}

declare global {
  const UIAlertView: {
    showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      title: string,
      message: string,
      style: UIAlertViewStyle,
      cancelButtonTitle: string,
      otherButtonTitles: string[],
      tapBlock: (alert: UIAlertView, buttonIndex: number) => any
    ): void
    makeWithTitleMessageDelegateCancelButtonTitleOtherButtonTitles(
      title: string,
      message: string,
      delegate: any,
      cancelButtonTitle: string,
      otherButtonTitles: string[]
    ): void
  }
}

export declare type UIAlertView = {
  textFieldAtIndex(textFieldIndex: number): UITextField
}
