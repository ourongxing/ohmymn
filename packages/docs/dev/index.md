# 基础

::: warning 提醒
需要 Mac，需要购买 Mac 版 MarginNote
:::

::: tip 准备工作
1. 安装 pnpm
```shell
curl -fsSL https://get.pnpm.io/install.sh | sh -
```
2. 安装 nodejs
```shell
pnpm env use --global 18
```
3. 安装 [vscode](https://code.visualstudio.com/download)
:::

首先要明白 MN 的插件底层 API 是基于 Objective-C 的，虽然看上去插件是用 JS 写，但其实只是通过 JSBridge 调用 Objective-C 的 API 来实现。

所以你要想开发插件，首先要了解 Objective-C。MN 的插件其实暴露了很多 API，只是比较底层。而且还有一个问题，就是 MN 使用的 JSBridge 框架比较老旧，很多新 API 不支持，Bug 也比较多，iOS 和 macOS 也会有不少兼容性的问题，所以要做好踩坑的准备。

也正是因为插件只是用了 JSBridge，你没法使用 NodeJS 的 API，也没法使用部分 Browser 的 API，比如 `fetch`。而 Browser 的 API 也是 Safari 实现，所以 Safari 不支持的 JS 特性插件也不支持。

目前来说，MN 插件开发门槛比较高，坑比较多，不过 OhMyMN 的出现让开发门槛降低了很多。比如 OhMyMN 使用 TypeScript 开发，在编译期就可以发现大部分的问题。OhMyMN 使用 ESBuild 打包，方便拆分模块，一个命令就可以快速打包一个插件，并且在开发期间还可以热更新。更为重要的是 OhMyMN 封装了大部分的 API，提供更加强大的功能，还不需要接触到底层的 Objective-C API。

插件开发的教程分为三个部分：
1. [MN 插件（Lite）开发](./lite.md)
2. [OhMyMN 模块开发](./module/)
3. [MN 插件（OhMyMN）开发](./ohmymn/)

[MN 插件（Lite）开发](./lite.md) 只适用于简单功能，所以我称之为 Lite 版，也就是在 OhMyMN 出现之前传统的用一个 `main.js` 就能搞定的功能，比如 `AutoTitle`，`SearchInEudic`。如果你的功能比较复杂，又和摘录，卡片有关，建议阅读 [OhMyMN 模块开发](./module/)。如果无关，建议阅读 [MN 插件（OhMyMN）开发](./ohmymn/)。

OhMyMN 模块就是 OhMyMN 内置的插件，独立于 MN 插件。[OhMyMN 模块开发](./module/) 非常简单，可以快速开发复杂的功能。

OhMyMN 不只是一个插件，而是一个开发框架，提供了一套完整的插件开发体系，只是由于 MN 插件底层种种问题导致很难像前端框架一样拆分功能，按需选择。目前 OhMyMN 作为框架来说还不够完善，但是已经可以用于开发复杂的功能了，我们提供了很多 [模版](./ohmymn/index.md) 供你选择。