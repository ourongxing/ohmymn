# OhMyMN 模块开发
OhMyMN 是一个可以自动处理摘录的工具箱，也可以手动处理卡片。里面所有的功能都是模块化的，可以轻松扩展。

目前已经多达 15 个可选模块。[点击查看更多细节](/guide/index.md)。

如果你也想开发处理摘录或者处理卡片相关的功能，直接开发 OhMyMN 的模块会十分轻松，也更加强大。

OhMyMN 有个不成文的约定，如果会摘录时自动执行，模块名一般以 `auto` 开头，并且需要提供 `on` 的选项，用来关闭摘录时自动执行。
## 模块注册
所有的模块都需要在注册 `modules/index.ts`，才能被 OhMyMN 加载。分为可选模块和必选模块。
```ts
export const optionalModules = { shortcut }
export const requiredModules = { addon, magicaction4card, magicaction4text }
```