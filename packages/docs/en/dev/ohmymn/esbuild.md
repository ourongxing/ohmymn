# 打包插件

OhMyMN 使用 [esbuild](https://esbuild.github.io/) 打包插件，将所有代码打包成一个文件。它很快，但不会检查 TypeScript 类型。在 OhMyMN 中，类型的正确非常重要。所以我使用了 ESBuild 的上层封装，也就是 [estrella](https://github.com/rsms/estrella)，它可以快速检查 TypeScript 类型。

在 `build.ts` 里修改打包的配置。

## 开发

```ts
pnpm dev

```
在开发阶段，可以监听文件变化，自动重新编译，生成 `main.js` 文件，然后将其复制到 MarginNote 的插件目录。

每次修改都会检查 TypeScript 类型，如果有错误，会提示错误信息。

::: warning 注意
MarginNote 无法自动读取新的插件代码，需要手动重启 MarginNote。可以使用 [mnaddon](../lite.md#cli) 工具快速重启 MarginNote，以及跳过弹窗。
:::

## 构建
```ts
pnpm build
```
打包插件，在 dist 目录下生成 `.mnaddon` 文件，可以直接安装到 MarginNote 中。

为了更方便的在 iPad 上调试插件，可以使用
```ts
pnpm run build:iPad
```
会在打包后自动通过 AirDrop 将插件发送到 iPad 上。

::: tip
需要安装 [airdrop-cli](https://github.com/vldmrkl/airdrop-cli)，才能在命令行里使用 AirDrop。
```sh
brew install vldmrkl/formulae/airdrop-cli
```
:::
