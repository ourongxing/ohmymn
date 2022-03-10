import { NSJSONReadingOptions, NSJSONWritingOptions } from "./enum"

declare global {
  class NSJSONSerialization {
    static isValidJSONObject(obj: WrapperObj<any>): boolean
    static JSONObjectWithDataOptions(
      obj: WrapperObj<any>,
      data: NSJSONReadingOptions
    ): WrapperObj<any>
    static dataWithJSONObjectOptions(
      obj: WrapperObj<any>,
      options: NSJSONWritingOptions
    ): NSData
  }
}
