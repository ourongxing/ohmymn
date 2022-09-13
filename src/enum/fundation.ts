/** {@link NSData} */
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

/** {@link NSJSONSerialization} */
export const enum NSJSONWritingOptions {
  PrettyPrinted = 0,
  SortedKeys,
  FragmentsAllowed,
  WithoutEscapingSlashes
}

/** https://developer.apple.com/documentation/foundation/nsjsonreadingoptions */
export const enum NSJSONReadingOptions {
  MutableContainers = 1 << 0,
  MutableLeaves = 1 << 1,
  FragmentsAllowed = 1 << 2,
  JSON5Allowed = 1 << 3,
  TopLevelDictionaryAssumed = 1 << 4
}

/** {@link NSLocale} */
export const enum NSLocaleLanguageDirection {
  BottomToTop = 4,
  LeftToRight = 1,
  RightToLeft = 2,
  TopToBottom = 3,
  Unknown = 0
}

/** {@link NSURL} */
export const enum NSURLBookmarkResolutionOptions {
  WithoutMounting = 512,
  WithoutUI = 256,
  WithSecurityScope = 1024
}

export const enum NSURLBookmarkFileCreationOptions {
  MinimalBookmark = 512,
  PreferFileIDResolution = 256,
  SecurityScopeAllowOnlyReadAccess = 4096,
  SuitableForBookmarkFile = 1024,
  WithSecurityScope = 2048
}

export const enum NSURLBookmarkCreationOptions {
  MinimalBookmark = 512,
  PreferFileIDResolution = 256,
  SecurityScopeAllowOnlyReadAccess = 4096,
  SuitableForBookmarkFile = 1024,
  WithSecurityScope = 2048
}
