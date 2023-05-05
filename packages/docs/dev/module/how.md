# 如何开发一个模块
目前 OhMyMN 还没有办法安装模块，只能通过修改源码来添加模块。
1. Fork ohmymn 仓库，然后将 fork 后的仓库 clone 到本地
```bash
git clone git@github.com:xxxxx/ohmymn.git
```
2. 使用 pnpm 安装依赖
```bash
pnpm install
```
3. 构建最新的 MarginNote API
```bash
pnpm run api build
```
4. ohmymn 是一个 monorepo 仓库，API，文档都在这一个仓库里，插件代码在 `packages/addon` 目录下，所有模块都在 `packages/addon/src/modules` 目录下。
```bash
pnpm run addon dev
```
启动插件开发模式，会自动将插件代码复制到 MarginNote 的插件目录下，就可以在 MarginNote 中看到插件了，如果之前没有安装，可能需要手动启用。之后修改代码，MarginNote 不会自动重新加载插件，需要重启 MarginNote。

5. pull request 到 ohmymn 仓库，等待审核。

## 填写默认配置
第一步是填写 [默认配置](../ohmymn/profile.md)，你需要想好模块的 key，key 是唯一的。以及控制面板的菜单选项。

## 创建一个新的模块
直接复制一个模块的文件夹最为简单，比如 `autoreplace`。`autoreplace` 是一个自动修改摘录的简单插件。这个插件由三个文件组成
```
├── index.ts
├── lang.ts
└── typings.ts
```
index.ts 是模块的入口文件，lang.ts 是模块的语言包，typings.ts 是模块的类型定义文件。

在模块中，只要填写了 key，就会将默认配置自动绑定到控制面板的菜单中，并且进行类型检查。
`index.ts` 中的代码如下
```ts
import { type NodeNote, undoGroupingWithRefresh } from "marginnote"
import { renderTemplateOfNodeProperties } from "~/JSExtension/fetchNodeProperties"
import { defineConfig } from "~/profile"
import { CellViewType } from "~/typings"
import { doc, escapeDoubleQuote, string2ReplaceParam } from "~/utils"
import lang from "./lang"
import { AutoReplacePreset, ReplaceCard } from "./typings"

function replaceText(node: NodeNote, text: string) {
  const { preset } = self.globalProfile.autoreplace
  for (const set of preset) {
    switch (set) {
      case AutoReplacePreset.Custom:
        const { customReplace: params } = self.tempProfile.replaceParam
        if (!params?.length) continue
        text = params.reduce(
          (acc, param) =>
            acc.replace(
              param.regexp,
              renderTemplateOfNodeProperties(node, param.newSubStr)
            ),
          text
        )
    }
  }
  return text
}

export default defineConfig({
  name: "AutoReplace",
  key: "autoreplace",
  intro: lang.intro,
  link: doc("autoreplace"),
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
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: lang.replace_selected.label,
      key: "replaceCard",
      option: lang.replace_selected.$option2,
      method: ({ content, nodes, option }) => {
        undoGroupingWithRefresh(() => {
          if (option == ReplaceCard.UseAutoReplace) {
            nodes.forEach(node => {
              node.notes.forEach(note => {
                const text = note.excerptText
                if (text) note.excerptText = replaceText(node, text)
              })
            })
          } else if (content) {
            content = /^\(.*\)$/.test(content)
              ? content
              : `(/^.*$/gs, "${escapeDoubleQuote(content)}")`
            const params = string2ReplaceParam(content)
            nodes.forEach(node => {
              node.notes.forEach(note => {
                const text = note.excerptText
                if (text) {
                  note.excerptText = params.reduce((acc, params) => {
                    return acc.replace(
                      params.regexp,
                      renderTemplateOfNodeProperties(node, params.newSubStr)
                    )
                  }, text)
                }
              })
            })
          }
        })
      }
    }
  ]
})

```
详细 API 请查看 [API 文档](../../api/ohmymn/module.md)。

通常如果插件比较复杂，会将里面的函数抽离出来，放到一个单独的 `utils.ts` 文件`。OhMyMN 自动执行的模块一般也会提供手动触发的动作，他们的代码是可以共用的。