# 默认配置
在 `profile/default.ts` 文件中填写默认配置，分为
- `defaultGlobalProfile` 全局配置
- `defaultDocProfile` 文档配置，每个文档都有自己的配置。
- `defaultNotebookProfile` 笔记本配置，每个笔记本都有自己的配置。

除此之外，还有 `defaultTempProfile` ，但这属于 <Badge type="warning" text="just ohmymn addon" />，用于缓存正则表达式对象，value 填写 `[]` 即可。
```ts
export const defaultTempProfile = {
  replaceParam: {
    customTag: [],
    customComment: [],
    customList: [],
    customReplace: [],
    customExtractTitle: [],
    customSimplify: [],
    customFormat: []
  },
  regArray: {
    customTitleSplit: [],
    customBeTitle: [],
    customDefLink: []
  }
}

```
用过 OhMyMN 的应该知道，OhMyMN 里正则表达式的使用主要分为 [replace 函数](../../guide/custom.md#replace-函数) 和 [正则表达式（数组）](../../guide/custom.md#正则表达式)，分别对应了 `replaceParam` 和 `regArray`。

默认配置填写的格式如下
```ts
export const defaultGlobalProfile = {
  autoreplace: {
    on: false,
    preset: [],
    customReplace: ""
  },
  additional: {
    lastVision: Addon.version
  }
}
```
默认配置与控制面板的菜单互相绑定，并且指定菜单选项的类型。请自行查看[模块设置选项 API](../../api/ohmymn/module.md)。

上面的 example 中，`on` 是 `Switch` 开关，`preset` 是 `MuiltSelect` 多选，`customReplace` 是 `Input` 输入框。对于多项选择，可以为空数组 `[]`，单项选择需要填入默认选项，比如 `[1]`。

`additional` 不属于控制面板的选项，通常用于存储一下额外数据。

在模块中，只要填写了 key，就会将默认配置自动绑定到控制面板的菜单中，并且进行类型检查。
```ts
export default defineConfig({
  name: "AutoReplace",
  key: "autoreplace",
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        modifyExcerptText: {
          index: 999,
          method({ node, text }) {
            return replaceText(node, text)
          }
        }
      }
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: lang.preset.$option1,
      label: lang.preset.label
    },
    {
      key: "customReplace",
      type: CellViewType.Input,
      help: lang.custom_replace.help,
      bind: ["preset", 0],
      link: lang.custom_replace.link
    }
  ],
})
```

通过 `self.globalProfile.autoreplace.presets` 来读取全局配置。另外使用
- `self.docProfile` 读取当前文档的配置
- `self.notebookProfile` 读取当前笔记本的配置

对于 `defaultTempProfile`，需要使用 `self.tempProfile` 来读取。