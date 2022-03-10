import {
  addTags,
  getCommentIndex,
  getNotebookById,
  getNoteById,
  undoGroupingWithRefresh
} from "utils/note"
import { delayBreak } from "utils/common"
import { newColorStyle, newTag, newTitleText } from "./newExcerptGenerater"
import { MbBookNote } from "typings"

let note: MbBookNote
let nodeNote: MbBookNote
let isOCR = false
let isComment = false
let isModify = false
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
  isModify = lastExcerptText !== undefined
  if (self.profile.ohmymn.lockExcerpt && isModify && lastExcerptText !== "😎") {
    processExcerpt(lastExcerptText!)
    return console.log("检测到开启锁定摘录选项，还原摘录", "excerpt")
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
      } else return console.log("OCR 失败，没有文字", "excerpt")
    } else return console.log("没有开启自动 OCR 选项，不处理图片", "excerpt")
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

  const excerptText = note.excerptText?.trim()
  if (!excerptText) return
  const { title, text } = await newTitleText(
    excerptText,
    note.noteId!,
    nodeNote.noteTitle?.split(/\s*[;；]\s*/),
    isModify,
    isComment
  )
  const tags = newTag(excerptText)
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
