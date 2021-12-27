export {}
declare global {
  class NSURLConnection {
    static sendAsynchronousRequestQueueCompletionHandler(
      request: NSURLRequest,
      queue: NSOperationQueue,
      completionHandler: JSValue
    ): void
    static connectionWithRequest(
      request: NSURLRequest,
      delegate: WrapperObj<any>
    ): NSURLConnection
  }
}
