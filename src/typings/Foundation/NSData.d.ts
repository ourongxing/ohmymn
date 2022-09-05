import {
  NSStringEncoding,
  NSDataReadingOptions,
  NSDataWritingOptions,
  NSDataSearchOptions
} from "~/enum"

declare global {
  class NSData {
    static data(): any
    /**
     * @param string NSString*
     */
    static dataWithStringEncoding(
      string: string,
      encoding: NSStringEncoding
    ): NSData
    /**
     * @param bytes const void*
     * @param length NSUInteger
     */
    static dataWithBytesLength(bytes: any, length: number): any
    /**
     * @param bytes void*
     * @param length NSUInteger
     */
    static dataWithBytesNoCopyLength(bytes: any, length: number): any
    /**
     * @param bytes void*
     * @param length NSUInteger
     */
    static dataWithBytesNoCopyLengthFreeWhenDone(
      bytes: any,
      length: number,
      b: boolean
    ): any
    /**
     * @param path NSString*
     * @param errorPtr NSError**
     */
    static dataWithContentsOfFileOptionsError(
      path: string,
      readOptionsMask: NSDataReadingOptions,
      errorPtr: NSError
    ): any
    /**
     * @param url NSURL*
     * @param errorPtr NSError**
     */
    static dataWithContentsOfURLOptionsError(
      url: NSURL,
      readOptionsMask: NSDataReadingOptions,
      errorPtr: NSError
    ): any
    /**
     * @param path NSString*
     */
    static dataWithContentsOfFile(path: string): any
    /**
     * @param url NSURL*
     */
    static dataWithContentsOfURL(url: NSURL): any
    /**
     * @param data NSData*
     */
    static dataWithData(data: NSData): any
    /**
     * @param path NSString*
     */
    static dataWithContentsOfMappedFile(path: string): any

    /**
     * @returns NSUInteger
     */
    length(): number
    /**
     * @returns const void*
     */
    bytes(): any
    /**
     * @returns NSString*
     */
    description(): string
    /**
     * @param buffer void*
     * @param length NSUInteger
     */
    getBytesLength(buffer: any, length: number): void
    /**
     * @param buffer void*
     */
    getBytesRange(buffer: void, range: NSRange): void
    /**
     * @param other NSData*
     */
    isEqualToData(other: NSData): boolean
    /**
     * @returns NSData*
     */
    subdataWithRange(range: NSRange): NSData
    /**
     * @param path NSString*
     */
    writeToFileAtomically(path: string, useAuxiliaryFile: boolean): boolean
    /**
     * @param url NSURL*
     */
    writeToURLAtomically(url: NSURL, atomically: boolean): boolean
    /**
     * @param path NSString*
     * @param errorPtr NSError**
     */
    writeToFileOptionsError(
      path: string,
      writeOptionsMask: NSDataWritingOptions,
      errorPtr: NSError
    ): boolean
    /**
     * @param url NSURL*
     * @param errorPtr NSError**
     */
    writeToURLOptionsError(
      url: NSURL,
      writeOptionsMask: NSDataWritingOptions,
      errorPtr: NSError
    ): boolean
    /**
     * @param dataToFind NSData*
     */
    rangeOfDataOptionsRange(
      dataToFind: NSData,
      mask: NSDataSearchOptions,
      searchRange: NSRange
    ): NSRange
    /**
     * @param block void (^)(const void*bytes,NSRange byteRange,BOOL*stop)
     */
    enumerateByteRangesUsingBlock(block: any): void
    /**
     * @param buffer void*
     */
    getBytes(buffer: any): void
    /**
     * @returns NSString*
     */
    base64Encoding(): string
  }
}
