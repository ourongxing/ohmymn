# 描述清单

也就是 `manifest.ts` 文件，用于设置插件的基本信息。最终会生成 [mnaddon.json](../structure.md#mnaddonjson) 文件。


```ts
interface Manifest {
  /**
   * Unique identifier of the addon. Not need "marginnote.extension.".
   */
  key: string
  author: string
  title: string
  version: string
  /**
   * Github repository url.
   */
  github?: string
  /**
   * The minimum version of MarginNote that the addon supports.
   */
  minMarginNoteVersion: string
  /**
   * Profile key, used to save addon settings.
   */
  profileKey?: {
    global: string
    doc: string
    notebook: string
  }
  certKey?: string
  /**
   * Panel color
   */
  color?: {
    border: string
    button: string
  }
  /** Chinese forum url */
  forumZH?: string
  forum?: string
  docZH?: string
  doc?: string
  /** Files to be copied to the addon folder */
  files?: string[]
}
```

## key
key 不同于 addonid，不需要 `marginnote.extension.`，
```ts
addonid = "marginnote.extension." + key
```
key 不能重复，否则会覆盖同名插件。key 还会作为 [MN.log](../../api/marginnote/index.md#log-error) 的筛选关键词。

## minMarginNoteVersion
插件支持的 MarginNote 最低版本，如果低于这个版本，插件将无法安装。

## profileKey
配置文件的 key，通过这个 key 来写入和读取配置。
- `global`: 全局配置。
- `doc`: 文档配置，当前文档有效。
- `notebook`: 笔记本配置，当前笔记本有效。

## certKey
插件签名。
::: warning 注意
签名和 `main.js` 文件是一一绑定的，而 OhMyMN 的打包是随机的，代码会发生变化。而签名只能在打包后申请，所以只能将申请签名的插件解压，然后填入签名，再打包。
:::

## color
面板颜色，目前只能设置边框和按钮颜色。只能填写 `#ffffff` 格式的颜色。

## files
需要复制到插件目录的文件，可以是文件夹或文件。文件夹会递归复制。文件夹和文件的路径都是相对于插件根目录的。
比如 `["assets/logo.png", "assets/icon/"]`。