import { MbBookNote } from "types/MarginNote"
import { eventHandler } from "types/Addon"
import { UIAlertViewStyle } from "types/UIKit"
import handleExcerpt from "jsExtension/excerptHandler"
import { closePanel, layoutViewController } from "jsExtension/switchPanel"
import { docProfile, profile } from "profile"
import { actions } from "synthesizer"
import { delayBreak, HUDController, log, popup, showHUD } from "utils/common"
import { eventHandlerController } from "utils/event"
import {
  getNoteById,
  getSelectNodes,
  getSelectNodesAll,
  undoGroupingWithRefresh
} from "utils/note"
import { Addon, MN } from "const"
import { Range, readProfile, saveProfile } from "utils/profile"

export const eventHandlers = eventHandlerController([
  Addon.key + "InputOver",
  Addon.key + "ButtonClick",
  Addon.key + "SelectChange",
  Addon.key + "SwitchChange",
  "PopupMenuOnNote",
  "ProcessNewExcerpt",
  "ChangeExcerptRange"
])

let customSelectedNodes: MbBookNote[] = []
const onButtonClick: eventHandler = async sender => {
  let { key, option, content } = sender.userInfo
  if (key != "filterCards" && profile.ohmymn.clickHidden) closePanel()
  let nodes: MbBookNote[] = []
  if (customSelectedNodes.length) {
    nodes = customSelectedNodes
    customSelectedNodes = []
    HUDController.hidden()
  } else {
    nodes = getSelectNodes()
    if (!nodes.length) {
      showHUD("未选中任何脑图卡片")
      return
    }
    const isHavingChildren = nodes.every(
      node => nodes[0].parentNote == node.parentNote && node?.childNotes.length
    )
    if (isHavingChildren) {
      const { option } = await popup(
        "OhMyMN",
        nodes.length > 1
          ? "检测到您选中的同层级卡片均有子节点"
          : "检测到您选中的唯一卡片有子节点",
        UIAlertViewStyle.Default,
        ["仅处理选中的卡片", "仅处理所有子节点", "处理选中的卡片及其子节点"],
        (alert: UIAlertView, buttonIndex: number) => ({
          option: buttonIndex
        })
      )
      nodes = [nodes, getSelectNodesAll(true), getSelectNodesAll()][option!]
    }
  }
  switch (key) {
    case "filterCards":
      customSelectedNodes = actions[key]({
        content,
        nodes,
        option
      })
      break
    // 异步函数，不要包裹在 undoGrouping 里面
    case "completeSelected":
      actions[key]({
        content,
        nodes,
        option
      })
      break
    default:
      undoGroupingWithRefresh(() => {
        actions[key]({
          content,
          nodes,
          option
        })
      })
  }
}

const onSwitchChange: eventHandler = sender => {
  const { name, key, status } = sender.userInfo
  if (key == "autoCorrect") {
    docProfile.ohmymn.autoCorrect = status
    if (status) showHUD("请按!实际情况选择开关，不建议无脑打开自动矫正", 2)
  } else profile[name][key] = status
  switch (key) {
    case "lockExcerpt":
      if (status && docProfile.ohmymn.autoCorrect)
        showHUD("锁定摘录不建议和自动矫正同时开启", 2)
      break
    case "screenAlwaysOn":
      UIApplication.sharedApplication().idleTimerDisabled =
        profile.ohmymn.screenAlwaysOn
      break
    default:
      break
  }
}

const onSelectChange: eventHandler = sender => {
  const { name, key, selections } = sender.userInfo
  if (key == "profile") {
    const lastProfileNum = docProfile.ohmymn.profile[0]
    docProfile.ohmymn.profile = selections
    saveProfile(undefined, lastProfileNum)
    readProfile("", Range.global)
    layoutViewController()
  } else {
    profile[name][key] = selections
    switch (key) {
      case "panelPosition":
      case "panelHeight":
        layoutViewController()
        break
      case "quickSwitch":
        MN.settingViewController.tableView?.reloadData()
        break
    }
  }
}

const onInputOver: eventHandler = sender => {
  const { name, key, content } = sender.userInfo
  profile[name][key] = content
  content ? showHUD("输入已保存") : showHUD("输入已清空")
}

// 不管是创建摘录还是修改摘录，都会提前触发这个事件，所以要判断一下，在修改之前保存上次摘录
let isProcessNewExcerpt = false
let isChangeExcerptRange = false
let lastExcerptText = "😎"
const onPopupMenuOnNote: eventHandler = async sender => {
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
  log("修改摘录", "excerpt")
  const note = getNoteById(sender.userInfo.noteid)
  isChangeExcerptRange = true
  handleExcerpt(note, lastExcerptText)
}

const onProcessNewExcerpt: eventHandler = sender => {
  log("创建摘录", "excerpt")
  const note = getNoteById(sender.userInfo.noteid)
  isProcessNewExcerpt = true
  // 摘录前初始化，使得创建摘录时可以自由修改
  if (profile.ohmymn.lockExcerpt) lastExcerptText = "😎"
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
