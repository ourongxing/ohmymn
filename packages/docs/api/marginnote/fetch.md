# 网络请求

[Code](https://github.com/ourongxing/ohmymn/blob/main/packages/api/src/high-level/network.ts)

```ts
import { fetch } from "marginnote"
```

在插件里是无法使用 JS 的 fetch 方法的。我利用 Objective-C 的 NSURLConnection 实现了一个 fetch 方法，用法和 JS 的 fetch 一样。但也有不少问题。

```ts
declare type RequestOptions = {
    method?: "GET" | "POST" | "PATCH";
    timeout?: number;
    headers?: Record<string, any>;
} & XOR<XOR<{
    body?: string;
}, XOR<{
    json?: Record<string, any>;
}, {
    form?: Record<string, string | number | boolean>;
}>>, {
    search?: Record<string, string | number | boolean>;
}>;
declare function fetch(url: string, options?: RequestOptions): Promise<Response>;
```

## 问题
1. 只能解析 JSON 的返回数据。
2. 无法获取到 status code。
## 示例
### GET
```ts
const res = await fetch("http://dict.e.opac.vip/dict.php?sw=" + word).then(
  res => res.json()
)
```
### POST JSON
```ts
const res = (await fetch(
  "http://api.interpreter.caiyunai.com/v1/translator",
  {
    method: "POST",
    headers: {
      "X-Authorization": `token ${caiyunToken}`
    },
    json: {
      source: [text],
      trans_type: `${fromLangKey[fromLang]}2${toLangKey[toLang]}`,
      request_id: "ohmymn",
      detect: true
    }
  }
).then(res => res.json())) as {
  target: string[]
}
```
### POST form
```ts
const res = (await fetch(
  `https://aip.baidubce.com/rest/2.0/ocr/v1/handwriting?access_token=${token}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: {
      image: imgBase64
    }
  }
).then(res => res.json())) as {
  words_result: { words: string }[]
} & BaiduOCRError
```