import { CGFloat, CGPoint, CGBlendMode, CGRect } from "."
import { UIEdgeInsets } from "./UIButton"
import type { NSData } from "../Foundation"

export const enum UIImageOrientation {
  /** Rotated 180 degrees.  */
  Down = 1,

  /** Flipped about its vertical axis and then rotated 180 degrees.  */
  DownMirrored = 5,

  /** Rotated 90 degrees counterclockwise.  */
  Left = 2,

  /** Flipped about its horizontal axis and then rotated 90 degrees counterclockwise.  */
  LeftMirrored = 6,

  /** Rotated 90 degrees clockwise.  */
  Right = 3,

  /** Flipped about its horizontal axis and then rotated 90 degrees clockwise.  */
  RightMirrored = 7,

  /** Default orientation.  */
  Up = 0,

  /** Flipped about its vertical axis.  */
  UpMirrored = 4
}
declare global {
  const UIImage: {
    /**
     * @returns UIImage*
     * @param name NSString*
     */
    imageNamed(name: string): UIImage
    /**
     * @returns UIImage*
     * @param path NSString*
     */
    imageWithContentsOfFile(path: string): UIImage
    /**
     * @returns UIImage*
     * @param data NSData*
     */
    imageWithData(data: NSData): UIImage
    /**
     * @returns UIImage*
     * @param data NSData*
     */
    imageWithDataScale(data: NSData, scale: CGFloat): UIImage
    /**
     * @returns UIImage*
     */
    imageWithCGImage(cgImage: any): UIImage
    /**
     * @returns UIImage*
     */
    imageWithCGImageScaleOrientation(
      cgImage: any,
      scale: CGFloat,
      orientation: UIImageOrientation
    ): UIImage
  }
}

export declare type UIImage = {
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
