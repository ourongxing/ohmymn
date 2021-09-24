class Response {
  data: NSData
  constructor(data: NSData) {
    this.data = data
  }
  json(): any {
    const json = NSJSONSerialization.JSONObjectWithDataOptions(
      this.data,
      NSJSONReadingOptions.MutableContainers
    )
    if (json) return json
    // new Error 不能使用
    throw "不能序列化为 JSON"
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
  const request = NSMutableURLRequest.requestWithURL(NSURL.URLWithString(url))
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
      NSJSONSerialization.dataWithJSONObject(
        options.body,
        NSJSONWritingOptions.SortedKeys
      )
    )
  return request
}

const fetch = (
  url: string,
  options: RequestOptions = {}
): Promise<Response> => {
  return new Promise((resolve, reject) => {
    UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    // 这里只能使用 .new()
    const queue = NSOperationQueue.new()
    const request = initRequest(url, options)
    NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
      request,
      queue,
      (res: NSHTTPURLResponse, data: NSData, error: NSError) => {
        UIApplication.sharedApplication().networkActivityIndicatorVisible =
          false
        if (data) resolve(new Response(data))
        else reject(error)
      }
    )
  })
}

export default fetch
