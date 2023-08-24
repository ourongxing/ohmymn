# 文件操作
[Code](https://github.com/ourongxing/ohmymn/blob/main/packages/api/src/high-level/file.ts)

一些文件操作
## Path
一些常用的可读写的文件夹位置
- `MN.app.cachePath`: 缓存文件夹。
- `MN.app.tempPath`: 临时文件夹，在退出后随时有可能被删除。
- `Addon.path`: 当前插件所在的文件夹。

要想临时写入文件，比如需要 AirDrop 分享，可以使用 `MN.app.tempPath`。

::: warning 注意
目前删除文件有问题，无法执行。
:::
## isfileExists
文件是否存在。
```ts
declare function isfileExists(path: string): boolean;
```
## copyFile
复制文件，返回复制是否成功。
```ts
declare function copyFile(src: string, dest: string): boolean;
```
## writeTextFile
写入文字到文件，如果文件不存在则创建，如果文件存在则覆盖。
```ts
declare function writeTextFile(path: string, text: string): void;
```

## readJSON
读取 JSON 文件。
```ts
declare function readJSON(path: string): any;
```
## writeJSON
写入 JSON 到文件。
```ts
declare function writeJSON(path: string, data: any): void;
```

## saveFile
交互式保存文件，需要用户选择保存位置。iOS 上使用分享面板。

::: tip
UTI 就是 [Uniform Type Identifier](https://developer.apple.com/library/archive/documentation/Miscellaneous/Reference/UTIRef/Articles/System-DeclaredUniformTypeIdentifiers.html#//apple_ref/doc/uid/TP40009259-SW1)，比如 `public.plain-text`，`public.png`，`public.jpeg`，`public.zip` 等等。用来标明文件类型。
:::

```ts
/**
 * @param file file path
 * @param UTI
 */
declare function saveFile(file: string, UTI: string): void
```
## saveTextFile
交互式保存文本文件，需要用户选择保存位置。iOS 上使用分享面板。只要是纯文本，都可以使用这个方法保存。指定文件后缀和 UTI 即可。
```ts
/**
 * Create a text file with given content, default .txt file
 * @param UTI @default public.plain-text
 */
declare function saveTextFile(
  content: string,
  fileName: string,
  UTI?: string
): void
```
## openFile

从文件管理器打开文件，可以多选。iOS 上不可用。
```ts
/**
 * @warning not working on iPad
 */
declare function openFile(...uti: string[]): Promise<string | undefined>
```