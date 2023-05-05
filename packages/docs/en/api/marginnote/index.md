---
outline: deep
---
# MN

```ts
import { MN } from "marginnote"
```

这可能会是你在开发 MarginNote 插件时最常用的一个变量。

有以下属性

### app
[Application](./application.md) 实例。
```ts
readonly app = Application.sharedInstance()
```
### db
[Database](./database.md) 实例。
```ts
readonly db = Database.sharedInstance()
```
### currentWindow
当前窗口。
```ts
get currentWindow() {
  return this.app.focusWindow
}
```
### studyController
当前窗口的 studyController。
```ts
get studyController() {
  return this.app.studyController(this.app.focusWindow)
}
```
### notebookController
当前窗口的 notebookController
```ts
get notebookController() {
  return this.studyController.notebookController
}
```
### currentDocumentController
当前窗口的 currentDocumentController
```ts
get currentDocumentController() {
  return this.studyController.readerController.currentDocumentController
}
```

### currentDocmd5
当前文档的 md5。如果笔记本中没有文档，也会随机产生一个 32 位的 md5，我在这里让这个值固定，8 个 0，避免生成无效配置。
```ts
get currentDocmd5() {
  try {
    const { docMd5 } = this.currentDocumentController
    if (docMd5 && docMd5.length === 32) return "00000000"
    else return docMd5
  } catch {
    return undefined
  }
}
```
### currentAddon
从 `self.addon` 中获取当前插件的信息。需要手动写入到 `self.addon` 中。默认值为 `mnaddon` 和 `MarginNote`。通常是在 [sceneWillConnect](../../dev/lifecycle.md#scenewillconnect) 阶段写入。
```ts
get currentAddon(): {
  key: string
  title: string
} {
  return {
    key: self.addon?.key ?? "mnaddon",
    title: self.addon?.title ?? "MarginNote"
  }
}
```
### isZH
软件语言是否为中文
```ts
readonly isZH = NSLocale.preferredLanguages()?.[0].startsWith("zh")
```
### version
版本号
```ts
readonly version = this.app.appVersion ?? "3.7.21"
```

### isMNE, isMac, isMacMNE, isMacMN3
不同版本判断
```ts
readonly isMNE = gte(this.version, "4.0.0")
readonly isMac = this.app.osType === OSType.macOS
readonly isMacMNE = this.isMac && gte(this.version, "4.0.2")
readonly isMacMN3 = this.isMac && !this.isMacMNE
```
### currentThemeColor
当前主题色
```ts
get currentThemeColor(): UIColor {
  return this.themeColor[this.app.currentTheme]
}
```
### themeColor
```ts
readonly themeColor = {
  Gray: UIColor.colorWithHexString("#414141"),
  Default: UIColor.colorWithHexString("#FFFFFF"),
  Dark: UIColor.colorWithHexString("#000000"),
  Green: UIColor.colorWithHexString("#E9FBC7"),
  Sepia: UIColor.colorWithHexString("#F5EFDC")
}
```

## log, error
```ts
/**
 * You need watch log in console.app not in Browser
 * @param obj any object
 * @param suffix default is "normal"
 * @param args any params
 */
log(obj: any, suffix?: string, ...args: any[]): void;
/**
 * You need watch log in console.app not in Browser
 * @param obj any object
 * @param suffix default is "error"
 * @param args any params
 */
error(obj: any, suffix?: string, ...args: any[]): void;
```

用来调试，可以理解为 `console.log` 和 `console.error`。但是你需要在 `Console.app` 中查看，而不是在浏览器中。

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20230428175152.png?x-oss-process=base_webp)

通过插件 key 筛选即可。`suffix` 参数默认为 `normal` 和 `error`，也是为了方便筛选。OhMyMN 里有大量的调试输出。

其实也有办法在浏览器里调试，可以查看 [这篇文章](https://bbs.marginnote.cn/t/topic/37255)。并且将 `self.useConsole` 设置为 `true`，这样就可以在浏览器中调试了。可以尝试，但不一定有效。