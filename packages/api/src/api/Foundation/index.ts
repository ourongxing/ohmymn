/**
 * callback function
 */
export declare type JSValue = any

/**
 * JSON Object
 */
export declare type NSDictionary = any
export declare type NSRange = any
export declare type NSMutableArray<T = any> = T[]
export declare type NSCharacterSet = any
export declare type NSIndexPath = {
  row: number
  section: number
}

export declare type NSNull = typeof NSNull

declare global {
  const NSIndexPath: {
    indexPathForRowInSection(row: number, section: number): NSIndexPath
  }
  class NSNull {
    static new(): NSNull
  }
  const NSUUID: {
    UUID(): {
      /** have \- */
      UUIDString(): string
    }
  }
}

export * from "./NSData"
export * from "./NSFileManages"
export * from "./NSJSONSerialization"
export * from "./NSLocale"
export * from "./NSNotification"
export * from "./NSURL"
export * from "./NSTimer"
export * from "./NSURLConnection"
export * from "./NSURLRequest"
export * from "./NSOperationQueue"
export * from "./NSValue"
export * from "./NSUserDefaults"
export * from "./NSIndexSet"
