import { docProfile, profile } from "profile"
import {
  getCommentIndex,
  getNotebookById,
  getNoteById,
  undoGroupingWithRefresh
} from "utils/note"
import { delayBreak, log, showHUD } from "utils/common"
import { genTitleText } from "./newExcerptGenerater"
import { MbBookNote } from "types/MarginNote"
import { HasTitleThen } from "addons/anotherautotitle"

let note: MbBookNote
let nodeNote: MbBookNote
let isOCR: boolean
let isComment: boolean
let isModifying: boolean
let lastExcerptText: string | undefined

export default async (_note: MbBookNote, _lastExcerptText?: string) => {
  log("正在处理摘录", "excerpt")
  // 初始化全局变量
  note = _note
  isOCR = false
  lastExcerptText = _lastExcerptText
  isComment = note.groupNoteId ? true : false
  // lastExcerptText 有可能为空字符串
  isModifying = lastExcerptText !== undefined
  if (isComment) nodeNote = getNoteById(note.groupNoteId!)
  if (profile.ohmymn.lockExcerpt && isModifying && lastExcerptText != "😎") {
    log("检测到开启锁定摘录选项，还原摘录", "excerpt")
    processExcerpt(undefined, lastExcerptText!)
    return
  }

  /*
   * 图片 -> OCR -> 自动矫正
   * 文字 -> 自动矫正
   * OCR 要等，再处理
   * 自动矫正也要等，再处理
   */

  if (note.excerptPic) {
    const autoOCR =
      getNotebookById(note.notebookId!)?.options?.autoOCRMode ?? false
    log("摘录是图片", "excerpt")
    if (autoOCR) {
      const success = await delayBreak(20, 0.1, () =>
        note.excerptText ? true : false
      )
      if (success) {
        log("OCR 成功", "excerpt")
        isOCR = true
      } else {
        log("OCR 失败，没有文字", "excerpt")
        return
      }
    } else {
      log("没有开启自动 OCR 选项，不处理图片", "excerpt")
      return
    }
  }

  if (docProfile.ohmymn.autoCorrect) {
    log("开始矫正", "excerpt")
    log(note.excerptText, "highlight")
    const originText = note.excerptText!
    // 强制进行自动矫正
    note.excerptText = originText + "??????????"
    // 等待在线矫正返回结果
    const success = await delayBreak(
      20,
      0.1,
      () => note.excerptText != originText + "??????????"
    )
    if (success) log("矫正成功", "excerpt")
    else {
      log("矫正失败", "excerpt")
      note.excerptText = originText
    }
  }
  excerptHandler()
}

const excerptHandler = async () => {
  if (!note.excerptText) return
  let { title, text } = await genTitleText(note.excerptText!.trim())

  // 摘录是作为评论，反正是卡片已经存在的情况下摘录，如果继续满足成为标题的条件
  if (isComment && title) {
    log("当前摘录作为评论", "excerpt")
    switch (profile.anotherautotitle.hasTitleThen[0]) {
      case HasTitleThen.TitleLink:
        const nodeTitle = nodeNote?.noteTitle
        if (nodeTitle) title = nodeTitle + "; " + title
        break
      case HasTitleThen.ExpertText:
        // 如果 titile 不存在，那本来就是摘录
        text = title
        title = undefined
        break
      case HasTitleThen.OverrideTitle:
    }
  }

  if (isModifying) {
    const isBroadened = (oldStr: string, newStr: string) =>
      oldStr &&
      oldStr.length >= 2 &&
      (newStr.startsWith(oldStr) || newStr.endsWith(oldStr))

    if (
      profile.anotherautotitle.changeTitleNoLimit &&
      !title &&
      isBroadened(note?.noteTitle ?? "", text)
    ) {
      log("正在拓宽作为标题的摘录，不受限制", "excerpt")
      title = text
      text = ""
    }
  }

  log(title ? `当前标题是：${title}` : "没有标题", "excerpt")
  log(text ? `当前摘录内容是：${text}` : "摘录转为了标题", "excerpt")
  processExcerpt(title, text)
}

const processExcerpt = (title: string | undefined, text: string) => {
  undoGroupingWithRefresh(() => {
    if (text) note.excerptText = text
    // 如果摘录为空，有三种情况
    else {
      if (isComment) {
        const index = getCommentIndex(nodeNote, note)
        if (index != -1) nodeNote.removeCommentByIndex(index)
        // 如果节点摘录是 OCR 后变成标题了，这时候又来了一个标题，必须将节点摘录的内容设置为标题才能隐藏内容。
        if (nodeNote.excerptText == nodeNote.noteTitle)
          nodeNote.excerptText = title
      }
      // OCR 不能清空，否则会显示图片，必须设置为标题一样才能不显示
      // 虽然说 isComment 与 isOCR 不冲突，但如果是评论，会直接删掉
      else if (isOCR) note.excerptText = title
      else note.excerptText = ""
    }
    // 设置标题必须放在后面，前面会用到以前的标题
    if (title)
      isComment ? (nodeNote.noteTitle = title) : (note.noteTitle = title)
  })
}
