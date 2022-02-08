import {
  addTags,
  getCommentIndex,
  getNotebookById,
  getNoteById,
  undoGroupingWithRefresh
} from "utils/note"
import { delayBreak } from "utils/common"
import { newColorStyle, newTag, newTitleText } from "./newExcerptGenerater"
import { MbBookNote } from "types/MarginNote"
import { HasTitleThen } from "modules/ohmymn"
import { unique } from "utils"

let note: MbBookNote
let nodeNote: MbBookNote
let isOCR: boolean
let isComment: boolean

export default async (_note: MbBookNote, lastExcerptText?: string) => {
  console.log("正在处理摘录", "excerpt")
  // 初始化全局变量
  note = _note
  isOCR = false
  nodeNote = note.groupNoteId ? getNoteById(note.groupNoteId) : note
  isComment = nodeNote != note
  if (
    self.profile.ohmymn.lockExcerpt &&
    lastExcerptText !== undefined &&
    lastExcerptText != "😎"
  ) {
    console.log("检测到开启锁定摘录选项，还原摘录", "excerpt")
    processExcerpt(lastExcerptText!)
    return
  }

  /*
   * 图片 -> OCR -> 自动矫正
   * 文字 -> 自动矫正
   * OCR 要等，再处理
   * 自动矫正也要等，再处理
   */

  decorateExecrpt()

  if (note.excerptPic) {
    const autoOCR =
      getNotebookById(note.notebookId!)?.options?.autoOCRMode ?? false
    console.log("摘录是图片", "excerpt")
    if (autoOCR) {
      const success = await delayBreak(20, 0.1, () =>
        note.excerptText ? true : false
      )
      if (success) {
        console.log("OCR 成功", "excerpt")
        isOCR = true
      } else {
        console.log("OCR 失败，没有文字", "excerpt")
        return
      }
    } else {
      console.log("没有开启自动 OCR 选项，不处理图片", "excerpt")
      return
    }
  }

  if (self.docProfile.ohmymn.autoCorrect) {
    console.log("开始矫正", "excerpt")
    const originText = note.excerptText!
    // 强制进行自动矫正
    note.excerptText = originText + "??????????"
    // 等待在线矫正返回结果
    const success = await delayBreak(
      20,
      0.1,
      () => note.excerptText != originText + "??????????"
    )
    if (success) console.log("矫正成功", "excerpt")
    else {
      console.log("矫正失败", "excerpt")
      note.excerptText = originText
    }
  }
  excerptHandler()
}

const excerptHandler = async () => {
  const excerptText = note.excerptText?.trim()
  if (!excerptText) return
  let { title, text } = await newTitleText(excerptText, nodeNote)
  const tags = newTag(excerptText)

  if (isComment && title && nodeNote.noteTitle) {
    console.log("当前摘录作为评论", "excerpt")
    switch (self.profile.ohmymn.hasTitleThen[0]) {
      case HasTitleThen.TitleLink:
        const nodeTitle = nodeNote.noteTitle
        title = unique(`${nodeTitle}; ${title}`.split(/[;；]\x20*/)).join("; ")
        break
      case HasTitleThen.NoChange:
        // 不变
        text = excerptText
        title = undefined
        break
    }
  }

  console.log(title ? `当前标题是：${title}` : "没有标题", "excerpt")
  console.log(text ? `当前摘录内容是：${text}` : "摘录转为了标题", "excerpt")
  processExcerpt(text, title, tags)
}

const processExcerpt = (text: string, title?: string, tags?: string[]) => {
  // 摘录和标题必然存在一个，因为一开始摘录是存在的，后来只有转为标题才可能出现摘录为空的情况
  undoGroupingWithRefresh(() => {
    if (text) note.excerptText = text
    // 如果摘录为空，有三种情况
    else {
      // 作为评论
      if (isComment) {
        const index = getCommentIndex(nodeNote, note)
        if (index != -1) nodeNote.removeCommentByIndex(index)
        // 如果节点摘录是 OCR 后变成标题了，这时候又来了一个标题，必须将节点摘录的内容设置为标题才能隐藏内容。
        if (isOCR && nodeNote.excerptText == nodeNote.noteTitle)
          nodeNote.excerptText = title
      }
      // OCR 不能清空，否则会显示图片，必须设置为标题一样才能不显示
      // 虽然说 isComment 与 isOCR 不冲突，但如果是评论，会直接删掉
      else if (isOCR) note.excerptText = title
      else note.excerptText = ""
    }

    // 设置标题必须放在后面，前面会用到以前的标题
    if (title) nodeNote.noteTitle = title
    if (tags?.length) addTags(nodeNote, tags)
  })
}

const decorateExecrpt = () => {
  const res = newColorStyle(note)
  if (!res) return
  const { color, style } = res
  if (color === undefined && style == undefined) return
  undoGroupingWithRefresh(() => {
    // 貌似默认的白色是 -1
    if (color !== undefined) note.colorIndex = color !== -1 ? color : 12
    if (style !== undefined) note.fillIndex = style
  })
}
