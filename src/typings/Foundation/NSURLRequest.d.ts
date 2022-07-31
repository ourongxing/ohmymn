export {}
declare global {
  class NSURLRequest {
    static requestWithURL(url: NSURL): NSURLRequest
    URL: NSURL
    setURL(url: NSURL): void
  }
  class NSMutableURLRequest extends NSURLRequest {
    static requestWithURL(url: NSURL): NSMutableURLRequest
    HTTPMethod: string
    setURL(url: NSURL): void
    setValueForHTTPHeaderField(value: string, field: string): void
    setAllHTTPHeaderFields(headerFields: NSDictionary): void
    setHTTPBody(data: NSData): void
    setHTTPMethod(method: string): void
    /**
     * double
     * */
    setTimeoutInterval(seconds: number): void
  }
  class NSURLResponse {}
  class NSHTTPURLResponse extends NSURLResponse {
    statusCode: number
    allHeaderFields: NSDictionary
  }
  class NSError {
    domain: string
    code: number
    userInfo: NSDictionary
    localizedDescription: string
    localizedFailureReason: string
    localizedRecoverySuggestion: string
    localizedRecoveryOptions: NSDictionary
  }
}
