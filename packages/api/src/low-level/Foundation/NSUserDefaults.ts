import type { NSURL } from "./NSURL"
import type { NSData } from "./NSData"
import { DictObj } from ".."

declare global {
  const NSUserDefaults: {
    standardUserDefaults(): NSUserDefaults
    resetStandardUserDefaults(): void
  }
}

export declare type NSUserDefaults = {
  /**
   * @param defaultName NSString*
   */
  objectForKey(defaultName: string): any
  /**
   * @param defaultName NSString*
   */
  setObjectForKey(value: any, defaultName: string): void
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
  arrayForKey(defaultName: string): any[]
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
  stringArrayForKey(defaultName: string): any[]
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
  volatileDomainNames(): any[]
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
  persistentDomainNames(): any[]
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
