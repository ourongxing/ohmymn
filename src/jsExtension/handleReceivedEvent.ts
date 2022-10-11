import { StudyMode } from "marginnote"
import { Addon } from "~/addon"
import handleExcerpt, {
  removeLastCommentCacheTitle
} from "~/jsExtension/excerptHandler"
import { layoutViewController } from "~/jsExtension/switchPanel"
import lang from "~/lang"
import {
  delayBreak,
  eventHandlerController,
  isThisWindow,
  MN,
  showHUD
} from "marginnote"
import { moduleKeys } from "~/mergeMethod"
import { handleURLScheme } from "~/modules/shortcut/utils"
import { saveProfile, updateProfileTemp } from "~/profile"
import { EventHandler } from "~/typings"
import handleMagicAction from "./magicActionHandler"

export const eventHandlers = eventHandlerController(
  [
    Addon.key + "InputOver",
    Addon.key + "ButtonClick",
    Addon.key + "SelectChange",
    Addon.key + "SwitchChange",
    "OCRForNote",
    "OCRImageEnd",
    "OCRImageBegin",
    "EndOCRForNote",
    "AddonBroadcast",
    "PopupMenuOnNote",
    "ProcessNewExcerpt",
    "ChangeExcerptRange",
    "PopupMenuOnSelection",
    "ClosePopupMenuOnNote",
    "ClosePopupMenuOnSelection"
  ],
  Addon.key
)

const onButtonClick: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  // For magicaction
  console.log("Click a button", "event")
  const { row, type } = sender.userInfo
  handleMagicAction(type, row)
}

const onSwitchChange: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  console.log("Switch the switch", "event")
  const { name, key, status } = sender.userInfo
  await saveProfile(name, key, status)
}

const onSelectChange: EventHandler = async sender => {
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
}

const onInputOver: EventHandler = async sender => {
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
}

const onOCRImageBegin: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  self.excerptStatus.OCROnline.status = "begin"
  console.log("OCR begin", "ocr")
}

const onOCRImageEnd: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  self.excerptStatus.OCROnline.status = "end"
  self.excerptStatus.OCROnline.times = 1
  console.log("OCR end", "ocr")
}

const onPopupMenuOnSelection: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  self.textSelectBar = {
    winRect: sender.userInfo.winRect,
    arrow: sender.userInfo.arrow
  }
  console.log("Popup menu on selection open", "event")
}

const onClosePopupMenuOnSelection: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  self.textSelectBar = undefined
  self.excerptStatus.OCROnline = {
    times: 0,
    status: "free"
  }
  console.log("Reset OCR status", "ocr")
  console.log("Popup menu on selection close", "event")
}

const onPopupMenuOnNote: EventHandler = async sender => {
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
}

const onClosePopupMenuOnNote: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  self.excerptStatus.OCROnline = {
    times: 0,
    status: "free"
  }
  console.log("Reset OCR status", "ocr")
  console.log("Popup menu on note close", "event")
}

const onChangeExcerptRange: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  if (MN.studyController().studyMode !== StudyMode.study) return
  console.log("Change excerpt range", "event")
  self.noteid = sender.userInfo.noteid
  const note = MN.db.getNoteById(self.noteid)!
  self.excerptStatus.isChangeExcerptRange = true
  handleExcerpt(note, self.excerptStatus.lastExcerptText)
}

const onProcessNewExcerpt: EventHandler = sender => {
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
}

const onAddonBroadcast: EventHandler = async sender => {
  // if (!isThisWindow(sender)) return
  if (
    !self.globalProfile.addon.quickSwitch.includes(
      moduleKeys.indexOf("shortcut")
    )
  )
    return
  console.log("Addon broadcast", "event")
  const { message } = sender.userInfo
  const params = message.replace(new RegExp(`^${Addon.key}\\?`), "")
  if (message !== params) {
    await handleURLScheme(params)
  }
}

export default {
  onInputOver,
  onOCRImageEnd,
  onButtonClick,
  onSelectChange,
  onSwitchChange,
  onOCRImageBegin,
  onAddonBroadcast,
  onPopupMenuOnNote,
  onProcessNewExcerpt,
  onChangeExcerptRange,
  onClosePopupMenuOnNote,
  onPopupMenuOnSelection,
  onClosePopupMenuOnSelection
}
