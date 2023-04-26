import type { UIFont } from "./UIFont"
import type { UIColor } from "./UIColor"
import { NSTextAlignment } from "./UITextField"

declare global {
  class UILabel extends UIView {
    constructor()
    text: string
    font: UIFont
    textColor: UIColor
    textAlignment: NSTextAlignment
    numberOfLines: number
    lineBreakMode: number
    opaque: boolean
    adjustsFontSizeToFitWidth: boolean
  }
}
