import {
  defineEventHandlers,
  loopBreak,
  eventObserverController,
  showHUD,
  StudyMode
} from "marginnote"
import { Addon } from "~/addon"
import handleExcerpt, { removeLastComment } from "~/JSExtension/handleExcerpt"
import { layoutViewController } from "~/JSExtension/switchPanel"
import { isModuleON } from "~/coreModule"
import { handleURLScheme } from "~/modules/shortcut/utils"
import { saveProfile, updateProfileTemp } from "~/profile"
import handleMagicAction from "./handleMagicAction"
import lang from "./lang"

const panelEvents = [
  { event: Addon.key + "InputOver", handler: "onInputOver" },
  { event: Addon.key + "ButtonClick", handler: "onButtonClick" },
  { event: Addon.key + "SelectChange", handler: "onSelectChange" },
  { event: Addon.key + "SwitchChange", handler: "onSwitchChange" }
] as const

const events = [
  "OCRImageEnd",
  "OCRImageBegin",
  "AddonBroadcast",
  "PopupMenuOnNote",
  "ProcessNewExcerpt",
  "ChangeExcerptRange",
  "PopupMenuOnSelection",
  "ClosePopupMenuOnNote",
  "ClosePopupMenuOnSelection"
] as const

export const eventObservers = eventObserverController([
  ...panelEvents,
  ...events
])

export default defineEventHandlers<
  (typeof events)[number] | (typeof panelEvents)[number]["handler"]
>({
  async onButtonClick(sender) {
    if (self.window !== MN.currentWindow) return
    // For magicaction
    MN.log("Click a button", "event")
    const { row, type } = sender.userInfo
    await handleMagicAction(type, row)
  },
  async onSwitchChange(sender) {
    if (self.window !== MN.currentWindow) return
    MN.log("Switch the switch", "event")
    const { name, key, status } = sender.userInfo
    await saveProfile(name, key, status)
  },
  async onSelectChange(sender) {
    if (self.window !== MN.currentWindow) return
    MN.log("Change the selection", "event")
    const { name, key, selections } = sender.userInfo
    switch (key) {
      case "panelPosition":
        layoutViewController(undefined, selections[0])
        break
      case "panelHeight":
        layoutViewController(selections[0])
        break
    }
    await saveProfile(name, key, selections)
  },
  async onInputOver(sender) {
    if (self.window !== MN.currentWindow) return
    MN.log("Input", "event")
    const { name, key, content } = sender.userInfo
    updateProfileTemp(key, content)
    showHUD(content ? lang.input_saved : lang.input_clear)
    switch (key) {
      case "baiduApiKey":
      case "baiduSecretKey":
        self.globalProfile.additional.autoocr.lastGetToken = 0
    }
    await saveProfile(name, key, content)
  },
  onOCRImageBegin(sender) {
    if (self.window !== MN.currentWindow) return
    // 虽然手动矫正也会触发，其实既然手动了，那么有很大概率会开启自动在线矫正，所以差这么一点点也无所谓。
    self.docProfile.additional.needOCRWait = true
    self.excerptStatus.OCROnlineStatus = "begin"
    MN.log("Online OCR begin", "ocr")
  },
  async onOCRImageEnd(sender) {
    if (self.window !== MN.currentWindow) return
    self.excerptStatus.OCROnlineStatus = "end"
    MN.log("Online OCR end", "ocr")
  },
  onPopupMenuOnSelection(sender) {
    if (self.window !== MN.currentWindow) return
    MN.log(sender.userInfo)
    self.textSelectBar = {
      winRect: sender.userInfo.winRect,
      arrow: sender.userInfo.arrow
    }
    MN.log("Popup menu on selection open", "event")
  },
  onClosePopupMenuOnSelection(sender) {
    if (self.window !== MN.currentWindow) return
    self.textSelectBar = undefined
    self.excerptStatus.OCROnlineStatus = "free"
    MN.log("Popup menu on selection close", "event")
  },
  async onPopupMenuOnNote(sender) {
    if (self.window !== MN.currentWindow) return
    self.excerptStatus.isChangeExcerptRange = false
    self.excerptStatus.isProcessNewExcerpt = false
    const success = await loopBreak(
      20,
      0.05,
      () =>
        self.excerptStatus.isChangeExcerptRange ||
        self.excerptStatus.isProcessNewExcerpt
    )
    if (success) return
    const note = sender.userInfo.note
    console.log(JSON.stringify(note.comments))
    self.excerptStatus.lastExcerptText = note.excerptText ?? ""
  },
  async onClosePopupMenuOnNote(sender) {
    if (self.window !== MN.currentWindow) return
    self.excerptStatus.OCROnlineStatus = "free"
    MN.log("Popup menu on note close", "event")
  },
  onChangeExcerptRange(sender) {
    if (self.window !== MN.currentWindow) return
    if (MN.studyController.studyMode !== StudyMode.study) return
    MN.log("Change excerpt range", "event")
    self.noteid = sender.userInfo.noteid
    const note = MN.db.getNoteById(self.noteid)!
    self.excerptStatus.isChangeExcerptRange = true
    self.excerptStatus.isModify = true
    handleExcerpt(note)
  },
  onProcessNewExcerpt(sender) {
    if (self.window !== MN.currentWindow) return
    if (MN.studyController.studyMode !== StudyMode.study) return
    MN.log("Process new excerpt", "event")
    self.noteid = sender.userInfo.noteid
    const note = MN.db.getNoteById(self.noteid)!
    self.excerptStatus.isProcessNewExcerpt = true
    self.excerptStatus.isModify = false
    // 创建摘录时重置
    if (self.globalProfile.addon.lockExcerpt)
      self.excerptStatus.lastExcerptText = undefined
    removeLastComment()
    handleExcerpt(note)
  },
  async onAddonBroadcast(sender) {
    // 需要点击卡片才能锁定到当前窗口
    if (self.window !== MN.currentWindow) return
    if (!isModuleON("shortcut")) return
    if (MN.studyController.studyMode === StudyMode.review) return
    MN.log("Addon broadcast", "event")
    const { message } = sender.userInfo
    const params = message.replace(new RegExp(`^${Addon.key}\\?`), "")
    if (message !== params) {
      await handleURLScheme(params)
    }
  }
})
