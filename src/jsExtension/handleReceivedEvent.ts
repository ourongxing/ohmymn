import { eventHandler, IRowButton } from "types/Addon"
import handleExcerpt from "jsExtension/excerptHandler"
import { layoutViewController } from "jsExtension/switchPanel"
import { delayBreak, isThisWindow, showHUD } from "utils/common"
import { eventHandlerController } from "utils/event"
import { getNoteById } from "utils/note"
import handleMagicAction from "./magicActionHandler"
import { Addon } from "const"
import { Range, readProfile, saveProfile } from "utils/profile"
import lang from "lang"
import { updateProfileTemp } from "utils/profile/updateDataSource"
const { input_clear, input_saved, lock_excerpt, auto_correct } =
  lang.handle_received_event

export const eventHandlers = eventHandlerController([
  Addon.key + "InputOver",
  Addon.key + "ButtonClick",
  Addon.key + "SelectChange",
  Addon.key + "SwitchChange",
  "PopupMenuOnNote",
  "ProcessNewExcerpt",
  "ChangeExcerptRange"
])

const onButtonClick: eventHandler = async sender => {
  if (!isThisWindow(sender)) return
  const { row } = sender.userInfo
  handleMagicAction(row)
}

const onSwitchChange: eventHandler = sender => {
  if (!isThisWindow(sender)) return
  const { name, key, status } = sender.userInfo
  if (key == "autoCorrect") {
    self.docProfile.ohmymn.autoCorrect = status
    if (status) showHUD(auto_correct)
  } else self.profile[name][key] = status
  switch (key) {
    case "lockExcerpt":
      if (status && self.docProfile.ohmymn.autoCorrect) showHUD(lock_excerpt, 2)
      break
    case "screenAlwaysOn":
      UIApplication.sharedApplication().idleTimerDisabled =
        self.profile.ohmymn.screenAlwaysOn
      break
    default:
      break
  }
}

const onSelectChange: eventHandler = async sender => {
  if (!isThisWindow(sender)) return
  const { name, key, selections } = sender.userInfo
  // 调试 Gesture
  // const [sec, row] = dataSourceIndex.magicaction[actionKey[selections[0]].key]
  // await handleMagicAction(
  //   <IRowButton>self.dataSource[sec].rows[row],
  //   actionKey[selections[0]].option
  // )
  if (key == "profile") {
    const lastProfileNum = self.docProfile.ohmymn.profile[0]
    self.docProfile.ohmymn.profile = selections
    saveProfile(undefined, lastProfileNum)
    readProfile(Range.Global)
  } else {
    self.profile[name][key] = selections
    switch (key) {
      case "panelPosition":
      case "panelHeight":
        layoutViewController()
        break
    }
  }
}

const onInputOver: eventHandler = sender => {
  if (!isThisWindow(sender)) return
  const { name, key, content } = sender.userInfo
  self.profile[name][key] = content
  updateProfileTemp(key, content)
  content ? showHUD(input_saved) : showHUD(input_clear)
}

// 不管是创建摘录还是修改摘录，都会提前触发这个事件，所以要判断一下，在修改之前保存上次摘录
let isProcessNewExcerpt = false
let isChangeExcerptRange = false
let lastExcerptText = "😎"
const onPopupMenuOnNote: eventHandler = async sender => {
  if (!isThisWindow(sender)) return
  const note = sender.userInfo.note
  isChangeExcerptRange = false
  isProcessNewExcerpt = false
  const success = await delayBreak(
    10,
    0.05,
    () => isChangeExcerptRange || isProcessNewExcerpt
  )
  if (success) return
  // 保存修改摘录前的内容
  // 这里有可能转为了标题，所以摘录为空
  lastExcerptText = note.excerptText!
}

const onChangeExcerptRange: eventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("修改摘录", "excerpt")
  const note = getNoteById(sender.userInfo.noteid)
  isChangeExcerptRange = true
  handleExcerpt(note, lastExcerptText)
}

const onProcessNewExcerpt: eventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("创建摘录", "excerpt")
  const note = getNoteById(sender.userInfo.noteid)
  isProcessNewExcerpt = true
  // 摘录前初始化，使得创建摘录时可以自由修改
  if (self.profile.ohmymn.lockExcerpt) lastExcerptText = "😎"
  handleExcerpt(note)
}

export default {
  onInputOver,
  onButtonClick,
  onSelectChange,
  onSwitchChange,
  onPopupMenuOnNote,
  onProcessNewExcerpt,
  onChangeExcerptRange
}
