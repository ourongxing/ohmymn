import { actions } from "addons/synthesizer"
import handleExcerpt from "jsExtension/excerptHandler"
import { closePanel, layoutViewController } from "jsExtension/switchPanel"
import profile from "profile"
import { getNoteById, getSelectNodes, getSelectNodesAll, undoGrouping } from "utils/notebook"
import { delayBreak, log, showHUD } from "utils/public"

declare interface IUserInfo {
  [k: string]: any
}

interface eventHandler {
  ({ userInfo }: { userInfo: IUserInfo }): void
}

const onButtonClick: eventHandler = ({ userInfo }) => {
  if (profile.ohmymn.clickHidden) closePanel()
  let nodes: MbBookNote[]

  if (profile.ohmymn.selectChildren) nodes = getSelectNodesAll()
  else nodes = getSelectNodes()

  if (nodes.length) {
    undoGrouping(nodes[0].notebookId!, () => {
      actions[userInfo.key]({
        content: userInfo.content,
        nodes: nodes
      })
    })
  } else {
    showHUD("未选中任何脑图卡片")
  }
}

const onSwitchChange: eventHandler = ({ userInfo }) => {
  profile[userInfo.name][userInfo.key] = userInfo.status
  switch (userInfo.key) {
    case "rightMode":
      layoutViewController()
      break
    case "lockExcerpt":
      if (userInfo.status && profile.ohmymn.autoCorrect) showHUD("锁定摘录不建议和自动矫正同时开启", 2)
      break
    case "autoCorrect":
      if (userInfo.status) showHUD("请按实际情况选择开关，不建议全部打开自动矫正", 2)
      break
    default:
      break
  }
}

const onInputOver: eventHandler = ({ userInfo }) => {
  profile[userInfo.name][userInfo.key] = userInfo.content
  log(profile.anotherautotitle)
  if (userInfo.content) {
    showHUD("输入已保存")
  } else showHUD("输入已清空")
}

// 不管是创建摘录还是修改摘录，都会提前触发这个事件
let isProcessNewExcerpt = false
let isChangeExcerptRange = false
let lastExcerptText = "😎"
const onPopupMenuOnNote: eventHandler = async ({ userInfo }) => {
  if (profile.ohmymn.lockExcerpt) {
    const note = <MbBookNote>userInfo.note
    isChangeExcerptRange = false
    isProcessNewExcerpt = false
    const success = await delayBreak(10, 0.05, () => isChangeExcerptRange || isProcessNewExcerpt)
    if (success) return
    lastExcerptText = note.excerptText!
    log("检测到开启锁定摘录选项，保存摘录", "excerpt")
  }
}

const onChangeExcerptRange: eventHandler = async ({ userInfo }) => {
  const note = getNoteById(userInfo.noteid)
  isChangeExcerptRange = true
  log("修改摘录", "excerpt")
  // 创建摘录时立即修改不会影响，因为没有触发保存
  if (profile.ohmymn.lockExcerpt && lastExcerptText != "😎") {
    log("检测到开启锁定摘录选项，还原摘录", "excerpt")
    // 但是如果开启了自动矫正就比较麻烦了
    if (profile.ohmymn.autoCorrect) {
      note.excerptText = "😎"
      await delayBreak(20, 0.1, () => note.excerptText != "😎")
    }
    note.excerptText = lastExcerptText
  } else handleExcerpt(note)
}

const onProcessNewExcerpt: eventHandler = ({ userInfo }) => {
  const note = getNoteById(userInfo.noteid)
  isProcessNewExcerpt = true
  if (profile.ohmymn.lockExcerpt) {
    log("检测到开启锁定摘录选项，摘录前初始化，使得创建摘录时可以自由修改", "excerpt")
    lastExcerptText = "😎"
  }
  handleExcerpt(note)
}

export default {
  onButtonClick,
  onInputOver,
  onSwitchChange,
  onPopupMenuOnNote,
  onProcessNewExcerpt,
  onChangeExcerptRange
}
