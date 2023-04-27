import { CGPoint, CGSize, CGRect } from "../UIKit"
import { NSValue2String } from "src/high-level"

/**
 * Can't read directly, use {@link NSValue2String} to convert to string
 */
export declare type NSValue = {
  CGPointValue(): CGPoint
  CGSizeValue(): CGSize
  CGRectValue(): CGRect
}
