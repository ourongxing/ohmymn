export {}
declare global {
  /** A NSTimeInterval value is always specified in seconds;
   * it yields sub-millisecond precision over a range of 10,000 years.
   *
   * On its own, a time interval does not specify a unique point in time,
   * or even a span between specific times. Combining a time interval with
   * one or more known reference points yields a NSDate or NSDateInterval value. */

  type JSValue = any
  type NSDictionary = any
  type NSRange = any
  type NSIndexPath = {
    section: number
    row: number
  }
  type NSMutableArray<T = any> = Array<T>
  type NSIndexSet = any
  type NSCharacterSet = any
  class NSNotification {
    /**
     * @param aName NSString*
     */
    static notificationWithNameObject(
      aName: string,
      anObject: WrapperObj<any>
    ): NSNotification
    /**
     * @param aName NSString*
     * @param aUserInfo NSDictionary*
     */
    static notificationWithNameObjectUserInfo(
      aName: string,
      anObject: WrapperObj<any>,
      aUserInfo: DictObj
    ): NSNotification
    readonly name?: string
    readonly object: WrapperObj<any>
    readonly userInfo?: DictObj
    /**
     * @param name NSString*
     * @param userInfo NSDictionary*
     */
    initWithNameObjectUserInfo(
      name: string,
      object: WrapperObj<any>,
      userInfo: DictObj
    ): NSNotification
  }

  class NSLocale {
    static autoupdatingCurrentLocale(): WrapperObj<NSLocale>
    static currentLocale(): WrapperObj<NSLocale>
    static systemLocale(): WrapperObj<NSLocale>
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
    objectForKey(key: WrapperObj<any>): WrapperObj<any>
    /**
     * @returns NSString*
     */
    displayNameForKeyValue(key: WrapperObj<any>, value: WrapperObj<any>): string
    /**
     * @returns NSString*
     */
    localeIdentifier(): string
  }

  enum NSLocaleLanguageDirection {
    BottomToTop = 4,
    LeftToRight = 1,
    RightToLeft = 2,
    TopToBottom = 3,
    Unknown = 0
  }

  class NSNotificationCenter {
    static defaultCenter(): NSNotificationCenter
    init(): NSNotificationCenter
    /**
     * @param aSelector the function name of {@link EventHandler} in {@link InstMember}
     * @param aName event name
     */
    addObserverSelectorName(
      observer: WrapperObj<any>,
      aSelector: string,
      aName: string
    ): void
    /**
     * @param notification NSNotification*
     */
    postNotification(notification: NSNotification): void
    /**
     * @param aName NSString*
     */
    postNotificationNameObject(aName: string, anObject: WrapperObj<any>): void
    /**
     * @param aName NSString*
     * @param aUserInfo NSDictionary*
     */
    postNotificationNameObjectUserInfo(
      aName: string,
      anObject: WrapperObj<any>,
      aUserInfo: DictObj
    ): void
    removeObserver(observer: WrapperObj<any>): void
    /**
     * @param aName NSString*
     */
    removeObserverName(observer: WrapperObj<any>, aName: string): void
  }

  class NSUserDefaults {
    /**
     * @returns NSUserDefaults*
     */
    static standardUserDefaults(): NSUserDefaults
    static resetStandardUserDefaults(): void
    /**
     * @param defaultName NSString*
     */
    objectForKey(defaultName: string): WrapperObj<any>
    /**
     * @param defaultName NSString*
     */
    setObjectForKey(value: WrapperObj<any>, defaultName: string): void
    /**
     * @param defaultName NSString*
     */
    removeObjectForKey(defaultName: string): void
    /**
     * @returns NSString*
     * @param defaultName NSString*
     */
    stringForKey(defaultName: string): string
    /**
     * @returns NSArray*
     * @param defaultName NSString*
     */
    arrayForKey(defaultName: string): Array<any>
    /**
     * @returns NSDictionary*
     * @param defaultName NSString*
     */
    dictionaryForKey(defaultName: string): DictObj
    /**
     * @returns NSData*
     * @param defaultName NSString*
     */
    dataForKey(defaultName: string): NSData
    /**
     * @returns NSArray*
     * @param defaultName NSString*
     */
    stringArrayForKey(defaultName: string): Array<any>
    /**
     * @returns NSInteger
     * @param defaultName NSString*
     */
    integerForKey(defaultName: string): number
    /**
     * @returns float
     * @param defaultName NSString*
     */
    floatForKey(defaultName: string): number
    /**
     * @returns double
     * @param defaultName NSString*
     */
    doubleForKey(defaultName: string): number
    /**
     * @param defaultName NSString*
     */
    boolForKey(defaultName: string): boolean
    /**
     * @returns NSURL*
     * @param defaultName NSString*
     */
    URLForKey(defaultName: string): NSURL
    /**
     * @param value NSInteger
     * @param defaultName NSString*
     */
    setIntegerForKey(value: number, defaultName: string): void
    /**
     * @param value float
     * @param defaultName NSString*
     */
    setFloatForKey(value: number, defaultName: string): void
    /**
     * @param value double
     * @param defaultName NSString*
     */
    setDoubleForKey(value: number, defaultName: string): void
    /**
     * @param defaultName NSString*
     */
    setBoolForKey(value: boolean, defaultName: string): void
    /**
     * @param url NSURL*
     * @param defaultName NSString*
     */
    setURLForKey(url: NSURL, defaultName: string): void
    /**
     * @param registrationDictionary NSDictionary*
     */
    registerDefaults(registrationDictionary: DictObj): void
    /**
     * @param suiteName NSString*
     */
    addSuiteNamed(suiteName: string): void
    /**
     * @param suiteName NSString*
     */
    removeSuiteNamed(suiteName: string): void
    /**
     * @returns NSDictionary*
     */
    dictionaryRepresentation(): DictObj
    /**
     * @returns NSArray*
     */
    volatileDomainNames(): Array<any>
    /**
     * @returns NSDictionary*
     * @param domainName NSString*
     */
    volatileDomainForName(domainName: string): DictObj
    /**
     * @param domain NSDictionary*
     * @param domainName NSString*
     */
    setVolatileDomainForName(domain: DictObj, domainName: string): void
    /**
     * @param domainName NSString*
     */
    removeVolatileDomainForName(domainName: string): void
    /**
     * @returns NSArray*
     */
    persistentDomainNames(): Array<any>
    /**
     * @returns NSDictionary*
     * @param domainName NSString*
     */
    persistentDomainForName(domainName: string): DictObj
    /**
     * @param domain NSDictionary*
     * @param domainName NSString*
     */
    setPersistentDomainForName(domain: DictObj, domainName: string): void
    /**
     * @param domainName NSString*
     */
    removePersistentDomainForName(domainName: string): void
    synchronize(): boolean
    /**
     * @param key NSString*
     */
    objectIsForcedForKey(key: string): boolean
    /**
     * @param key NSString*
     * @param domain NSString*
     */
    objectIsForcedForKeyInDomain(key: string, domain: string): boolean
  }
}
