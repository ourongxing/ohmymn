# 数据存储

```ts
function getLocalDataByKey(key: string) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}
function setLocalDataByKey(data: any, key: string) {
  NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)
}
```

持久化数据，也就是存到本地。但这并不是文件。可以直接存储 JSON 对象，不需要转换成字符串。但注意不要有 undefined，否则会报错。

可以直接导入使用
```ts
import { getLocalDataByKey, setLocalDataByKey } from "marginnote"
```