---
outline: deep
---

# 模块
使用 `defineConfig` 定义模块，提供类型检查和代码提示。

```ts
import { defineConfig } from "~/profile"

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
          // do something
        })
      }
    }
  ]
})
```

完整的类型定义如下：
```ts
export type IConfig<T extends AllModuleKeyUnion | null = null> = {
  name: string
  key: T extends AllModuleKeyUnion ? T : string
  intro: string
  link?: string
  settings: ISetting<
    T extends AllModuleKeyUnion ? IAllProfile[T] : Record<string, any>
  >[]
  actions4card?: IAction<IActionMethod4Card>[]
  actions4text?: IAction<IActionMethod4Text>[]
}

```
## name,key,intro,link
- `name` 模块名
- `key` 模块的唯一标识，不可重复，不需要与文件名相同。会根据 key 从 `profile/default.ts` 读取类型，提供类型检查，不同的选项类型有不同的属性。
- `intro` 模块介绍。
- `link` 模块文档的链接。
## settings
模块的设置项。

### type
设置菜单选项的类型有以下几种：
```ts
export const enum CellViewType {
  PlainText = 0,
  Switch = 1,
  Button = 2,
  ButtonWithInput = 3,
  Input = 4,
  InlineInput = 5,
  Select = 6,
  MuiltSelect = 7,
  Expland = 8
}
```
::: warning 注意
Button 和 ButtonWithInput 两种类型属于按钮，只能在 actions 中使用。
:::

对于不同的 type 有不同的属性

```ts

type HelpLink = XOR<{ help: string; link?: string }, {}>

type Bind<T> = {
  bind?: MaybeArray<
    MaybeArray<
      | [PickKeyByValue<T, number[]>, number | number[]]
      | [PickKeyByValue<T, boolean>, boolean]
      | ["quickSwitch", number | number[]]
    >
  >
}

type HelpLinkLabel = HelpLink & {
  label: string
}

export type ISettingInlineInput<T> = {
  key: PickKeyByValue<T, string>
  type: CellViewType.InlineInput
  check?: ICheckMethod
} & HelpLinkLabel &
  Bind<T>

export type ISettingInput<T> = {
  key: PickKeyByValue<T, string>
  type: CellViewType.Input
  help: string
  link?: string
  check?: ICheckMethod
} & Bind<T>

export type ISettingSwitch<T> = (
  | {
      key: Exclude<PickKeyByValue<T, boolean>, "on">
      type: CellViewType.Switch
    }
  | {
      key: "on"
      type: CellViewType.Switch
      auto: TypeUtilIndex<AutoUtilType>
    }
) &
  HelpLinkLabel &
  Bind<T>

export type ISettingExpland<T> = {
  key: PickKeyByValue<T, boolean>
  type: CellViewType.Expland
  label: [string, string]
} & Bind<T>

export type ISettingSelect<T> = {
  key: PickKeyByValue<T, number[]>
  type: CellViewType.Select | CellViewType.MuiltSelect
  option: string[]
} & HelpLinkLabel &
  Bind<T>

export type ISetting<T> =
  | ISettingInput<T>
  | ISettingSelect<T>
  | ISettingSwitch<T>
  | ISettingInlineInput<T>
  | ISettingExpland<T>
```


### help,link,label
```ts
type HelpLink = XOR<{ help: string; link?: string }, {}>
```
- `help` 帮助信息
- `link` 帮助信息的链接，可以点击跳转
- `label` 选项文字描述

对于 `CellViewType.Input` 没有 `label` 属性，通常使用 help 作为 label。

填写了 `help` 属性才能使用 `link` 属性。

### option
数组，选项的文字描述，只有 `CellViewType.Select` 和 `CellViewType.MuiltSelect` 有 `option` 属性。得到的值为数组下标，并且都返回数组。

### check
`check` 属性是一个函数，用于检查用户输入的值是否合法，如果不合法，会在设置菜单中显示错误信息。`check` 函数的类型定义如下：
```ts
export type ICheckMethod = ({ input }: { input: string }) => MaybePromise<void>
```
只有 `CellViewType.Input`，`CellViewType.InlineInput`，以及 `CellViewType.ButtonWithInput` 有 `check` 方法。

只需要在函数里抛出一个 error 即可。
### bind
```ts
type Bind<T> = {
  bind?: MaybeArray<
    MaybeArray<
      | [PickKeyByValue<T, number[]>, number | number[]]
      | [PickKeyByValue<T, boolean>, boolean]
      | ["quickSwitch", number | number[]]
    >
  >
}
```
当前选项的显示与否条件与其他选项绑定，当绑定选项的值为指定的值时，当前选项才会显示。

可以绑定 `Switch`，`Select`, `MuiltSwitch` 类型的选项。

举个例子
1. 当 `on` 为 `true` 时，当前选项才显示。
```ts
["on", true]
```
2. 当 `quickSwitch` 选择为 `0` 时，当前选项才显示。
```ts
["quickSwitch", 0]
```
3. 当 `quickSwitch` 选择为 `[0,1,2]` 中的一个时，当前选项才显示。
```ts
["quickSwitch", [0,1,2]]
```
4. 同时绑定多个选项，满足一个就会显示。
```ts
[
  ["quickSwitch", [0,1,2]],
  ["on", true]
]
```
5. 同时绑定多个选项，同时满足才会显示。
```ts
[
  [
    ["quickSwitch", [0,1,2]],
    ["on", true]
  ]
]
```

### auto <Badge type="warning" text="just ohmymn addon" />

 OhMyMN 作为一个可以自动处理摘录的插件，提供了一系列注入点，可以在这些注入点中处理摘录，生成标题、标签、评论等。他们的执行顺序可以参考下图

![](https://testmnbbs.oss-cn-zhangjiakou.aliyuncs.com/pic/20221105120148.png?x-oss-process=base_webp)

当且仅当 key 为 `on` 时，才可以使用 auto 属性，auto 属性的类型定义如下：
```ts
export type AutoUtilType = {
  customOCR: ({ imgBase64 }: { imgBase64: string }) => string
  modifyExcerptText: ({
    node,
    note,
    text
  }: {
    node: NodeNote
    note: MbBookNote
    text: string
  }) => string
  generateTitles: ({
    node,
    text,
    note
  }: {
    node: NodeNote
    note: MbBookNote
    text: string
  }) => {
    title: string[]
    text: string
    comments?: string[]
  }
  generateTags: ({
    note,
    node,
    text
  }: {
    note: MbBookNote
    node: NodeNote
    text: string
  }) => string[]
  generateComments: ({
    node,
    note,
    text
  }: {
    note: MbBookNote
    node: NodeNote
    text: string
  }) => string[]
  modifyTitles: ({ titles }: { titles: string[] }) => string[]
  modifyStyle: ({ note }: { note: MbBookNote }) => {
    color: number | undefined
    style: number | undefined
  }
}
```

可以通过 index 属性来控制某一个触发点里的所有函数的执行顺序，index 越大，越先执行。

```ts
auto: {
  modifyExcerptText: {
    index: 999,
    method({ node, text }) {
      return replaceText(node, text)
    }
  }
}
```
如果不需要指定执行顺序，可以简写，会安装模块注册的顺序执行。
```ts
auto: {
  modifyExcerptText({ node, text }) {
      return replaceText(node, text)
    }
}
```

`auto` 的函数里不需要直接修改笔记，只需要返回修改后的值即可。
## actions
动作，也就是可以手动触发的按钮。会集中显示在 `MagicAction` 中。在 OhMyMN 中分为两种类型，一种是针对摘录的 `actions4card`，一种是针对文本的 `actions4text`。<Badge type="warning" text="just ohmymn addon" />

但是我提供的模版不区分类型，只有 `actions`，并且不会自动传入参数。需要自行获取选中的卡片或者选中的文字。

action 只能使用 `CellViewType.Button` 和 `CellViewType.ButtonWithInput` 两种类型。
```ts
export type IAction<T extends IActionMethod4Card | IActionMethod4Text> = {
  key: string
  label: string
  type: CellViewType.Button | CellViewType.ButtonWithInput
  /** auto generate. value is module's key*/
  module?: string
  /** auto generate. value is module's name*/
  moduleName?: string
  option?: string[]
  help?: string
  method: T
  check?: ICheckMethod
}
```

### 卡片动作
```ts
export type IActionMethod4Card = ({
  content,
  nodes,
  option
}: {
  content: string
  nodes: NodeNote[]
  option: number
}) => any
```

- `content` 输入框的值
- `nodes` 选中的卡片
- `option` 是选择的选项

### 文字动作
```ts
export type IActionMethod4Text = ({
  text,
  imgBase64,
  option
}: {
  text: string
  imgBase64: string
  option: number
}) => any
```
- `text` 选中的文字
- `imgBase64` 选区图片的 base64
- `option` 是选择的选项