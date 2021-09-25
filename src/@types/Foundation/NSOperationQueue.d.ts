export {}
declare global {
  class NSOperationQueue {
    static new(): NSOperationQueue
    static mainQueue(): NSOperationQueue
  }
}
