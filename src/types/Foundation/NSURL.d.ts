export {}
declare global {
  const enum NSStringEncoding /** ASCII encoding contains, 7-bit of information stored in 8 bits. */ {
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
  class NSURL {
    percentEncodedFragment?: string
    percentEncodedPath?: string
    query?: string
    percentEncodedPassword?: string
    path?: string
    host?: string
    password?: string
    scheme?: string
    percentEncodedHost?: string
    percentEncodedUser?: string
    percentEncodedQuery?: string
    user?: string
    fragment?: string
    port?: number | boolean
    /**
     * @param path NSString*
     */
    static fileURLWithPathIsDirectory(
      path: string,
      isDir: boolean
    ): WrapperObj<any>
    /**
     * @param path NSString*
     */
    static fileURLWithPath(path: string): WrapperObj<any>
    /**
     * @param path const char*
     * @param baseURL NSURL*
     */
    static fileURLWithFileSystemRepresentationIsDirectoryRelativeToURL(
      path: string,
      isDir: boolean,
      baseURL: NSURL
    ): WrapperObj<any>
    /**
     * @param URLString NSString*
     */
    static URLWithString(URLString: string): WrapperObj<any>
    /**
     * @param URLString NSString*
     * @param baseURL NSURL*
     */
    static URLWithStringRelativeToURL(
      URLString: string,
      baseURL: NSURL
    ): WrapperObj<any>
    /**
     * @param bookmarkData NSData*
     * @param relativeURL NSURL*
     * @param isStale BOOL*
     * @param error NSError**
     */
    static URLByResolvingBookmarkDataOptionsRelativeToURLBookmarkDataIsStaleError(
      bookmarkData: NSData,
      options: NSURLBookmarkResolutionOptions,
      relativeURL: NSURL,
      isStale: boolean,
      error: NSError
    ): WrapperObj<any>
    /**
     * @returns NSDictionary*
     * @param keys NSArray*
     * @param bookmarkData NSData*
     */
    static resourceValuesForKeysFromBookmarkData(
      keys: Array<any>,
      bookmarkData: NSData
    ): DictObj
    /**
     * @param bookmarkData NSData*
     * @param bookmarkFileURL NSURL*
     * @param error NSError**
     */
    static writeBookmarkDataToURLOptionsError(
      bookmarkData: NSData,
      bookmarkFileURL: NSURL,
      options: NSURLBookmarkFileCreationOptions,
      error: NSError
    ): boolean
    /**
     * @returns NSData*
     * @param bookmarkFileURL NSURL*
     * @param error NSError**
     */
    static bookmarkDataWithContentsOfURLError(
      bookmarkFileURL: NSURL,
      error: NSError
    ): NSData
    /**
     * @param url NSURL*
     */
    static componentsWithURLResolvingAgainstBaseURL(
      url: NSURL,
      resolve: boolean
    ): WrapperObj<any>
    /**
     * @param URLString NSString*
     */
    static componentsWithString(URLString: string): WrapperObj<any>
    static URLUserAllowedCharacterSet(): WrapperObj<any>
    static URLPasswordAllowedCharacterSet(): WrapperObj<any>
    static URLHostAllowedCharacterSet(): WrapperObj<any>
    static URLPathAllowedCharacterSet(): WrapperObj<any>
    static URLQueryAllowedCharacterSet(): WrapperObj<any>
    static URLFragmentAllowedCharacterSet(): WrapperObj<any>
    /**
     * @returns NSURL*
     * @param components NSArray*
     */
    static fileURLWithPathComponents(components: Array<any>): NSURL
    /**
     * @returns NSString*
     */
    absoluteString(): string
    /**
     * @returns NSString*
     */
    relativeString(): string
    /**
     * @returns NSURL*
     */
    baseURL(): NSURL
    /**
     * @returns NSURL*
     */
    absoluteURL(): NSURL
    /**
     * @returns NSString*
     */
    // scheme(): string;
    /**
     * @returns NSString*
     */
    resourceSpecifier(): string
    /**
     * @returns NSString*
     */
    // host(): string;
    /**
     * @returns NSNumber*
     */
    // port(): number | boolean;
    /**
     * @returns NSString*
     */
    // user(): string;
    /**
     * @returns NSString*
     */
    // password(): string;
    /**
     * @returns NSString*
     */
    // path(): string;
    /**
     * @returns NSString*
     */
    // fragment(): string;
    /**
     * @returns NSString*
     */
    parameterString(): string
    /**
     * @returns NSString*
     */
    // query(): string;
    /**
     * @returns NSString*
     */
    relativePath(): string
    /**
     * @param buffer char*
     */
    getFileSystemRepresentationMaxLength(
      buffer: string,
      maxBufferLength: number
    ): boolean
    /**
     * @returns const char*
     */
    fileSystemRepresentation(): string
    isFileURL(): boolean
    /**
     * @returns NSURL*
     */
    standardizedURL(): NSURL
    /**
     * @param error NSError**
     */
    checkResourceIsReachableAndReturnError(error: NSError): boolean
    isFileReferenceURL(): boolean
    /**
     * @returns NSURL*
     */
    fileReferenceURL(): NSURL
    /**
     * @returns NSURL*
     */
    filePathURL(): NSURL
    /**
     * @param value out id*
     * @param key NSString*
     * @param error out NSError**
     */
    getResourceValueForKeyError(
      value: WrapperObj<any>,
      key: string,
      error: NSError
    ): boolean
    /**
     * @returns NSDictionary*
     * @param keys NSArray*
     * @param error NSError**
     */
    resourceValuesForKeysError(keys: Array<any>, error: NSError): DictObj
    /**
     * @param key NSString*
     * @param error NSError**
     */
    setResourceValueForKeyError(
      value: WrapperObj<any>,
      key: string,
      error: NSError
    ): boolean
    /**
     * @param keyedValues NSDictionary*
     * @param error NSError**
     */
    setResourceValuesError(keyedValues: DictObj, error: NSError): boolean
    /**
     * @param key NSString*
     */
    removeCachedResourceValueForKey(key: string): void
    removeAllCachedResourceValues(): void
    /**
     * @param key NSString*
     */
    setTemporaryResourceValueForKey(value: WrapperObj<any>, key: string): void
    /**
     * @returns NSData*
     * @param keys NSArray*
     * @param relativeURL NSURL*
     * @param error NSError**
     */
    bookmarkDataWithOptionsIncludingResourceValuesForKeysRelativeToURLError(
      options: NSURLBookmarkCreationOptions,
      keys: Array<any>,
      relativeURL: NSURL,
      error: NSError
    ): NSData
    startAccessingSecurityScopedResource(): boolean
    stopAccessingSecurityScopedResource(): void
    /**
     * @returns NSURL*
     */
    URL(): NSURL
    /**
     * @returns NSURL*
     * @param baseURL NSURL*
     */
    URLRelativeToURL(baseURL: NSURL): NSURL
    /**
     * @returns NSString*
     * @param allowedCharacters NSCharacterSet*
     */
    stringByAddingPercentEncodingWithAllowedCharacters(
      allowedCharacters: NSCharacterSet
    ): string
    /**
     * @returns NSString*
     */
    stringByRemovingPercentEncoding(): string
    /**
     * @returns NSString*
     */
    stringByAddingPercentEscapesUsingEncoding(enc: NSStringEncoding): string
    /**
     * @returns NSString*
     */
    stringByReplacingPercentEscapesUsingEncoding(enc: NSStringEncoding): string
    /**
     * @returns NSArray*
     */
    pathComponents(): Array<any>
    /**
     * @returns NSString*
     */
    lastPathComponent(): string
    /**
     * @returns NSString*
     */
    pathExtension(): string
    /**
     * @returns NSURL*
     * @param pathComponent NSString*
     */
    URLByAppendingPathComponent(pathComponent: string): NSURL
    /**
     * @returns NSURL*
     * @param pathComponent NSString*
     */
    URLByAppendingPathComponentIsDirectory(
      pathComponent: string,
      isDirectory: boolean
    ): NSURL
    /**
     * @returns NSURL*
     */
    URLByDeletingLastPathComponent(): NSURL
    /**
     * @returns NSURL*
     * @param pathExtension NSString*
     */
    URLByAppendingPathExtension(pathExtension: string): NSURL
    /**
     * @returns NSURL*
     */
    URLByDeletingPathExtension(): NSURL
    /**
     * @returns NSURL*
     */
    URLByStandardizingPath(): NSURL
    /**
     * @returns NSURL*
     */
    URLByResolvingSymlinksInPath(): NSURL
    readonly previewItemURL?: NSURL
    readonly previewItemTitle?: string
  }
}

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
