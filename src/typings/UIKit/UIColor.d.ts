export {}
declare global {
  class UIColor {
    static colorWithHexString(rgbHex: string): UIColor
    static blackColor(): UIColor
    static darkGrayColor(): UIColor
    static lightGrayColor(): UIColor
    static whiteColor(): UIColor
    static grayColor(): UIColor
    static redColor(): UIColor
    static greenColor(): UIColor
    static blueColor(): UIColor
    static cyanColor(): UIColor
    static yellowColor(): UIColor
    static magentaColor(): UIColor
    static orangeColor(): UIColor
    static purpleColor(): UIColor
    static brownColor(): UIColor
    static clearColor(): UIColor
    hexStringValue: string
    colorWithAlphaComponent(alpha: CGFloat): UIColor
  }
}
