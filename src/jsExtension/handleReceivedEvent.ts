import { eventHandler } from "types/Addon"
import handleExcerpt, {
  removeLastCommentCacheTitle
} from "jsExtension/excerptHandler"
import { layoutViewController } from "jsExtension/switchPanel"
import { alert, delayBreak, isThisWindow, showHUD } from "utils/common"
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
  "ChangeExcerptRange",
  "ClosePopupMenuOnNote"
  // "PopupMenuOnSelection",
  // "ClosePopupMenuOnSelection"
])

const onButtonClick: eventHandler = async sender => {
  if (!isThisWindow(sender)) return
  console.log("点击了按钮", "event")
  const { row } = sender.userInfo
  handleMagicAction(row)
}

const onSwitchChange: eventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("切换了开关", "event")
  const { name, key, status } = sender.userInfo
  if (key == "autoCorrect") {
    self.docProfile.ohmymn.autoCorrect = status
    if (status && self.profile.ohmymn.lockExcerpt) alert(auto_correct)
  } else self.profile[name][key] = status
  switch (key) {
    case "lockExcerpt":
      if (status && self.docProfile.ohmymn.autoCorrect) alert(lock_excerpt)
      break
    case "screenAlwaysOn":
      UIApplication.sharedApplication().idleTimerDisabled =
        self.profile.ohmymn.screenAlwaysOn
      break
  }
}

const onSelectChange: eventHandler = async sender => {
  if (!isThisWindow(sender)) return
  console.log("修改了选项", "event")
  const { name, key, selections } = sender.userInfo
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
  console.log("输入了内容", "event")
  const { name, key, content } = sender.userInfo
  self.profile[name][key] = content
  updateProfileTemp(key, content)
  content ? showHUD(input_saved) : showHUD(input_clear)
}

const onPopupMenuOnSelection: eventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("选择菜单开启", "event")
  const { documentController, winRect } = sender.userInfo
  console.log(documentController.selectionText)
}
const onClosePopupMenuOnSelection: eventHandler = sender => {
  if (!isThisWindow(sender)) return
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

const onPopupMenuOnNote: eventHandler = async sender => {
  if (!isThisWindow(sender)) return
  self.barStatus = true
  tmp.isChangeExcerptRange = false
  tmp.isProcessNewExcerpt = false
  const success = await delayBreak(
    10,
    0.05,
    () => tmp.isChangeExcerptRange || tmp.isProcessNewExcerpt
  )
  if (success) return
  console.log("摘录菜单开启", "event")
  // 保存修改摘录前的内容，这里有可能转为了标题，所以摘录为空
  const note = sender.userInfo.note
  tmp.lastExcerptText = note.excerptText!
}

const onClosePopupMenuOnNote: eventHandler = async sender => {
  if (!isThisWindow(sender)) return
  self.barStatus = false
  console.log("摘录菜单关闭", "event")
}

const onChangeExcerptRange: eventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("修改摘录", "event")
  const note = getNoteById(sender.userInfo.noteid)
  tmp.isChangeExcerptRange = true
  handleExcerpt(note, tmp.lastExcerptText)
}

const onProcessNewExcerpt: eventHandler = sender => {
  if (!isThisWindow(sender)) return
  console.log("创建摘录", "event")
  const note = getNoteById(sender.userInfo.noteid)
  tmp.isProcessNewExcerpt = true
  // 摘录前初始化，使得创建摘录时可以自由修改
  if (self.profile.ohmymn.lockExcerpt) tmp.lastExcerptText = "😎"
  removeLastCommentCacheTitle(true)
  handleExcerpt(note)
}

export default {
  onInputOver,
  onButtonClick,
  onSelectChange,
  onSwitchChange,
  onPopupMenuOnNote,
  onProcessNewExcerpt,
  onChangeExcerptRange,
  onClosePopupMenuOnNote
  // onPopupMenuOnSelection,
  // onClosePopupMenuOnSelection
}
