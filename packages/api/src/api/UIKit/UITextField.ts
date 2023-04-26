import { CGRect, UIControl } from "."
import type { UIImage, UIColor } from "."

export const enum NSTextAlignment {
  Left, //左对齐
  Center, //居中
  Right, //右对齐
  Justified, //最后一行自然对齐
  Natural //默认对齐脚本
}
export enum UITextBorderStyle {}
declare global {
  class UITextField extends UIControl {
    [x: string]: any
    constructor(frame?: CGRect)
    delegate: any
    textColor: UIColor
    background: UIImage
    placeholder: string
    textAlignment: NSTextAlignment
    leftView: UIView
    font: any
    text: string
    rightView: UIView
    editing: boolean
    borderStyle: UITextBorderStyle
  }
}
