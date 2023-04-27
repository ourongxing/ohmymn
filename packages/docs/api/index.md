# 介绍

API 分为四个部分：

- OhMyMN
- MarginNote
  - High-Level API
  - Low-Level API
- Foundation
- UIKit

OhMyMN 的 API 用于 OhMyMN 插件的开发。

MarginNote 的 API 又分为 Low-Level API 和 High-Level API。

Low-Level API 实际上就是将 Objective-C 语法直接转换为 JS 语法，提供类型声明文件，使其可以在 TypeScript 中使用。High-Level API 是对 Low-Level API 的封装，使用起来更加方便。 High-Level API 其实也封装了部分 Foundation 和 UIKit 的 API。

::: tip
事实上，High-Level API 就是从 OhMyMN API 中抽取出来的通用部分，方便在其它插件中使用。所以目前提供的 High-Level API 并不完整，只覆盖掉了 OhMyMN 常用的部分。
:::

Foundation 和 UIKit 是 Apple 提供的两个框架，用于开发 iOS/MacOS 应用。MN 插件对其提供有限的支持。同样属于 Objective-C Low-Level API。目前只转换了部分 API 到 TypeScript。

所有的 API 原始代码都可以在 [marinnoteapp/ohmymn/packages/api](https://github.com/marginnoteapp/ohmymn/tree/main/packages/api) 找到。其中包括了 Objective-C 和 TypeScript 两种语言的代码。

推荐使用 Vscode 作为代码编辑器，可以查看检查类型，自动补全。请导入 `marginnote` 包，以获得更好的开发体验。
::: code-group
```shell [npm]
npm install marginnote
```
```shell [pnpm]
pnpm install marginnote
```
```shell [yarn]
pnpm add marginnote
```
:::