import { NSCharacterSet, NSError } from "."
import { NSStringEncoding } from "./NSData"
import type { NSData } from "./NSData"
import { DictObj } from ".."

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

export declare type NSURL = {
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
  getResourceValueForKeyError(value: any, key: string, error: NSError): boolean
  /**
   * @returns NSDictionary*
   * @param keys NSArray*
   * @param error NSError**
   */
  resourceValuesForKeysError(keys: any[], error: NSError): DictObj
  /**
   * @param key NSString*
   * @param error NSError**
   */
  setResourceValueForKeyError(value: any, key: string, error: NSError): boolean
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
  setTemporaryResourceValueForKey(value: any, key: string): void
  /**
   * @returns NSData*
   * @param keys NSArray*
   * @param relativeURL NSURL*
   * @param error NSError**
   */
  bookmarkDataWithOptionsIncludingResourceValuesForKeysRelativeToURLError(
    options: NSURLBookmarkCreationOptions,
    keys: any[],
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
  pathComponents(): any[]
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
   * @returns NSURL* */
  URLByStandardizingPath(): NSURL
  /**
   * @returns NSURL*
   */
  URLByResolvingSymlinksInPath(): NSURL
  readonly previewItemURL?: NSURL
  readonly previewItemTitle?: string
}

declare global {
  const NSURL: {
    /**
     * @param path NSString*
     */
    fileURLWithPathIsDirectory(path: string, isDir: boolean): any
    /**
     * @param path NSString*
     */
    fileURLWithPath(path: string): NSURL
    /**
     * @param path const char*
     * @param baseURL NSURL*
     */
    fileURLWithFileSystemRepresentationIsDirectoryRelativeToURL(
      path: string,
      isDir: boolean,
      baseURL: NSURL
    ): any
    /**
     * @param URLString NSString*
     */
    URLWithString(URLString: string): NSURL
    /**
     * @param URLString NSString*
     * @param baseURL NSURL*
     */
    URLWithStringRelativeToURL(URLString: string, baseURL: NSURL): any
    /**
     * @param bookmarkData NSData*
     * @param relativeURL NSURL*
     * @param isStale BOOL*
     * @param error NSError**
     */
    URLByResolvingBookmarkDataOptionsRelativeToURLBookmarkDataIsStaleError(
      bookmarkData: NSData,
      options: NSURLBookmarkResolutionOptions,
      relativeURL: NSURL,
      isStale: boolean,
      error: NSError
    ): any
    /**
     * @returns NSDictionary*
     * @param keys NSArray*
     * @param bookmarkData NSData*
     */
    resourceValuesForKeysFromBookmarkData(
      keys: any[],
      bookmarkData: NSData
    ): DictObj
    /**
     * @param bookmarkData NSData*
     * @param bookmarkFileURL NSURL*
     * @param error NSError**
     */
    writeBookmarkDataToURLOptionsError(
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
    bookmarkDataWithContentsOfURLError(
      bookmarkFileURL: NSURL,
      error: NSError
    ): NSData
    /**
     * @param url NSURL*
     */
    componentsWithURLResolvingAgainstBaseURL(url: NSURL, resolve: boolean): any
    /**
     * @param URLString NSString*
     */
    componentsWithString(URLString: string): any
    URLUserAllowedCharacterSet(): any
    URLPasswordAllowedCharacterSet(): any
    URLHostAllowedCharacterSet(): any
    URLPathAllowedCharacterSet(): any
    URLQueryAllowedCharacterSet(): any
    URLFragmentAllowedCharacterSet(): any
    /**
     * @returns NSURL*
     * @param components NSArray*
     */
    fileURLWithPathComponents(components: any[]): NSURL
  }
}
