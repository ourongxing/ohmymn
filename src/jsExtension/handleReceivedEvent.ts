import { actions } from "addons/synthesizer"
import handleExcerpt from "jsExtension/excerptHandler"
import { closePanel, layoutViewController } from "jsExtension/switchPanel"
import { profile } from "profile"
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

// 不管是创建摘录还是修改摘录，都会提前触发这个事件，所以要判断一下，在修改之前保存上次摘录
let isProcessNewExcerpt = false
let isChangeExcerptRange = false
let lastExcerptText = "😎"
const onPopupMenuOnNote: eventHandler = async ({ userInfo }) => {
  const note = <MbBookNote>userInfo.note
  isChangeExcerptRange = false
  isProcessNewExcerpt = false
  const success = await delayBreak(10, 0.05, () => isChangeExcerptRange || isProcessNewExcerpt)
  if (success) return
  // 保存修改摘录前的内容
  lastExcerptText = note.excerptText!
}

const onChangeExcerptRange: eventHandler = async ({ userInfo }) => {
  log("修改摘录", "excerpt")
  const note = getNoteById(userInfo.noteid)
  isChangeExcerptRange = true
  handleExcerpt(note, lastExcerptText)
}

const onProcessNewExcerpt: eventHandler = ({ userInfo }) => {
  log("创建摘录", "excerpt")
  const note = getNoteById(userInfo.noteid)
  isProcessNewExcerpt = true
  // 摘录前初始化，使得创建摘录时可以自由修改
  if (profile.ohmymn.lockExcerpt) lastExcerptText = "😎"
  handleExcerpt(note)
}

export default {
  onInputOver,
  onButtonClick,
  onSwitchChange,
  onPopupMenuOnNote,
  onProcessNewExcerpt,
  onChangeExcerptRange,
}
