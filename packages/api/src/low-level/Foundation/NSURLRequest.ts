import { NSDictionary } from "."
import type { NSData } from "./NSData"
import type { NSURL } from "./NSURL"
declare global {
  const NSURLRequest: {
    requestWithURL(url: NSURL): NSURLRequest
  }
  const NSMutableURLRequest: {
    requestWithURL(url: NSURL): NSMutableURLRequest
  }
}

export declare type NSURLRequest = {
  URL(): NSURL
  setURL(url: NSURL): void
}
export declare type NSMutableURLRequest = {
  HTTPMethod(): string
  setURL(url: NSURL): void
  setValueForHTTPHeaderField(value: string, field: string): void
  setAllHTTPHeaderFields(headerFields: NSDictionary): void
  setHTTPBody(data: NSData): void
  setHTTPMethod(method: string): void
  /**
   * double
   * */
  setTimeoutInterval(seconds: number): void
} & NSURLRequest
export declare type NSURLResponse = {}
export declare type NSHTTPURLResponse = {
  statusCode: number
  allHeaderFields: NSDictionary
}
export declare type NSError = {
  domain: string
  code: number
  userInfo: NSDictionary
  localizedDescription: string
  localizedFailureReason: string
  localizedRecoverySuggestion: string
  localizedRecoveryOptions: NSDictionary
}
