import { CGFloat } from "."

declare global {
  const UIColor: {
    colorWithHexString(rgbHex: string): UIColor
    blackColor(): UIColor
    darkGrayColor(): UIColor
    lightGrayColor(): UIColor
    whiteColor(): UIColor
    grayColor(): UIColor
    redColor(): UIColor
    greenColor(): UIColor
    blueColor(): UIColor
    cyanColor(): UIColor
    yellowColor(): UIColor
    magentaColor(): UIColor
    orangeColor(): UIColor
    purpleColor(): UIColor
    brownColor(): UIColor
    clearColor(): UIColor
  }
}

export declare type UIColor = {
  hexStringValue: string
  colorWithAlphaComponent(alpha: CGFloat): UIColor
}
