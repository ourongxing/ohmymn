import { Addon, MN } from "const"
import handleExcerpt, {
  removeLastCommentCacheTitle
} from "jsExtension/excerptHandler"
import { layoutViewController } from "jsExtension/switchPanel"
import lang from "lang"
import { EventHandler } from "typings"
import {
  delayBreak,
  eventHandlerController,
  isThisWindow,
  showHUD
} from "utils/common"
import { getNoteById } from "utils/note"
import { Range, readProfile, saveProfile } from "utils/profile"
import { updateProfileTemp } from "utils/profile/updateDataSource"
import handleMagicAction from "./magicActionHandler"

const { input_clear, input_saved } = lang.handle_received_event

export const eventHandlers = eventHandlerController([
  Addon.key + "InputOver",
  Addon.key + "ButtonClick",
  Addon.key + "SelectChange",
  Addon.key + "SwitchChange",
  "OCRForNote",
  "OCRImageEnd",
  "OCRImageBegin",
  "EndOCRForNote",
  "PopupMenuOnNote",
  "ProcessNewExcerpt",
  "ChangeExcerptRange",
  "PopupMenuOnSelection",
  "ClosePopupMenuOnNote",
  "ClosePopupMenuOnSelection"
])

const onButtonClick: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  console.log("点击了按钮", "event")
  const { row, type } = sender.userInfo
  handleMagicAction(type, row)
}

const onSwitchChange: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("切换了开关", "event")
  const { name, key, status } = sender.userInfo
  if (self.profile?.[name]?.[key] !== undefined)
    self.profile[name][key] = status
  else self.docProfile[name][key] = status
  switch (key) {
    case "screenAlwaysOn":
      UIApplication.sharedApplication().idleTimerDisabled = status
      break
    case "preOCR":
      status &&
        showHUD("请确保 AutoOCR 已启用，并且输入了 Key，否则没有效果！", 2)
      break
  }
}

const onSelectChange: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  console.log("修改了选项", "event")
  const { name, key, selections } = sender.userInfo
  if (key == "profile") {
    const lastProfileNum = self.docProfile.addon.profile[0]
    self.docProfile.addon.profile = selections
    saveProfile(undefined, lastProfileNum)
    readProfile(Range.Global)
  } else {
    if (self.profile?.[name]?.[key] !== undefined)
      self.profile[name][key] = selections
    else self.docProfile[name][key] = selections
    switch (key) {
      case "panelPosition":
      case "panelHeight":
        layoutViewController()
        break
    }
  }
}

const onInputOver: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("输入了内容", "event")
  const { name, key, content } = sender.userInfo
  if (self.profile?.[name]?.[key] !== undefined)
    self.profile[name][key] = content
  else self.docProfile[name][key] = content
  updateProfileTemp(key, content)
  showHUD(content ? input_saved : input_clear)
}

// 除了摘录时 OCR，选中文本时手动 OCR 也会触发。
const onOCRImageBegin: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  self.OCROnline.status = "begin"
  console.log("开始 OCR", "ocr")
}

const onOCRImageEnd: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  self.OCROnline.status = "end"
  self.OCROnline.times = 1
  console.log("结束 OCR", "ocr")
}

const onPopupMenuOnSelection: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  self.textSelectBar = {
    winRect: sender.userInfo.winRect,
    arrow: sender.userInfo.arrow
  }
  console.log("选择菜单开启", "event")
}

const onClosePopupMenuOnSelection: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  self.textSelectBar = undefined
  self.OCROnline = {
    times: 0,
    status: "free"
  }
  console.log("重置 OCR 状态", "ocr")
  console.log("选择关闭开启", "event")
}

/**
 * 修改摘录一开始，会关闭菜单。中间有很大的跨度。修改完成后，会先打开菜单，才触发修改摘录
 * 问题就出在关闭菜单和打开菜单没有时间关系，修改摘录的从开始到结束时间跨度很大。
 * 打开菜单和修改摘录或创建摘录是连着的。但是关闭菜单就没法判断是不是在修改了，这跨度太大了，等修改
 * 摘录结束不是很合理。那只能下次摘录后才删除上次的标题链接留下的评论
 */

const tmp = {
  isProcessNewExcerpt: false,
  isChangeExcerptRange: false,
  lastExcerptText: "😎"
}

const onPopupMenuOnNote: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  tmp.isChangeExcerptRange = false
  tmp.isProcessNewExcerpt = false
  const success = await delayBreak(
    10,
    0.05,
    () => tmp.isChangeExcerptRange || tmp.isProcessNewExcerpt
  )
  if (success) return
  const note = sender.userInfo.note
  const { selViewLst } = MN.studyController().notebookController.mindmapView
  const { focusNote } =
    MN.studyController().readerController.currentDocumentController
  self.noteSelectBar = {
    status: true,
    type: selViewLst?.length ? (focusNote ? "both" : "card") : "doc"
  }
  console.log(`${self.noteSelectBar.type} 笔记菜单开启`, "event")
  // 保存修改摘录前的内容，这里有可能转为了标题，所以摘录为空
  tmp.lastExcerptText = note.excerptText!
}

const onClosePopupMenuOnNote: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  const note = sender.userInfo.note
  self.noteSelectBar = {
    status: false
  }
  self.OCROnline = {
    times: 0,
    status: "free"
  }
  console.log("重置 OCR 状态", "ocr")
  console.log("笔记菜单关闭", "event")
}

const onChangeExcerptRange: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("修改摘录", "event")
  self.noteid = sender.userInfo.noteid
  const note = getNoteById(self.noteid)
  tmp.isChangeExcerptRange = true
  handleExcerpt(note, tmp.lastExcerptText)
}

const onProcessNewExcerpt: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("创建摘录", "event")
  self.noteid = sender.userInfo.noteid
  const note = getNoteById(self.noteid)
  tmp.isProcessNewExcerpt = true
  // 摘录前初始化，使得创建摘录时可以自由修改
  if (self.profile.addon.lockExcerpt) tmp.lastExcerptText = "😎"
  removeLastCommentCacheTitle(true)
  handleExcerpt(note)
}

export default {
  onInputOver,
  onOCRImageBegin,
  onOCRImageEnd,
  onButtonClick,
  onSelectChange,
  onSwitchChange,
  onPopupMenuOnNote,
  onProcessNewExcerpt,
  onChangeExcerptRange,
  onClosePopupMenuOnNote,
  onPopupMenuOnSelection,
  onClosePopupMenuOnSelection
}
