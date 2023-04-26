import { DictObj } from ".."

declare global {
  const NSLocale: {
    autoupdatingCurrentLocale(): NSLocale
    currentLocale(): NSLocale
    systemLocale(): NSLocale
    /**
     * @param ident NSString*
     */
    localeWithLocaleIdentifier(ident: string): NSLocale
    /**
     * @returns NSArray*
     */
    availableLocaleIdentifiers(): string[]
    /**
     * @returns NSArray*
     */
    ISOLanguageCodes(): string[]
    /**
     * @returns NSArray*
     */
    ISOCountryCodes(): string[]
    /**
     * @returns NSArray*
     */
    ISOCurrencyCodes(): string[]
    /**
     * @returns NSArray*
     */
    commonISOCurrencyCodes(): string[]
    /**
     * @returns NSArray*
     */
    preferredLanguages(): string[]
    /**
     * @returns NSDictionary*
     * @param string NSString*
     */
    componentsFromLocaleIdentifier(string: string): DictObj
    /**
     * @returns NSString*
     * @param dict NSDictionary*
     */
    localeIdentifierFromComponents(dict: DictObj): string
    /**
     * @returns NSString*
     * @param string NSString*
     */
    canonicalLocaleIdentifierFromString(string: string): string
    /**
     * @returns NSString*
     * @param string NSString*
     */
    canonicalLanguageIdentifierFromString(string: string): string
    /**
     * @returns NSString*
     * @param lcid uint32_t
     */
    localeIdentifierFromWindowsLocaleCode(lcid: number): string
    /**
     * @returns uint32_t
     * @param localeIdentifier NSString*
     */
    windowsLocaleCodeFromLocaleIdentifier(localeIdentifier: string): number
    /**
     * @param isoLangCode NSString*
     */
    characterDirectionForLanguage(
      isoLangCode: string
    ): NSLocaleLanguageDirection
    /**
     * @param isoLangCode NSString*
     */
    lineDirectionForLanguage(isoLangCode: string): NSLocaleLanguageDirection
  }
}

export declare type NSLocale = {
  objectForKey(key: any): any
  /**
   * @returns NSString*
   */
  displayNameForKeyValue(key: any, value: any): string
  /**
   * @returns NSString*
   */
  localeIdentifier(): string
}

export const enum NSLocaleLanguageDirection {
  BottomToTop = 4,
  LeftToRight = 1,
  RightToLeft = 2,
  TopToBottom = 3,
  Unknown = 0
}
