import {
  defineEventHandlers,
  delayBreak,
  eventHandlerController,
  isThisWindow,
  MN,
  showHUD,
  StudyMode
} from "marginnote"
import { Addon } from "~/addon"
import handleExcerpt, {
  removeLastCommentCacheTitle
} from "~/JSExtension/excerptHandler"
import { layoutViewController } from "~/JSExtension/switchPanel"
import lang from "./lang"
import { isModuleON } from "~/merged"
import { handleURLScheme } from "~/modules/shortcut/utils"
import { saveProfile, updateProfileTemp } from "~/profile"
import handleMagicAction from "./magicActionHandler"

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

export const eventHandlers = eventHandlerController([...panelEvents, ...events])

export default defineEventHandlers<
  typeof events[number] | typeof panelEvents[number]["handler"]
>({
  async onButtonClick(sender) {
    if (!isThisWindow(sender)) return
    // For magicaction
    console.log("Click a button", "event")
    const { row, type } = sender.userInfo
    await handleMagicAction(type, row)
  },
  async onSwitchChange(sender) {
    if (!isThisWindow(sender)) return
    console.log("Switch the switch", "event")
    const { name, key, status } = sender.userInfo
    await saveProfile(name, key, status)
  },
  async onSelectChange(sender) {
    if (!isThisWindow(sender)) return
    console.log("Change the selection", "event")
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
    if (!isThisWindow(sender)) return
    console.log("Input", "event")
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
    if (!isThisWindow(sender)) return
    self.excerptStatus.OCROnline.status = "begin"
    console.log("OCR begin", "ocr")
  },
  async onOCRImageEnd(sender) {
    if (!isThisWindow(sender)) return
    self.excerptStatus.OCROnline.status = "end"
    self.excerptStatus.OCROnline.times = 1
    console.log("OCR end", "ocr")
  },
  onPopupMenuOnSelection(sender) {
    if (!isThisWindow(sender)) return
    self.textSelectBar = {
      winRect: sender.userInfo.winRect,
      arrow: sender.userInfo.arrow
    }
    console.log("Popup menu on selection open", "event")
  },
  onClosePopupMenuOnSelection(sender) {
    if (!isThisWindow(sender)) return
    self.textSelectBar = undefined
    self.excerptStatus.OCROnline = {
      times: 0,
      status: "free"
    }
    console.log("Reset OCR status", "ocr")
    console.log("Popup menu on selection close", "event")
  },
  async onPopupMenuOnNote(sender) {
    if (!isThisWindow(sender)) return
    self.excerptStatus.isChangeExcerptRange = false
    self.excerptStatus.isProcessNewExcerpt = false
    const success = await delayBreak(
      20,
      0.05,
      () =>
        self.excerptStatus.isChangeExcerptRange ||
        self.excerptStatus.isProcessNewExcerpt
    )
    if (success) return
    const note = sender.userInfo.note
    // Excerpt text may be empty
    self.excerptStatus.lastExcerptText = note.excerptText!
  },
  async onClosePopupMenuOnNote(sender) {
    if (!isThisWindow(sender)) return
    self.excerptStatus.OCROnline = {
      times: 0,
      status: "free"
    }
    console.log("Reset OCR status", "ocr")
    console.log("Popup menu on note close", "event")
  },
  onChangeExcerptRange(sender) {
    if (!isThisWindow(sender)) return
    if (MN.studyController().studyMode !== StudyMode.study) return
    console.log("Change excerpt range", "event")
    self.noteid = sender.userInfo.noteid
    const note = MN.db.getNoteById(self.noteid)!
    self.excerptStatus.isChangeExcerptRange = true
    handleExcerpt(note, self.excerptStatus.lastExcerptText)
  },
  onProcessNewExcerpt(sender) {
    if (!isThisWindow(sender)) return
    if (MN.studyController().studyMode !== StudyMode.study) return
    console.log("Process new excerpt", "event")
    self.noteid = sender.userInfo.noteid
    const note = MN.db.getNoteById(self.noteid)!
    self.excerptStatus.isProcessNewExcerpt = true
    if (self.globalProfile.addon.lockExcerpt)
      self.excerptStatus.lastExcerptText = "😎"
    removeLastCommentCacheTitle()
    handleExcerpt(note)
  },
  async onAddonBroadcast(sender) {
    // if (!isThisWindow(sender)) return
    if (!isModuleON("shortcut")) return
    console.log("Addon broadcast", "event")
    const { message } = sender.userInfo
    const params = message.replace(new RegExp(`^${Addon.key}\\?`), "")
    if (message !== params) {
      await handleURLScheme(params)
    }
  }
})
