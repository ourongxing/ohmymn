import { Base64 } from "../utils"
import type {
  NSMutableURLRequest,
  NSData,
  NSHTTPURLResponse,
  NSError
} from "../low-level"
import { NSJSONWritingOptions, NSJSONReadingOptions } from "../low-level"
import { genNSURL } from "./common"
import { lang } from "./lang"

type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

class Response {
  data: NSData
  constructor(data: NSData) {
    this.data = data
  }
  json(): any {
    if (this.data.length() === 0) return {}
    const encoding = this.data.base64Encoding()
    const decoding = Base64.decode(encoding)
    try {
      return JSON.parse(decoding)
    } catch {
      throw lang.not_JSON
    }
  }
  /**
   * @deprecated not supported, always return empty string
   */
  text(): string {
    if (this.data.length() === 0) return ""
    const encoding = this.data.base64Encoding()
    const decoding = Base64.decode(encoding)
    return decoding
  }
}

/**
 * @param method @default GET
 */
type RequestOptions = {
  method?: "GET" | "POST" | "PATCH"
  timeout?: number
  headers?: Record<string, any>
} & XOR<
  XOR<
    XOR<
      { body?: string },
      XOR<
        { json?: Record<string, any> },
        { form?: Record<string, string | number | boolean> }
      >
    >,
    { search?: Record<string, string | number | boolean> }
  >,
  {
    multipartForm?: Record<
      string,
      | string
      | number
      | boolean
      | {
          filename: string
          filetype: string
          data: NSData
        }
    >
  }
>

function initRequest(
  url: string,
  options: RequestOptions
): NSMutableURLRequest {
  const request = NSMutableURLRequest.requestWithURL(genNSURL(url))
  request.setHTTPMethod(options.method ?? "GET")
  request.setTimeoutInterval(options.timeout ?? 10)
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers ?? {})
  }
  if (options.search) {
    request.setURL(
      genNSURL(
        `${url.trim()}?${Object.entries(options.search).reduce((acc, cur) => {
          const [key, value] = cur
          return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
        }, "")}`
      )
    )
  } else if (options.body) {
    request.setHTTPBody(NSData.dataWithStringEncoding(options.body, 4))
  } else if (options.form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded"
    request.setHTTPBody(
      NSData.dataWithStringEncoding(
        Object.entries(options.form).reduce((acc, cur) => {
          const [key, value] = cur
          return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
        }, ""),
        4
      )
    )
  } else if (options.json) {
    request.setHTTPBody(
      NSJSONSerialization.dataWithJSONObjectOptions(
        options.json,
        NSJSONWritingOptions.SortedKeys
      )
    )
  } else if (options.multipartForm) {
    const boundary = "FormBoundaryOhMyMN"
    headers["Content-Type"] = "multipart/form-data; boundary=" + boundary
    const body = NSMutableData.new()
    Object.entries(options.multipartForm).forEach(([key, value]) => {
      if (typeof value === "object") {
        body.appendData(
          NSData.dataWithStringEncoding(
            `--${boundary}\r\nContent-Disposition: form-data; name="${key}"; filename="${value.filename}"\r\nContent-Type: ${value.filetype}\r\n\r\n`,
            4
          )
        )
        body.appendData(value.data)
      } else {
        body.appendData(
          NSData.dataWithStringEncoding(
            `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n`,
            4
          )
        )
        body.appendData(
          NSData.dataWithStringEncoding(`${value.toString()}\r\n`, 4)
        )
      }
    })
    body.appendData(NSData.dataWithStringEncoding(`\r\n--${boundary}--\r\n`, 4))
    request.setHTTPBody(body)
  }
  request.setAllHTTPHeaderFields(headers)
  return request
}

/**
 * Ported version of Node Fetch, but with reduced features.
 */
export function fetch(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  return new Promise((resolve, reject) => {
    // UIApplication.sharedApplication().networkActivityIndicatorVisible = true
    const queue = NSOperationQueue.mainQueue()
    const request = initRequest(url, options)
    NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
      request,
      queue,
      (res: NSHTTPURLResponse, data: NSData, err: NSError) => {
        // Can't get the res property
        resolve(new Response(data))
      }
    )
  })
}

export default fetch
