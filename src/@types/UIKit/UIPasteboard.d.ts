export {}

declare global {
  class UIPasteboard {
    persistent: boolean
    string?: string
    /**
     *  NSInteger
     */
    readonly numberOfItems: number
    URL?: NSURL
    color?: UIColor
    colors?: Array<any>
    image?: UIImage
    /**
     *  NSInteger
     */
    readonly changeCount: number
    URLs?: Array<NSURL>
    images?: Array<UIImage>
    strings?: Array<string>
    items?: Array<any>
    readonly name?: string
    /**
     * @returns UIPasteboard*
     */
    static generalPasteboard(): UIPasteboard
    /**
     * @returns UIPasteboard*
     * @param pasteboardName NSString*
     */
    static pasteboardWithNameCreate(
      pasteboardName: string,
      create: boolean
    ): UIPasteboard
    /**
     * @returns UIPasteboard*
     */
    static pasteboardWithUniqueName(): UIPasteboard
    /**
     * @param pasteboardName NSString*
     */
    static removePasteboardWithName(pasteboardName: string): void
    /**
     * @returns NSArray*
     */
    pasteboardTypes(): Array<any>
    /**
     * @param pasteboardTypes NSArray*
     */
    containsPasteboardTypes(pasteboardTypes: Array<any>): boolean
    /**
     * @returns NSData*
     * @param pasteboardType NSString*
     */
    dataForPasteboardType(pasteboardType: string): NSData
    /**
     * @param pasteboardType NSString*
     */
    valueForPasteboardType(pasteboardType: string): WrapperObj<any>
    /**
     * @param pasteboardType NSString*
     */
    setValueForPasteboardType(
      value: WrapperObj<any>,
      pasteboardType: string
    ): void
    /**
     * @param data NSData*
     * @param pasteboardType NSString*
     */
    setDataForPasteboardType(data: NSData, pasteboardType: string): void
    /**
     * @returns NSArray*
     * @param itemSet NSIndexSet*
     */
    pasteboardTypesForItemSet(itemSet: NSIndexSet): Array<any>
    /**
     * @param pasteboardTypes NSArray*
     * @param itemSet NSIndexSet*
     */
    containsPasteboardTypesInItemSet(
      pasteboardTypes: Array<any>,
      itemSet: NSIndexSet
    ): boolean
    /**
     * @returns NSIndexSet*
     * @param pasteboardTypes NSArray*
     */
    itemSetWithPasteboardTypes(pasteboardTypes: Array<any>): NSIndexSet
    /**
     * @returns NSArray*
     * @param pasteboardType NSString*
     * @param itemSet NSIndexSet*
     */
    valuesForPasteboardTypeInItemSet(
      pasteboardType: string,
      itemSet: NSIndexSet
    ): Array<any>
    /**
     * @returns NSArray*
     * @param pasteboardType NSString*
     * @param itemSet NSIndexSet*
     */
    dataForPasteboardTypeInItemSet(
      pasteboardType: string,
      itemSet: NSIndexSet
    ): Array<any>
    /**
     * @param items NSArray*
     */
    addItems(items: Array<any>): void
  }
}
