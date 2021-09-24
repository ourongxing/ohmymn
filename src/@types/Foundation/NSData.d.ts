export {}

declare global {
  const enum NSDataReadingOptions {
    Coordinated = 4,
    /** Use the kernel's virtual memory map to load the file, if possible. If sucessful, this replaces read/write memory that can be very expensive with discardable memory that is backed by a file. */
    Mapped = 1,
    /** Force NSData to try to use the kernel's mapping support to load the file. If sucessful, this replaces read/write memory that can be very expensive with discardable memory that is backed by a file. */
    MappedAlways = 8,

    /** Notify the kernel that it should not try to cache the contents of this file in its buffer cache. */
    Uncached = 2
  }

  const enum NSDataWritingOptions {
    Atomic = 1,
    FileProtectionComplete = 536870912,
    FileProtectionCompleteUnlessOpen = 805306368,
    FileProtectionCompleteUntilFirstUserAuthentication = 1073741824,
    FileProtectionMask = 4026531840,
    FileProtectionNone = 268435456,
    WithoutOverwriting = 2
  }

  const enum NSDataSearchOptions {
    /** Limits the search to the start (or end if SearchBackwards is specified) */
    SearchAnchored = 2,

    /** Starts search from the end, instead of the start. */
    SearchBackwards = 1
  }
  class NSData {
    static data(): WrapperObj<any>
    /**
     * @param string NSString*
     */
    static dataWithStringEncoding(
      string: string,
      encoding: NSStringEncoding
    ): WrapperObj<any>
    /**
     * @param bytes const void*
     * @param length NSUInteger
     */
    static dataWithBytesLength(bytes: any, length: number): WrapperObj<any>
    /**
     * @param bytes void*
     * @param length NSUInteger
     */
    static dataWithBytesNoCopyLength(
      bytes: any,
      length: number
    ): WrapperObj<any>
    /**
     * @param bytes void*
     * @param length NSUInteger
     */
    static dataWithBytesNoCopyLengthFreeWhenDone(
      bytes: any,
      length: number,
      b: boolean
    ): WrapperObj<any>
    /**
     * @param path NSString*
     * @param errorPtr NSError**
     */
    static dataWithContentsOfFileOptionsError(
      path: string,
      readOptionsMask: NSDataReadingOptions,
      errorPtr: NSError
    ): WrapperObj<any>
    /**
     * @param url NSURL*
     * @param errorPtr NSError**
     */
    static dataWithContentsOfURLOptionsError(
      url: NSURL,
      readOptionsMask: NSDataReadingOptions,
      errorPtr: NSError
    ): WrapperObj<any>
    /**
     * @param path NSString*
     */
    static dataWithContentsOfFile(path: string): WrapperObj<any>
    /**
     * @param url NSURL*
     */
    static dataWithContentsOfURL(url: NSURL): WrapperObj<any>
    /**
     * @param data NSData*
     */
    static dataWithData(data: NSData): WrapperObj<any>
    /**
     * @param path NSString*
     */
    static dataWithContentsOfMappedFile(path: string): WrapperObj<any>

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
