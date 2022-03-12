import lang from "lang"
import { NSJSONReadingOptions, NSJSONWritingOptions } from "typings/enum"

class Response {
  data: NSData
  constructor(data: NSData) {
    this.data = data
  }
  json(): any {
    const res = NSJSONSerialization.JSONObjectWithDataOptions(
      this.data,
      NSJSONReadingOptions.MutableContainers
    )
    if (NSJSONSerialization.isValidJSONObject(res)) return res
    throw lang.network.notJSON
  }
}

type RequestOptions = {
  method?: string
  timeout?: number
  headers?: {
    [k: string]: string
  }
  body?: {
    [k: string]: any
  }
}

const initRequest = (
  url: string,
  options: RequestOptions
): NSMutableURLRequest => {
  const request = NSMutableURLRequest.requestWithURL(
    NSURL.URLWithString(encodeURI(url))
  )
  request.setHTTPMethod(options.method ?? "GET")
  request.setTimeoutInterval(options.timeout ?? 3)
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
    "Content-Type": "application/json",
    Accept: "application/json"
  }
  request.setAllHTTPHeaderFields(
    options.headers ? Object.assign(headers, options.headers) : headers
  )
  if (options.body)
    request.setHTTPBody(
      NSJSONSerialization.dataWithJSONObjectOptions(
        options.body,
        NSJSONWritingOptions.SortedKeys
      )
    )
  return request
}

const fetch = (url: string, options: RequestOptions = {}): Promise<Response> =>
  new Promise((resolve, reject) => {
    // 转圈圈
    // UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    const queue = NSOperationQueue.mainQueue()
    const request = initRequest(url, options)
    NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
      request,
      queue,
      (res: NSHTTPURLResponse, data: NSData, err: NSError) => {
        // UIApplication.sharedApplication().networkActivityIndicatorVisible = false
        // 很奇怪，获取不到 res 的属性
        if (err.localizedDescription) reject(err.localizedDescription)
        if (data.length() == 0) reject(lang.network.null)
        resolve(new Response(data as NSData))
      }
    )
  })

export default fetch
