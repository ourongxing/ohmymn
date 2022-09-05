import { PanelControl } from "~/modules/addon/typings"
import { UIViewController } from "~/typings"
import { StudyMode } from "~/enum"
import { MN, delay } from "~/sdk"

// Set the position and size of the panel
export const layoutViewController = (
  heightNum = self.globalProfile.addon.panelHeight[0],
  positionNum = self.globalProfile.addon.panelPosition[0]
) => {
  const studyController = MN.studyController()
  const readerView = studyController.readerController.view
  tmp.lastReaderViewWidth = readerView.frame.width
  const frame = studyController.view.bounds
  const width = 300
  const height = [600, 450, 300][heightNum]
  const autoX = () => {
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
  const x = [
    autoX,
    () => 50,
    () => (frame.width - width) / 2,
    () => frame.width - width - 50
  ][positionNum]()
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

const tmp = {
  lastOpenPanel: 0,
  lastClickButton: 0,
  lastReaderViewWidth: 0
}

export const openPanel = () => {
  if (self.panelStatus) return
  const studyController = MN.studyController()
  studyController.view.addSubview(self.settingViewController.view)
  self.panelStatus = true
  studyController.refreshAddonCommands()
  tmp.lastOpenPanel = Date.now()
  delay(0.2).then(() => void studyController.view.becomeFirstResponder())
}

export const switchPanel = () => {
  if (self.panelStatus) closePanel()
  else {
    if (
      self.globalProfile.addon.panelControl.includes(
        PanelControl.DoubleClickOpen
      )
    ) {
      const now = Date.now()
      if (tmp.lastClickButton && now - tmp.lastClickButton < 300) openPanel()
      else tmp.lastClickButton = now
    } else openPanel()
  }
}

const controllerWillLayoutSubviews = (controller: UIViewController) => {
  if (controller != MN.studyController()) return
  if (!self.panelStatus) return
  if (
    Date.now() - tmp.lastOpenPanel < 200 ||
    (tmp.lastReaderViewWidth !==
      MN.studyController().readerController.view.frame.width &&
      self.globalProfile.addon.panelPosition[0] === 0)
  ) {
    layoutViewController()
  }
}

const queryAddonCommandStatus = () => {
  return MN.studyController().studyMode !== StudyMode.review
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
