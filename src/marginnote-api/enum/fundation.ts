/** {@link NSData} */

/** {@link NSJSONSerialization} */
export const enum NSJSONWritingOptions {
  PrettyPrinted = 0,
  SortedKeys,
  FragmentsAllowed,
  WithoutEscapingSlashes
}

/** https://developer.apple.com/documentation/foundation/nsjsonreadingoptions */
export const enum NSJSONReadingOptions {
  MutableContainers = 1 << 0,
  MutableLeaves = 1 << 1,
  FragmentsAllowed = 1 << 2,
  JSON5Allowed = 1 << 3,
  TopLevelDictionaryAssumed = 1 << 4
}

/** {@link NSLocale} */

/** {@link NSURL} */
