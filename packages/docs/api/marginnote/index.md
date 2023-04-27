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
从 `self.addon` 中获取当前插件的信息。需要手动写入到    `self.addon` 中。默认值为 `mnaddon` 和 `MarginNote`。
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