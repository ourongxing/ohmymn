import type { NSData, NSIndexSet, NSURL } from "../Foundation"
import type { UIImage } from "./UIImage"
import type { UIColor } from "./UIColor"

declare global {
  const UIPasteboard: {
    /**
     * @returns UIPasteboard*
     */
    generalPasteboard(): UIPasteboard
    /**
     * @returns UIPasteboard*
     * @param pasteboardName NSString*
     */
    pasteboardWithNameCreate(
      pasteboardName: string,
      create: boolean
    ): UIPasteboard
    /**
     * @returns UIPasteboard*
     */
    pasteboardWithUniqueName(): UIPasteboard
    /**
     * @param pasteboardName NSString*
     */
    removePasteboardWithName(pasteboardName: string): void
  }
}

export declare type UIPasteboard = {
  persistent: boolean
  string?: string
  /**
   *  NSInteger
   */
  readonly numberOfItems: number
  URL?: NSURL
  color?: UIColor
  colors?: any[]
  image?: UIImage
  /**
   *  NSInteger
   */
  readonly changeCount: number
  URLs?: NSURL[]
  images?: UIImage[]
  strings?: string[]
  items?: any[]
  readonly name?: string
  /**
   * @returns NSArray*
   */
  pasteboardTypes(): any[]
  /**
   * @param pasteboardTypes NSArray*
   */
  containsPasteboardTypes(pasteboardTypes: any[]): boolean
  /**
   * @returns NSData*
   * @param pasteboardType NSString*
   */
  dataForPasteboardType(pasteboardType: string): NSData
  /**
   * @param pasteboardType NSString*
   */
  valueForPasteboardType(pasteboardType: string): any
  /**
   * @param pasteboardType NSString*
   */
  setValueForPasteboardType(value: any, pasteboardType: string): void
  /**
   * @param data NSData*
   * @param pasteboardType NSString*
   */
  setDataForPasteboardType(data: NSData, pasteboardType: string): void
  /**
   * @returns NSArray*
   * @param itemSet NSIndexSet*
   */
  pasteboardTypesForItemSet(itemSet: NSIndexSet): any[]
  /**
   * @param pasteboardTypes NSArray*
   * @param itemSet NSIndexSet*
   */
  containsPasteboardTypesInItemSet(
    pasteboardTypes: any[],
    itemSet: NSIndexSet
  ): boolean
  /**
   * @returns NSIndexSet*
   * @param pasteboardTypes NSArray*
   */
  itemSetWithPasteboardTypes(pasteboardTypes: any[]): NSIndexSet
  /**
   * @returns NSArray*
   * @param pasteboardType NSString*
   * @param itemSet NSIndexSet*
   */
  valuesForPasteboardTypeInItemSet(
    pasteboardType: string,
    itemSet: NSIndexSet
  ): any[]
  /**
   * @returns NSArray*
   * @param pasteboardType NSString*
   * @param itemSet NSIndexSet*
   */
  dataForPasteboardTypeInItemSet(
    pasteboardType: string,
    itemSet: NSIndexSet
  ): any[]
  /**
   * @param items NSArray*
   */
  addItems(items: any[]): void
}
