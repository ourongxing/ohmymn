# 笔记相关
[Code](https://github.com/ourongxing/ohmymn/blob/main/packages/api/src/high-level/note.ts)

与笔记相关的有两个比较重要的类，
- [MbBookNote](./mbbooknote.md): MarginNote 里的笔记都属于 MbBookNote。MbBookNote 一定是笔记，但不一定是一张卡片。
- [NodeNote](./nodenote.md): 对 MbBookNote 的扩展，NodeNote 一定是一张卡片。

除了这两个外，还有一些封装的工具，方便对笔记进行操作或读取。

## undoGroupingWithRefresh
```ts
declare function undoGroupingWithRefresh(f: () => void): void;
```

所有对笔记的操作都应该用这个函数包裹，包裹在里面的操作可以被撤销。同时会刷新界面，呈现修改后的效果。

::: warning 注意
这个函数里不能有异步操作，必须提到外面。
:::

举个例子
```ts
const { value } = await select([1,2,3])
undoGroupingWithRefresh(()=>{
  note.title = value
})
```

## isNoteExist

```ts
/**
 * @param note MbBookNote or noteid
 */
declare function isNoteExist(note: MbBookNote | string): boolean;
```

判断笔记是否存在。可以传入一个笔记或者笔记的 id。因为有可能这个笔记被删除了。

## isNoteLink
```ts
/**
 * @param url note link
 */
declare function isNoteLink(url: string): boolean;
```

判断一个 url 是否是笔记链接。笔记链接通常是 `marginnote3app://note/xxxx` 这样的。

## removeHighlight
```ts
declare function removeHighlight(text: string): string;
```

MarignNote 里的高亮实际上是 `**内容**`，获取到的摘录内容里会包含这些高亮。这个函数可以把 `*` 删掉。