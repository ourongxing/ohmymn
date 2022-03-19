import {
  addTags,
  getCommentIndex,
  getNotebookById,
  getNoteById,
  undoGroupingWithRefresh
} from "utils/note"
import { delayBreak } from "utils/common"
import {
  customOCR,
  newColorStyle,
  newTag,
  newTitleText
} from "./newExcerptGenerater"
import { MbBookNote } from "typings"

let note: MbBookNote
let nodeNote: MbBookNote
let isOCR = false
let isComment = false
let lastRemovedComment:
  | {
      nodeNote: MbBookNote
      note: MbBookNote
      index: number
    }
  | undefined = undefined

export default async (_note: MbBookNote, lastExcerptText?: string) => {
  console.log("正在处理摘录", "excerpt")
  // 初始化全局变量
  note = _note
  nodeNote = note.groupNoteId ? getNoteById(note.groupNoteId) : note
  isComment = nodeNote !== note
  self.isModify = lastExcerptText !== undefined
  if (
    self.profile.addon.lockExcerpt &&
    self.isModify &&
    lastExcerptText !== "😎"
  ) {
    processExcerpt(lastExcerptText!)
    return console.log("检测到开启锁定摘录选项，还原摘录", "excerpt")
  }

  /**
   * OCR 的逻辑
   * 对于扫描版的 PDF，不管有没有文字层，就算啥都没打开，都会进行 OCR，以便在搜索时能搜索图片上的文字。
   * 另外，矩形摘录自动转文本本质上也是在线 OCR，然后就不会在线矫正了。需要判断是否经历了一次 begin -> end，不管怎么样，都只会进行一次在线 OCR。
   */
  if (note.excerptPic) {
    const autoOCR =
      getNotebookById(note.notebookId!)?.options?.autoOCRMode ?? false
    console.log("摘录是图片", "ocr")
    if (autoOCR) {
      const success = await delayBreak(30, 0.1, () =>
        note.excerptText ? true : false
      )
      if (success) {
        console.log("转文字成功", "ocr")
        // 如果本身就是纯文字的 PDF， 是不需要 OCR 的。但是其他情况就会调用在线 OCR 来转文字,
        // 这倒没啥影响，因为 OCR 完才会显示文字。
        console.log(self.OCROnline.times === 1 ? "是 OCR" : "不是 OCR", "ocr")
        isOCR = true
      } else return console.log("转文字失败，没有文字", "ocr")
    } else return console.log("没有开启自动转文字选项，不处理图片", "ocr")
  }

  // 在线矫正，也就是在线 OCR，执行完之后才会执行自定义的 OCR，最好是关闭在线矫正
  // 表示前面矩形摘录转文字没有使用在线 OCR
  if (self.OCROnline.times === 0) {
    self.isModify &&
      (await delayBreak(30, 0.01, () => self.OCROnline.status === "begin"))
    if (self.OCROnline.status === "begin") {
      console.log("开始在线矫正", "ocr")
      const success = await delayBreak(
        30,
        0.1,
        () => self.OCROnline.status === "end"
      )
      if (success) console.log("矫正成功", "ocr")
      else console.log("矫正失败", "ocr")
    }
  }
  // 重置状态
  self.OCROnline = {
    times: 0,
    status: "free"
  }

  // 自定义 OCR
  const OCRContent = await customOCR()
  console.log("OCR 执行完毕", "ocr")
  if (OCRContent) note.excerptText = OCRContent

  decorateExecrpt()
  const excerptText = note.excerptText?.trim()
  if (!excerptText) return
  const { title, text } = await newTitleText(
    excerptText,
    nodeNote.noteTitle?.split(/\s*[;；]\s*/),
    isComment
  )
  const tags = await newTag(excerptText)
  processExcerpt(text, title?.join("; "), tags)
}

const processExcerpt = (text: string, title?: string, tags?: string[]) => {
  // 摘录和标题必然存在一个，因为一开始摘录是存在的，后来只有转为标题才可能出现摘录为空的情况
  undoGroupingWithRefresh(() => {
    if (text) {
      note.excerptText = text
      // 如果修改后不再满足转为标题的条件，就不用删除了
      if (lastRemovedComment?.note === note) lastRemovedComment = undefined
    }
    // 如果摘录为空，有三种情况
    else {
      // 作为评论
      if (isComment) {
        // 暂时不删除，等摘录菜单消失就删除，这样可以有修改的机会
        const index = getCommentIndex(nodeNote, note)
        if (index != -1) lastRemovedComment = { nodeNote, index, note }

        // 如果节点摘录是 OCR 后变成标题了，这时候又来了一个标题，必须将节点摘录的内容设置为标题才能隐藏内容。
        if (isOCR && nodeNote.excerptText == nodeNote.noteTitle)
          nodeNote.excerptText = title
      }
      // OCR 不能清空，否则会显示图片，必须设置为标题一样才能不显示
      else if (isOCR) note.excerptText = title
      else note.excerptText = ""
    }

    // 设置标题必须放在后面，前面会用到以前的标题
    if (title) nodeNote.noteTitle = title
    if (tags?.length) addTags(nodeNote, tags)
  })
}

const decorateExecrpt = async () => {
  const res = await newColorStyle(note)
  if (!res) return
  const { color, style } = res
  if (color === undefined && style == undefined) return
  undoGroupingWithRefresh(() => {
    // 貌似默认的白色是 -1
    if (color !== undefined) note.colorIndex = color !== -1 ? color : 12
    if (style !== undefined) note.fillIndex = style
  })
}

export const removeLastCommentCacheTitle = (onlyLastComment = false) => {
  if (!lastRemovedComment) return
  const { nodeNote, index, note } = lastRemovedComment
  undoGroupingWithRefresh(() => {
    if (note?.excerptText) nodeNote.removeCommentByIndex(index)
  })
  lastRemovedComment = undefined
  if (onlyLastComment) return
  const { cacheExcerptTitle } = self.docProfile.additional
  self.docProfile.additional.lastExcerpt = Date.now()
  Object.keys(cacheExcerptTitle).forEach(k => {
    if (!getNoteById(k)) cacheExcerptTitle[k] = undefined
  })
}
