import { NSLocaleLanguageDirection } from "~/enum"

declare global {
  class NSLocale {
    static autoupdatingCurrentLocale(): NSLocale
    static currentLocale(): NSLocale
    static systemLocale(): NSLocale
    /**
     * @param ident NSString*
     */
    static localeWithLocaleIdentifier(ident: string): NSLocale
    /**
     * @returns NSArray*
     */
    static availableLocaleIdentifiers(): Array<string>
    /**
     * @returns NSArray*
     */
    static ISOLanguageCodes(): Array<string>
    /**
     * @returns NSArray*
     */
    static ISOCountryCodes(): Array<string>
    /**
     * @returns NSArray*
     */
    static ISOCurrencyCodes(): Array<string>
    /**
     * @returns NSArray*
     */
    static commonISOCurrencyCodes(): Array<string>
    /**
     * @returns NSArray*
     */
    static preferredLanguages(): Array<string>
    /**
     * @returns NSDictionary*
     * @param string NSString*
     */
    static componentsFromLocaleIdentifier(string: string): DictObj
    /**
     * @returns NSString*
     * @param dict NSDictionary*
     */
    static localeIdentifierFromComponents(dict: DictObj): string
    /**
     * @returns NSString*
     * @param string NSString*
     */
    static canonicalLocaleIdentifierFromString(string: string): string
    /**
     * @returns NSString*
     * @param string NSString*
     */
    static canonicalLanguageIdentifierFromString(string: string): string
    /**
     * @returns NSString*
     * @param lcid uint32_t
     */
    static localeIdentifierFromWindowsLocaleCode(lcid: number): string
    /**
     * @returns uint32_t
     * @param localeIdentifier NSString*
     */
    static windowsLocaleCodeFromLocaleIdentifier(
      localeIdentifier: string
    ): number
    /**
     * @param isoLangCode NSString*
     */
    static characterDirectionForLanguage(
      isoLangCode: string
    ): NSLocaleLanguageDirection
    /**
     * @param isoLangCode NSString*
     */
    static lineDirectionForLanguage(
      isoLangCode: string
    ): NSLocaleLanguageDirection
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
}
