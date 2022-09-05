import { UIEdgeInsets, UIImageOrientation } from "~/enum"

declare global {
  class UIImage {
    readonly scale: CGFloat
    /**
     *  NSInteger
     */
    readonly leftCapWidth: number
    readonly CGImage: any
    readonly size: CGSize
    /**
     *  NSInteger
     */
    readonly topCapHeight: number
    readonly imageOrientation: UIImageOrientation
    /**
     * @returns UIImage*
     * @param name NSString*
     */
    static imageNamed(name: string): UIImage
    /**
     * @returns UIImage*
     * @param path NSString*
     */
    static imageWithContentsOfFile(path: string): UIImage
    /**
     * @returns UIImage*
     * @param data NSData*
     */
    static imageWithData(data: NSData): UIImage
    /**
     * @returns UIImage*
     * @param data NSData*
     */
    static imageWithDataScale(data: NSData, scale: CGFloat): UIImage
    /**
     * @returns UIImage*
     */
    static imageWithCGImage(cgImage: any): UIImage
    /**
     * @returns UIImage*
     */
    static imageWithCGImageScaleOrientation(
      cgImage: any,
      scale: CGFloat,
      orientation: UIImageOrientation
    ): UIImage
    drawAtPoint(point: CGPoint): void
    drawAtPointBlendModeAlpha(
      point: CGPoint,
      blendMode: CGBlendMode,
      alpha: CGFloat
    ): void
    drawInRect(rect: CGRect): void
    drawInRectBlendModeAlpha(
      rect: CGRect,
      blendMode: CGBlendMode,
      alpha: CGFloat
    ): void
    drawAsPatternInRect(rect: CGRect): void
    /**
     * @returns UIImage*
     */
    resizableImageWithCapInsets(capInsets: UIEdgeInsets): UIImage
    /**
     * @returns UIImage*
     */
    imageWithAlignmentRectInsets(alignmentInsets: UIEdgeInsets): UIImage
    /**
     * @returns UIImage*
     * @param leftCapWidth NSInteger
     * @param topCapHeight NSInteger
     */
    stretchableImageWithLeftCapWidthTopCapHeight(
      leftCapWidth: number,
      topCapHeight: number
    ): UIImage
    /**
     * @returns NSData*
     * @param compressionQuality double
     */
    jpegData(compressionQuality: number): NSData
    /**
     * @returns NSData*
     */
    pngData(): NSData
  }
}
