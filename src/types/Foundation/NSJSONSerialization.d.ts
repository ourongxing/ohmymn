export {}
declare global {
  const enum NSJSONWritingOptions {
    PrettyPrinted = 0,
    SortedKeys,
    FragmentsAllowed,
    WithoutEscapingSlashes
  }
  const enum NSJSONReadingOptions {
    MutableContainers = 0,
    MutableLeaves,
    AllowFragments
  }
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
