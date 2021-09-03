import { actions } from "addons/synthesizer"
import handleExcerpt from "jsExtension/excerptHandler"
import { closePanel, layoutViewController } from "jsExtension/switchPanel"
import profile from "profile"
import { getSelectNodes, getSelectNodesAll, undoGrouping } from "utils/notebook"
import { log, showHUD } from "utils/public"

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
  if (userInfo.key == "rightMode") {
    layoutViewController()
  }
}

const onInputOver: eventHandler = ({ userInfo }) => {
  profile[userInfo.name][userInfo.key] = userInfo.content
  log(profile.anotherautotitle)
  if (userInfo.content) {
    showHUD("输入已保存")
  } else showHUD("输入已清空")
}


const onProcessExcerptText: eventHandler = ({ userInfo }) => {
  handleExcerpt(userInfo.noteid)
}

export default {
  onButtonClick,
  onInputOver,
  onSwitchChange,
  onProcessExcerptText
}
