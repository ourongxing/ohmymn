import type { NSNull, NSValue, CGRect, CGSize } from "src/low-level"

/**
 * NSValue can't be read by JavaScriptCore, so we need to convert it to string.
 */
export function NSValue2String(v: NSValue) {
  return Database.transArrayToJSCompatible([v])[0] as string
}

/**
 * Convert CGRect string to CGRect.
 * @param str string like "{x,y}, {h,w}"
 */
export function CGRectString2CGRect(str: string): CGRect {
  const arr = str.match(/\d+\.?\d+/g)!.map(k => Number(k))
  return {
    x: arr[0],
    y: arr[1],
    height: arr[2],
    width: arr[3]
  }
}

/**
 * Convert CGSize string to CGSize.
 * @param str string like "{x,y}"
 */
export function CGSizeString2CGSize(str: string): CGSize {
  const arr = str.match(/\d+\.?\d+/g)!.map(k => Number(k))
  return {
    width: arr[0],
    height: arr[1]
  }
}

/**
 * Convert NSValue of CGRect to CGRect.
 * @param v NSValue of CGRect
 */
export function CGSizeValue2CGSize(v: NSValue) {
  return CGSizeString2CGSize(NSValue2String(v))
}

/**
 * Convert NSValue of CGRect to CGRect.
 * @param v NSValue of CGRectk
 */
export function CGRectValue2CGRect(v: NSValue) {
  return CGRectString2CGRect(NSValue2String(v))
}

/**
 * Checks if a object is NSNull, NSNull is not equal to null.
 * Fetch json from server, if the value is null, it will be NSNull.
 */
export function isNSNull(obj: any): obj is NSNull {
  return obj === NSNull.new()
}

/**
 * Convert NSNull to null.
 */
export function NSNull2Null<T>(k: T) {
  return isNSNull(k) ? null : (k as Exclude<T, NSNull>)
}
