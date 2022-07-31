/** {@link UIAlertView} */
export const enum UIAlertViewStyle {
  // A standard alert.
  Default,
  // Allows the user to enter text, but the text field is obscured.
  SecureTextInput,
  // Allows the user to enter text.
  PlainTextInput,
  // Allows the user to enter a login id and a password.
  LoginAndPasswordInput
}

/** {@link UIButton} */
export const enum UIButtonType {
  system = 0
}
export const enum NSLineBreakMode {}
export type UIEdgeInsets = {
  top: number
  left: number
  bottom: number
  right: number
}

/** {@link UIControl} */
export const enum UIControlEvents {}

/** {@link UIGestureRecognizer} */
export const enum UIGestureRecognizerState {}
export const enum UISwipeGestureRecognizerDirection {
  Right = 1 << 0,
  Left = 1 << 1,
  Up = 1 << 2,
  Down = 1 << 3
}

/** {@link UIImage} */
export const enum UIImageOrientation {
  /** Rotated 180 degrees.  */
  Down = 1,

  /** Flipped about its vertical axis and then rotated 180 degrees.  */
  DownMirrored = 5,

  /** Rotated 90 degrees counterclockwise.  */
  Left = 2,

  /** Flipped about its horizontal axis and then rotated 90 degrees counterclockwise.  */
  LeftMirrored = 6,

  /** Rotated 90 degrees clockwise.  */
  Right = 3,

  /** Flipped about its horizontal axis and then rotated 90 degrees clockwise.  */
  RightMirrored = 7,

  /** Default orientation.  */
  Up = 0,

  /** Flipped about its vertical axis.  */
  UpMirrored = 4
}

/** {@link UITableView} */
export const enum UITableViewStyle {}
export const enum UITableViewCellSeparatorStyle {}
export const enum UITableViewScrollPosition {}
export const enum UITableViewRowAnimation {}

/** {@link UITableViewCell} */
export const enum UITableViewCellSelectionStyle {}
export const enum UITableViewCellAccessoryTypeStyle {}
export const enum UITableViewCellStyle {
  Default = 0,
  Value1 = 1,
  Value2 = 2,
  Subtitle = 3
}

/** {@link UITextField} */
export const enum NSTextAlignment {
  Left, //左对齐
  Center, //居中
  Right, //右对齐
  Justified, //最后一行自然对齐
  Natural //默认对齐脚本
}
