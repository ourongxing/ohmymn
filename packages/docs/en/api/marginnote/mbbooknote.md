---
outline: deep
---
# MbBookNote

[完整定义](https://github.com/ourongxing/ohmymn/blob/main/packages/api/src/low-level/MarginNote/MbBookNote.ts)

MbBookNote 是 MarginNote 中的笔记对象。推荐使用 [NodeNote](nodenote.md) 的相关方法来操作卡片。

## 静态方法
```ts
const Note: {
    createWithTitleNotebookDocument(title: string, notebook: MbTopic, doc: MbBook): MbBookNote;
};
```
用来创建一个 MbBookNote 对象。注意，这并不是 MbBookNote 上的静态方法，MarginNote 将其暴露在 Note 对象上。

```ts
Note.createWithTitleNotebookDocument('title', current-topic, current-book)
```
目前还无法指定创建的笔记在脑图中的位置，也无法改变。

## writeable 属性
```ts
/**
 * Excerpt text of the note
 */
excerptText?: string
/**
 * Title of the note
 */
noteTitle?: string
/**
 * A int value, 0-15
 * Index of the color
 */
colorIndex: number
/**
 * A int value, 0-2
 * Index of the fill type
 */
fillIndex: number
/**
 *
 * not working
 */
mindmapPosition: CGPoint
```

- `excerptText`: 从 PDF 中摘录的内容。
- `noteTitle`: 卡片标题。
- `colorIndex`: 笔记颜色, 0-15，对着颜色面板数一数就知道了。
- `fillIndex`: 笔记在 PDF 中选区的填充类型, 0-2。

::: tip
是不是发现没有评论，是的，评论无法修改，只能删除后重新添加。
:::

## readonly 属性

```ts
/**
 * Note id
 */
readonly noteId: string
/**
 * MD5 of the document
 */
readonly docMd5?: string
/**
 * Notebook id
 */
readonly notebookId?: string
/**
 * Page number of the start position of the note
 */
readonly startPage?: number
/**
 * Page number of the end position of the note
 */
readonly endPage?: number
/**
 * Start position of the note, like x,y
 */
readonly startPos?: string
/**
 * End position of the note, like x,y
 */
readonly endPos?: string
/**
 * Excerpt picture of the note, just the area of you selected
 */
readonly excerptPic?: excerptPic
/**
 * Date of the note created
 */
readonly createDate: Date
/**
 * Date of the note modified
 */
readonly modifiedDate?: Date
/**
 * List of media hash value seprated by '-'
 * @example
 * "mediaHash1-mediaHash2-mediaHash3"
 * note.mediaList?.split("-").map(hash => MN.db.getMediaByHash(hash))
 */
readonly mediaList?: string
/**
 * Origin note id, will be valid after merging
 */
readonly originNoteId?: string
/**
 * Whether the note branch in mindmap is closed
 */
readonly mindmapBranchClose?: number
/**
 * All the note text
 * @recommand {@link NodeNote.allText}
 */
readonly notesText?: string
/**
 * It Will be valid after merging itself into another note. It's the note id of the note it merged into.
 */
readonly groupNoteId?: string
/**
 * Comments of the note, different from the excerptText
 */
readonly comments: NoteComment[]
/**
 * Parent-notes of the note
 */
readonly parentNote?: MbBookNote
/**
 * List of Linked-note ID, used to locate the linked note card
 */
readonly linkedNotes: {
  summary: boolean
  /**
   * nodeid of the linked note
   */
  noteid: string
  /**
   * text of the linked note
   */
  linktext: string
}[]
/**
 * Child-notes of the note
 */
readonly childNotes?: MbBookNote[]
/**
 * Array of summarized note-id
 */
readonly summaryLinks: string[]
/**
 * A int value
 */
readonly zLevel?: number
/**
 * Whether the card is hidden
 */
readonly hidden?: boolean
/**
 * A int value
 */
readonly toc?: number
readonly annotation?: boolean
/**
 * Whether the image has been OCR to text
 */
readonly textFirst: boolean
/**
 * Mindmap group mode of the node branch
 */
readonly groupMode?: GroupMode
/**
 * A int value
 * Whether the note has a flashcard
 */
readonly flashcard?: number
/**
 * A int value
 */
readonly summary: number
/**
 * A int value
 */
readonly flagged?: number
readonly textHighlight?: {
  highlight_text: string
  coords_hash: string
  maskList?: string[]
  textSelLst?: any[]
}
readonly options?: DictObj
```

- `noteID`: 笔记 ID
- `docMd5`: 笔记所在的 PDF 的 MD5
- `notebookId`: 笔记所在的脑图的 ID
- `groupNoteId`: 当笔记被合并到另一个笔记时，这个属性会被赋值为目标笔记的 ID。

### comments
评论列表，是一个数组，每个元素都是一个评论对象。
```ts
comments: NoteComment[]
```

```ts
export type NoteComment = TextComment | HtmlComment | LinkComment | PaintComment

/**
 * Basic Comment, just text you typed
 * @see {@link NoteComment}
 */
export interface TextComment {
  type: "TextNote"
  /**
   * Get the content of the comment
   */
  text: string
  /**
   * NoteID of the note, is only valid after merging the notes
   */
  noteid?: string
}

/**
 * Generate when html copied to note
 * @see {@link NoteComment}
 */
export interface HtmlComment {
  type: "HtmlNote"
  /**
   * Size of the render image
   */
  htmlSize: DictObj
  /**
   * RTF
   */
  rtf: DictObj
  /**
   * HTML code
   */
  html: string
  /**
   * Text
   */
  text: string
  /**
   * NoteID of the note
   */
  noteid?: string
}

/**
 * Picture comment
 * @see {@link NoteComment}
 */
export interface PaintComment extends MNPic {
  type: "PaintNote"
}

/**
 * It not means link to another note and it will be generated when merge notes.
 * The notes merged into is the LinkComment
 * @see {@link NoteComment}
 */
export type LinkComment = LinkCommentText | LinkCommentPic

/**
 * @see {@link LinkComment}
 */
export interface LinkCommentText {
  type: "LinkNote"
  /**
   * NoteID of the note
   */
  noteid: string
  /**
   * Text of the comment
   */
  q_htext: TextComment["text"]
}

/**
 * @see {@link LinkComment}
 */
export interface LinkCommentPic {
  type: "LinkNote"
  /**
   * NoteID of the note
   */
  noteid: string
  /**
   * Text of the comment : {@link TextComment.text}
   */
  q_htext?: TextComment["text"]
  /**
   * Image of the comment : {@link MNPic}
   */
  q_hpic: MNPic
}

```

需要注意的是里面的 `LinkComment` 类型。它的 type 是 `LinkNote`，但是这个 `LinkNote` 并不是指它是一个链接，而是它被合并到了当前笔记中，作为评论存在。

### excerptPic
摘录的选取区域的渲染图。
```ts
excerptPic?: ExcerptPic
```

```ts
/**
 * Base type of the picture in MarginNote
 */
interface MNPic {
  /**
   * A hash value. Use it to get the picture from {@link MN.db.getMediaByHash} and encode it to base64
   * @example
   * MN.db.getMediaByHash(pic.paint)?.base64Encoding()
   */
  paint: string
  /**
   * CGSize, use {@link CGSizeValue2CGSize} to convert it to {@link CGSize}
   */
  size: NSValue
}
/**
 * The area of the excerpt
 */
interface ExcerptPic extends MNPic {
  selLst: {
    [key: number]: {
      /**
       * Rotation of the picture
       */
      rotation: number
      /**
       * CGRect Value, the position of the picture in the note
       * use {@link CGRectValue2CGRect} to convert it to {@link CGRect}
       */
      rect: NSValue
      /**
       * CGRect Value, same as rect
       */
      imgRect: NSValue
      pageNo: number
    }
  }
}
```
如果想要获取到这个图片，可以使用

```ts
MN.db.getMediaByHash(note.excerptPic.paint)?.base64Encoding()
```

这样就得到了一个 base64 编码的图片了。

如果想知道图片的大小或者选区的大小，比如 OhMyMN 中 AutoStyle 可以根据选区的大小调整填充样式。可以使用

```ts
import { CGSizeValue2CGSize } from "marginnote"
const { width, height } = CGSizeValue2CGSize(note.excerptPic!.size)
```

### mediaList
笔记中所有的媒体文件的 hash 值，用 `-` 分割。

```ts
note.mediaList?.split("-").map(hash => MN.db.getMediaByHash(hash))
```

这样就可是得到所有的媒体文件的 NSData 对象了。

### linkedNotes
笔记中的链接。
```ts
/**
 * List of Linked-note ID, used to locate the linked note card
 */
readonly linkedNotes: {
  summary: boolean
  /**
   * nodeid of the linked note
   */
  noteid: string
  /**
   * text of the linked note
   */
  linktext: string
}[]
```
注意。要区别与前面 comments 中 LinkComment 的 type 值 `LinkNote`，这里的 `linkedNotes` 才是链接。

## 实例方法
```ts
paste(): void
/**
 * Clear format of the note
 */
clearFormat(): void
/**
 * @recommand {@link NodeNote.allText}
 */
allNoteText(): string
/**
 * Merge another note to this note
 */
merge(note: MbBookNote): void
/**
 * Append HTML comment to the note
 * @param html HTML text of the comment
 * @param text Pure text of the comment
 * @param size Size of the comment
 * @param tag Markdown editor plugin id. The HTML comment will be rendered by the plugin.
 * @example
 * note.appendHtmlComment(
 *    "```math\n" + res + "\n```",
 *    res,
 *    { width: 420, height: 100 },
 *    "MarkDownEditor"
 *  )
 */
appendHtmlComment(html: string, text: string, size: CGSize, tag: string): void
/**
 * Append one text comment to the note
 */
appendTextComment(text: string): void
/**
 * Append Note Link to the note
 *
 */
appendNoteLink(note: MbBookNote): void
/**
 * Remove comment by index
 */
removeCommentByIndex(index: number): void
/**
 * Number of handwritten strokes
 */
getStrokesCount(): number
```
### clearFormat
```ts
clearFormat(): void
```
清除笔记的格式，包括卡片的尺寸。通常从浏览器中复制的内容会带有一些格式，使用这个方法可以清除格式。
### merge
```ts
merge(note: MbBookNote): void
```
合并其它笔记到当前笔记。