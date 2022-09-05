import { NSJSONReadingOptions, NSJSONWritingOptions } from "~/enum"

declare global {
  class NSJSONSerialization {
    static isValidJSONObject(obj: any): boolean
    static JSONObjectWithDataOptions(obj: any, data: NSJSONReadingOptions): any
    static dataWithJSONObjectOptions(
      obj: any,
      options: NSJSONWritingOptions
    ): NSData
  }
}
