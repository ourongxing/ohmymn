import { docMapSplitMode, osType, studyMode } from "types/MarginNote"
import { delay, showHUD } from "utils/common"
import { MN } from "const"
import { UIViewController } from "types/UIKit"
import lang from "lang"
import { PanelControl } from "addons/ohmymn"

// 设置窗口面板的位置和大小
export const layoutViewController = (
  heightNum = self.profile.ohmymn.panelHeight[0],
  positionNum = self.profile.ohmymn.panelPosition[0]
) => {
  const studyController = MN.studyController()
  const frame = studyController.view.bounds
  const width = 300
  const height = [600, 450, 300][heightNum]
  const autoX = () => {
    const readerView = studyController.readerController.view
    const isHidden = readerView.hidden
    if (studyController.rightMapMode) {
      const x = readerView.frame.width - width - 40
      return x < 50 || isHidden ? 50 : x
    } else {
      const x = frame.width - readerView.frame.width + 40
      return x > frame.width - width - 50 || isHidden
        ? frame.width - width - 50
        : x
    }
  }
  const x = [autoX(), 50, (frame.width - width) / 2, frame.width - width - 50][
    positionNum
  ]
  self.settingViewController.view.frame = {
    x,
    y: 110,
    height,
    width
  }
}

export const closePanel = () => {
  if (!self.panelStatus) return
  self.settingViewController.view.removeFromSuperview()
  self.panelStatus = false
  MN.studyController().refreshAddonCommands()
}

let lastOpenPanel = 0
export const openPanel = () => {
  if (self.panelStatus) return
  const studyController = MN.studyController()
  studyController.view.addSubview(self.settingViewController.view)
  self.panelStatus = true
  studyController.refreshAddonCommands()
  lastOpenPanel = Date.now()
  if (studyController.docMapSplitMode == docMapSplitMode.allDoc) {
    studyController.docMapSplitMode = docMapSplitMode.half
    showHUD(lang.switch_panel.better_with_mindmap, 1)
  }
  delay(0.2).then(() => void studyController.view.becomeFirstResponder())
}

let lastClickButton = 0
const switchPanel = () => {
  if (self.panelStatus) closePanel()
  else {
    if (
      self.profile.ohmymn.panelControl.includes(PanelControl.DoubleClickOpen)
    ) {
      const now = Date.now()
      if (lastClickButton && now - lastClickButton < 300) openPanel()
      else lastClickButton = now
    } else openPanel()
  }
}

// 改变各个 view 的时候就会触发，非常频繁，我们只需要在打开面板的时候触发一次，记录一下最近一次面板打开的时间
const controllerWillLayoutSubviews = (controller: UIViewController) => {
  if (controller != MN.studyController()) return
  if (!self.panelStatus) return
  if (Date.now() - lastOpenPanel < 200) layoutViewController()
}

const queryAddonCommandStatus = () => {
  // 仅在学习模式下打开，阻止在 iPhone 使用
  return MN.app.osType !== osType.iPadOS ||
    MN.studyController().studyMode == studyMode.study
    ? {
        image: "logo.png",
        object: self,
        selector: "switchPanel:",
        checked: self.panelStatus
      }
    : null
}

export default {
  queryAddonCommandStatus,
  switchPanel,
  controllerWillLayoutSubviews
}
