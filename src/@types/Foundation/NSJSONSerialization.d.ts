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
    static JSONObjectWithDataOptions(
      obj: WrapperObj<any>,
      data: NSJSONReadingOptions
    ): WrapperObj<any>
    static dataWithJSONObject(
      obj: WrapperObj<any>,
      options: NSJSONWritingOptions
    ): NSData
  }
}
