import type { NSData } from "./NSData"

export const enum NSJSONWritingOptions {
  PrettyPrinted = 0,
  SortedKeys,
  FragmentsAllowed,
  WithoutEscapingSlashes
}

export const enum NSJSONReadingOptions {
  MutableContainers = 1 << 0,
  MutableLeaves = 1 << 1,
  FragmentsAllowed = 1 << 2,
  JSON5Allowed = 1 << 3,
  TopLevelDictionaryAssumed = 1 << 4
}

declare global {
  const NSJSONSerialization: {
    isValidJSONObject(obj: any): boolean
    JSONObjectWithDataOptions(data: NSData, options: NSJSONReadingOptions): any
    dataWithJSONObjectOptions(obj: any, options: NSJSONWritingOptions): NSData
  }
}

export declare type NSJSONSerialization = {}
