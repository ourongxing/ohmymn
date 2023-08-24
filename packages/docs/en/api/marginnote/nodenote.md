---
outline: deep
---
# NodeNote
[Code](https://github.com/ourongxing/ohmymn/blob/main/packages/api/src/high-level/node.ts)

NodeNote 是对 [MbBookNote](./mbbooknote.md) 的扩展，用于表示脑图中的一个节点，或者一张卡片。

一张卡片里实际上可能存在多个 MbBookNote，比如你合并里两张卡片。其中一个 MbBookNote 可以拥有控制这张卡片的能力，而另一个 MbBookNote 就只能作为评论存在。

不管你传入的是哪一个 MbBookNote，NodeNote 都可以控制这张卡片。

```ts
import { NodeNote } from "marginnote"

const node = new NodeNote(note)
```

## 静态方法
### getSelectedNodes
这是 NodeNote 的静态方法，用于获取脑图中选中的卡片。

```ts
const nodes = NodeNote.getSelectedNodes()
```

## getter
getter 不同于函数，不用加括号，直接调用就行。可以看作一个 readonly 的属性。
### descendantNodes
用来获取当前卡片的后代卡片，返回所有的后代卡片和后代卡片的树状结构。

所谓后代卡片，就是当前卡片的子卡片，子卡片的子卡片，子卡片的子卡片的子卡片，以此类推。

treeIndex 为二维数组，第一个数字表示第几层，第二个数字表示这一层的第几个。

```ts
const { descendant, treeIndex } = node.descendantNodes
```

OhMyMN 的 [分层编号](https://github.com/ourongxing/ohmymn/blob/fd99b43f16c7a9cb1b047d0c740e1d7aa45e3ce9/packages/addon/src/modules/magicaction4card/renameTitle.ts#L13) 就用到了这个 treeIndex。
### ancestorNodes
获取当前卡片的祖先卡片。祖先卡片就是父卡片，父卡片的父卡片，父卡片的父卡片的父卡片，以此类推。
### childNodes, parentNode
获取当前卡片的子卡片和父卡片。
### notes
获取当前卡片的所有 MbBookNote。
### isOCR
获取当前卡片是否被 OCR。一旦被 OCR，之后合并进入的卡片都会被 OCR。因为这个值是绑定到卡片上的。
### excerptsText, excerptsTextPic
```ts
get excerptsText(): string[]
get excerptsTextPic(): {
    ocr: string[]
    html: string[]
    md: string[]
}
```
获取从 PDF 中摘录的文字，如果是图片，会被 OCR，也可以将图片转为 base64，然后返回 html 和 md 格式的图片。如果不需要图片，可以直接用 `excerptsText`。

注意这个返回的都是数组，因为一个卡片可能有多个摘录。

### commentsText, commentsTextPic
```ts
get commentsText(): string[]
get commentsTextPic(): {
    html: string[]
    md: string[]
}
```

同理，获取卡片中的评论。但是评论里的图片无法被 OCR。
### allText, allTextPic, excerptsCommentsText
```ts
get excerptsCommentsText(): string[];
get allText(): string
get allTextPic(): {
    html: string
    ocr: string
    md: string
}
```
相当于 `excerptsText` 和 `commentsText` 加起来。他们的顺序就是卡片里的顺序。注意，`allText` 直接返回的字符串，而不是数组。他们之间用 `\n` 合并。如果需要返回数组，可以用 `excerptsCommentsText`。

## setter
有 setter 也会有 getter，所以上面的 getter 没有列举完。留到这里一起说。

setter 不同于函数，可以直接赋值。可以看作一个 writable 的属性。不过写入和读取的值不一样。

### title, titles
```ts
get titles(): string[]
set titles(titles: string[])
get title(): string
set title(title: string)
```
`title` 是直接返回卡片的标题，而 `titles` 会将标题按 `;` 分割成数组返回。设置标题会覆盖之前的标题，如果要追加标题，可以用 `appendTitles`。
```ts
note.title = "a;b;c"
note.titles // ["a", "b", "c"]
note.titles = ["e", "f", "g"]
note.title // "e;f;g"
```
### mainExcerptText
```ts
get mainExcerptText(): string;
set mainExcerptText(text: string);
```

设置卡片的摘录内容。这里的主摘录可以看作卡片的第一个摘录。
### tags
```ts
get tags(): string[];
set tags(tags: string[]);
```
设置标签，会覆盖之前的标签，不需要 `#`。如果要追加标签，可以用 `appendTags`。

```ts
note.tags = ["a", "b", "c"]
note.tags // #a #b #c
note.tags = ["d", "e", "f"]
note.tags // #d #e #f
```

## 实例方法
### appendTitles
```ts
appendTitles(...titles: string[]): this;
```
追加标题，会在原来的标题后面加上新的标题。这个方法可以传入任意数量个参数。

```ts
node.appendTitles("a")
node.appendTitles("b", "c")
```

::: tip
这个方法返回的是 `this`，也就是当前的卡片，所以可以链式调用。
:::

### appendTags
```ts
appendTags(...tags: string[]): this;
```
同上，追加标签。不需要 #，会自动加上。


### appendTextComments
```ts
appendTextComments(...comments: string[]): this;
```
同上，追加评论。


### tidyupTags
```ts
tidyupTags(): this;
```
整理标签，会去掉重复的标签，并且统一放置在最后。

### getCommentIndex
```ts
getCommentIndex(comment: MbBookNote | string): number;
```

获取评论在卡片中的位置，从 0 开始，如果没有找到，返回 -1。
这里可以传入评论的内容，也可以传入合并的笔记。合并的笔记也会作为评论，所以也可以用这个方法获取合并的笔记在卡片中的位置。

### removeCommentButLinkTag
```ts
/**
 * @param filter not deleted
 * @param f call a function after deleted, before set tag and link
 */
removeCommentButLinkTag(filter: (comment: NoteComment) => boolean, f?: (node: NodeNote) => Promise<void> | void): Promise<this>;
```

作用是移除除了 filter 筛选出的评论之外的所有评论。移除后执行 f 函数，然后重新添加标签和链接，使其出现在最后。

如何使用：
```ts
// 这个的作用是保留卡片中的 PaintNote 和 HtmlNote，其他的都删除。然后添加新的评论。
node.removeCommentButLinkTag(
    k =>
        k.type === "PaintNote" ||
        k.type === "HtmlNote",
    n => {
        n.appendTextComments(...comments)
    }
)
```