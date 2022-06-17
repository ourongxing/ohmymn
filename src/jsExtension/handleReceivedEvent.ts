import { Addon, MN } from "~/const"
import handleExcerpt, {
  removeLastCommentCacheTitle
} from "~/jsExtension/excerptHandler"
import { layoutViewController } from "~/jsExtension/switchPanel"
import lang from "~/lang"
import { EventHandler } from "~/typings"
import {
  eventHandlerController,
  isThisWindow,
  showHUD,
  delayBreak
} from "~/utils/common"
import {
  saveProfile,
  writeProfile,
  readProfile,
  updateProfileTemp
} from "~/utils/profile"
import { Range } from "~/utils/profile/typings"
import handleMagicAction from "./magicActionHandler"

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
  // For magicaction
  console.log("Click a button", "event")
  const { row, type } = sender.userInfo
  handleMagicAction(type, row)
}

const onSwitchChange: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("Switch the switch", "event")
  const { name, key, status } = sender.userInfo
  saveProfile(name, key, status)
  switch (key) {
    case "screenAlwaysOn":
      UIApplication.sharedApplication().idleTimerDisabled = status
      break
  }
}

const onSelectChange: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  console.log("Change the selection", "event")
  const { name, key, selections } = sender.userInfo
  if (key == "profile") {
    const lastProfileNum = self.notebookProfile.addon.profile[0]
    self.notebookProfile.addon.profile = selections
    writeProfile({
      range: Range.Global,
      profileNO: lastProfileNum
    })
    readProfile({
      range: Range.Global,
      profileNO: selections[0]
    })
  } else {
    saveProfile(name, key, selections)
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
  console.log("Input", "event")
  const { name, key, content } = sender.userInfo
  saveProfile(name, key, content)
  updateProfileTemp(key, content)
  showHUD(content ? lang.input_saved : lang.input_clear)
}

const onOCRImageBegin: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  self.OCROnline.status = "begin"
  console.log("OCR begin", "ocr")
}

const onOCRImageEnd: EventHandler = async sender => {
  if (!isThisWindow(sender)) return
  self.OCROnline.status = "end"
  self.OCROnline.times = 1
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
  self.OCROnline = {
    times: 0,
    status: "free"
  }
  console.log("Reset OCR status", "ocr")
  console.log("Popup menu on selection close", "event")
}

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
  console.log(`Popup menu on ${self.noteSelectBar.type} note open`, "event")
  // Excerpt text may be empty
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
  console.log("Reset OCR status", "ocr")
  console.log("Popup menu on note close", "event")
}

const onChangeExcerptRange: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("Change excerpt range", "event")
  self.noteid = sender.userInfo.noteid
  const note = MN.db.getNoteById(self.noteid)!
  tmp.isChangeExcerptRange = true
  handleExcerpt(note, tmp.lastExcerptText)
}

const onProcessNewExcerpt: EventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("Process new excerpt", "event")
  self.noteid = sender.userInfo.noteid
  const note = MN.db.getNoteById(self.noteid)!
  tmp.isProcessNewExcerpt = true
  if (self.globalProfile.addon.lockExcerpt) tmp.lastExcerptText = "😎"
  removeLastCommentCacheTitle()
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
