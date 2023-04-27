import { NSError, NSRange } from "."
import type { NSURL } from "."

export const enum NSStringEncoding /** ASCII encoding contains, 7-bit of information stored in 8 bits. */ {
  ASCIIStringEncoding = 1,

  ISO2022JP = 21,
  /** 8-bit ISO/IEC 8859-1, also knows as Latin1 encoding. */
  ISOLatin1 = 5,

  /** 8-bit ISO/IEC 8859-2, also knows as Latin2 encoding. */
  ISOLatin2 = 9,

  JapaneseEUC = 3,
  MacOSRoman = 30,
  NEXTSTEP = 2,
  NonLossyASCII = 7,
  ShiftJIS = 8,
  Symbol = 6,
  Unicode = 10,
  /** 16 bit-based variable length encoding, blocks are interpreted as big endian. */
  UTF16BigEndian = 2415919360,

  /** 16 bit-based variable length encoding, blocks are interpreted as litle endian. */
  UTF16LittleEndian = 2483028224,

  /** 32-bit unicode encoding. */
  UTF32 = 2348810496,

  /** 32 bit encoding, blocks are interpreted as big endian. */
  UTF32BigEndian = 2550137088,

  /** 32 bit encoding, blocks are interpreted as little endian. */
  UTF32LittleEndian = 2617245952,

  /** 8-bit based variable-length character encoding for Unicode. */
  UTF8 = 4,

  WindowsCP1250 = 15,
  WindowsCP1251 = 11,
  WindowsCP1252 = 12,
  WindowsCP1253 = 13,
  WindowsCP1254 = 14
}

export const enum NSDataReadingOptions {
  Coordinated = 4,
  /** Use the kernel's virtual memory map to load the file, if possible. If sucessful, this replaces read/write memory that can be very expensive with discardable memory that is backed by a file. */
  Mapped = 1,
  /** Force NSData to try to use the kernel's mapping support to load the file. If sucessful, this replaces read/write memory that can be very expensive with discardable memory that is backed by a file. */
  MappedAlways = 8,

  /** Notify the kernel that it should not try to cache the contents of this file in its buffer cache. */
  Uncached = 2
}

export const enum NSDataWritingOptions {
  Atomic = 1,
  FileProtectionComplete = 536870912,
  FileProtectionCompleteUnlessOpen = 805306368,
  FileProtectionCompleteUntilFirstUserAuthentication = 1073741824,
  FileProtectionMask = 4026531840,
  FileProtectionNone = 268435456,
  WithoutOverwriting = 2
}

export const enum NSDataSearchOptions {
  /** Limits the search to the start (or end if SearchBackwards is specified) */
  SearchAnchored = 2,

  /** Starts search from the end, instead of the start. */
  SearchBackwards = 1
}

export declare type NSData = {
  /**
   * @returns NSUInteger
   */
  length(): number
  /**
   * @returns const void*
   */
  bytes(): number
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

declare global {
  const NSData: {
    /**
     * @param string NSString*
     */
    dataWithStringEncoding(string: string, encoding: NSStringEncoding): NSData
    /**
     * @param bytes const void*
     * @param length NSUInteger
     */
    dataWithBytesLength(bytes: any, length: number): NSData
    /**
     * @param bytes void*
     * @param length NSUInteger
     */
    dataWithBytesNoCopyLength(bytes: any, length: number): NSData
    /**
     * @param bytes void*
     * @param length NSUInteger
     */
    dataWithBytesNoCopyLengthFreeWhenDone(
      bytes: any,
      length: number,
      b: boolean
    ): NSData
    /**
     * @param path NSString*
     * @param errorPtr NSError**
     */
    dataWithContentsOfFileOptionsError(
      path: string,
      readOptionsMask: NSDataReadingOptions,
      errorPtr: NSError
    ): NSData
    /**
     * @param url NSURL*
     * @param errorPtr NSError**
     */
    dataWithContentsOfURLOptionsError(
      url: NSURL,
      readOptionsMask: NSDataReadingOptions,
      errorPtr: NSError
    ): NSData
    /**
     * @param path NSString*
     */
    dataWithContentsOfFile(path: string): NSData
    /**
     * @param url NSURL*
     */
    dataWithContentsOfURL(url: NSURL): NSData
    /**
     * @param data NSData*
     */
    dataWithData(data: NSData): NSData
    /**
     * @param path NSString*
     */
    dataWithContentsOfMappedFile(path: string): NSData
  }
}
