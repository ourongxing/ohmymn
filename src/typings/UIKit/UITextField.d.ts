import { UIControl, UIView } from "."
import { NSTextAlignment } from "~/enum"

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
