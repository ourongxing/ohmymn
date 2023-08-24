## MbBook
也就是文档对象
```ts
export declare class MbBook {
  /**
   * Last notebook which the document is in and opened
   */
  readonly currentTopicId?: string
  /**
   * Date of last visit
   */
  readonly lastVisit?: Date
  /**
   * docMd5 of the document
   */
  readonly docMd5?: string
  /**
   * pathFile of the document
   */
  readonly pathFile?: string
  /**
   * Title of the document
   */
  readonly docTitle?: string
  /**
   * Page count of the document
   */
  readonly pageCount: number
  /**
   * Content of text layer of the document, not including OCR Pro layer
   * Each row and each character is an element of the array
   */
  textContentsForPageNo(pageNo: number): TextContent[][]
}
```
```ts
interface TextContent {
  /**
   * @example
   * String.fromCharCode(Number(char))
   */
  readonly char: string
  readonly rect: NSValue
}
```
`textContentsForPageNo` 用于获取指定页的文字。仅限 PDF 有文字层才可以获取到，OCR Pro 得到的文字层无法获取。

该方法已经封装好了，
```ts
import { getPageContent } from "marginnote"
```

如果想要了解更复杂的使用这个方法，可以查看 OhMyMN AutoComplete 的获取上下文的[源码](https://github.com/ourongxing/ohmymn/blob/929f62c4ad5f62ae7f9451b39f110172074595dd/packages/addon/src/modules/autocomplete/utils.ts#L315)。

## MbTopic
也就是笔记本对象
```ts
export declare class mbtopic {
  /**
   * notebook title, can be modified
   */
  title?: string
  /**
   * nodebook id
   */
  readonly topicid?: string
  readonly lastvisit?: date
  /**
   * main document md5
   */
  readonly maindocmd5?: string
  readonly historydate?: date
  readonly syncmode?: number | boolean
  readonly categorylist?: string
  readonly hashtags?: string
  readonly doclist?: string
  readonly options?: dictobj
  /**
   * doucments in the notebook
   */
  readonly documents?: mbbook[]
  /**
   * notes in the notebook
   */
  readonly notes?: mbbooknote[]
  readonly flags: notebooktype
  hidelinksinmindmapnode: boolean
}
```