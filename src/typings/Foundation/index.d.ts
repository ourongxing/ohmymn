export {}
declare global {
  /** A NSTimeInterval value is always specified in seconds;
   * it yields sub-millisecond precision over a range of 10,000 years.
   *
   * On its own, a time interval does not specify a unique point in time,
   * or even a span between specific times. Combining a time interval with
   * one or more known reference points yields a NSDate or NSDateInterval value. */

  type JSValue = any
  type NSDictionary = any
  type NSRange = any
  type NSMutableArray<T = any> = Array<T>
  type NSIndexSet = any
  type NSCharacterSet = any
  class NSNull {
    static new(): NSNull
  }
  type OCNull = typeof NSNull

  class NSIndexPath {
    static indexPathForRowInSection(row: number, section: number): NSIndexPath
    row: number
    section: number
  }

  /** all of NSString methods are not supported  */
  class NSString {
    static stringWithContentsOfFile(path: string): string
    static initWithDataEncoding(data: NSData, encoding: number): string
  }
}
