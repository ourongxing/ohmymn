# 简介

首先要明白 MN 的插件底层 API 是基于 Objective-C 的，虽然看上去插件是用 JS 写，但其实只是通过 JSBridge 调用 Objective-C 的 API 来实现。

API 分为四个部分：

- OhMyMN
- MarginNote
  - High-Level API
  - Low-Level API
- Foundation
- UIKit

OhMyMN 的 API 用于 OhMyMN 插件的开发。

MarginNote 的 API 又分为 Low-Level API 和 High-Level API。

Low-Level API 实际上就是将 Objective-C 语法直接转换为 JS 语法，提供类型声明文件，使其可以在 TypeScript 中使用。High-Level API 是对 Low-Level API 的封装，使用起来更加方便。

::: tip
事实上，High-Level API 就是从 OhMyMN API 中抽取出来的通用部分，方便在其它插件中使用。所以目前提供的 High-Level API 并不完整，只覆盖掉了 OhMyMN 常用的部分。
:::

Foundation 和 UIKit 是 Apple 提供的两个框架，用于开发 iOS/MacOS 应用。MN 插件对其提供有限的支持。同样属于 Objective-C Low-Level API。目前只转换了部分 API 到 TypeScript。High-Level API 其实也封装了部分 Foundation 和 UIKit 的 API。

所有的 API 代码都可以在 [marinnoteapp/ohmymn/packages/api](https://github.com/ourongxing/ohmymn/tree/main/packages/api) 找到。其中包括了 Objective-C 和 TypeScript 两种语言的代码。

推荐使用 VSCode 作为代码编辑器，可以检查类型，自动补全。导入 `marginnote` 包，以获得更好的开发体验。这个包里还包括了部分 Foundation 和 UIKit API。
```shell
pnpm install marginnote
```