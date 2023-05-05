# 其它

都是一些常用的方法，进行一些简单的封装。

##  setLocalDataByKey, getLocalDataByKey
```ts
export function getLocalDataByKey(key: string) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}
export function setLocalDataByKey(data: any, key: string) {
  NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)
}
```
持久化数据，也就是存到本地。但这并不是文件。可以直接存储 JSON 对象，不需要转换成字符串。但注意不要有 undefined，否则会报错。

## genNSURL, openURL
```ts
export function genNSURL(url: string, encode = false) {
  url = url.trim()
  if (!/^[\w\-]+:\/\//.test(url)) url = `https://${url}`
  return NSURL.URLWithString(encode ? encodeURI(url) : url)
}

export function openURL(url: string, encode = false) {
  MN.app.openURL(genNSURL(url, encode))
}
```
打开链接，需要构建 NSURL 对象。如果链接不是以协议开头，会自动加上 https://。如果链接中有中文，需要设置 encode=true。

## postNotification
```ts
export function postNotification(key: string, userInfo: any) {
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
    key,
    self,
    userInfo
  )
}
```

发送事件通知，key 为事件名，userInfo 传递的信息，可以是任意类型。

在其它插件或者类中，可以通过 [监听事件](./dev.md#eventobservercontroller) 来获取信息。在 OhMyMN，控制面板的触发动作就是通过这个方法获取到的。

## copy
```ts
export function copy(text: string, hud = true) {
  if (text) {
    UIPasteboard.generalPasteboard().string = text.trim()
    hud && showHUD(lang.copy_success)
  } else hud && showHUD(lang.copy_empty)
}
```

复制文字到剪贴板上，如果 hub 为 true，会显示一个复制提示。

## isNSNull, NSNull2Null
```ts
export function isNSNull(obj: any): obj is NSNull {
  return obj === NSNull.new()
}
export function NSNull2Null<T>(k: T) {
  return isNSNull(k) ? null : (k as Exclude<T, NSNull>)
}
```
NSNull 和 null 是不同的，在 [fetch](./fetch.md) 中，如果返回的数据中有 null，会被转换成 NSNull。这个方法可以将 NSNull 转换成 null。

## NSValue2String
```ts
export function NSValue2String(v: NSValue) {
  return Database.transArrayToJSCompatible([v])[0] as string
}
```

NSValue 是一种数据类型，可以存储任意类型的数据。但是在 JS 中，无法直接使用，需要转换成字符串。这个方法可以将 NSValue 转换成字符串。

## CGRectString2CGRect, CGSizeValue2CGSize
```ts
/**
 * @param str string like "{x,y}, {h,w}"
 */
export function CGRectString2CGRect(str: string): CGRect {
  const arr = str.match(/\d+\.?\d+/g)!.map(k => Number(k))
  return {
    x: arr[0],
    y: arr[1],
    height: arr[2],
    width: arr[3]
  }
}
export function CGRectValue2CGRect(v: NSValue) {
  return CGRectString2CGRect(NSValue2String(v))
}
```

将 CGRect 类型的 NSValue 转换成 JS 可读的 CGRect 对象。

## CGSizeString2CGSize,  CGSizeValue2CGSize
```ts
/**
 * @param str string like "{x,y}"
 */
export function CGSizeString2CGSize(str: string): CGSize {
  const arr = str.match(/\d+\.?\d+/g)!.map(k => Number(k))
  return {
    width: arr[0],
    height: arr[1]
  }
}
export function CGSizeValue2CGSize(v: NSValue) {
  return CGSizeString2CGSize(NSValue2String(v))
}
```
将 CGSize 类型的 NSValue 转换成 JS 可读的 CGSize 对象。