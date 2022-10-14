import { delay, MN, StudyMode, UIViewController } from "marginnote"
import { PanelControl } from "~/modules/addon/typings"

// Set the position and size of the panel
export function layoutViewController(
  heightNum = self.globalProfile.addon.panelHeight[0],
  positionNum = self.globalProfile.addon.panelPosition[0]
) {
  const { studyController } = MN
  const readerView = studyController.readerController.view
  self.panel.lastReaderViewWidth = readerView.frame.width
  const frame = studyController.view.bounds
  const width = 300
  const height = [600, 450, 300][heightNum]
  const docSide = () => {
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
  const middleDocMap = () => {
    const isHidden = readerView.hidden
    if (studyController.rightMapMode) {
      const x = readerView.frame.width - width / 2
      return x < 50 || isHidden
        ? 50
        : x > frame.width - width - 50
        ? frame.width - width - 50
        : x
    } else {
      const x = frame.width - readerView.frame.width - width / 2
      return x > frame.width - width - 50 || isHidden
        ? frame.width - width - 50
        : x < 50
        ? 50
        : x
    }
  }
  const mapSide = () => {
    const isHidden = readerView.hidden
    if (studyController.rightMapMode) {
      const x = readerView.frame.width + 40
      return x < 50 || isHidden
        ? 50
        : x > frame.width - width - 50
        ? frame.width - width - 50
        : x
    } else {
      const x = frame.width - readerView.frame.width - width - 40
      return x > frame.width - width - 50 || isHidden
        ? frame.width - width - 50
        : x < 50
        ? 50
        : x
    }
  }
  const x = [
    docSide,
    middleDocMap,
    mapSide,
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

export function closePanel() {
  if (!self.panel.status) return
  self.settingViewController.view.removeFromSuperview()
  self.panel.status = false
  MN.studyController.refreshAddonCommands()
}

export function openPanel() {
  if (self.panel.status) return
  const { studyController } = MN
  studyController.view.addSubview(self.settingViewController.view)
  self.panel.status = true
  studyController.refreshAddonCommands()
  self.panel.lastOpenPanel = Date.now()
  delay(0.2).then(() => void studyController.view.becomeFirstResponder())
}

export function switchPanel() {
  if (self.panel.status) closePanel()
  else {
    if (
      self.globalProfile.addon.panelControl.includes(
        PanelControl.DoubleClickOpen
      )
    ) {
      const now = Date.now()
      if (self.panel.lastClickButton && now - self.panel.lastClickButton < 300)
        openPanel()
      else self.panel.lastClickButton = now
    } else openPanel()
  }
}

function controllerWillLayoutSubviews(controller: UIViewController) {
  if (controller != MN.studyController) return
  if (!self.panel.status) return
  if (
    Date.now() - self.panel.lastOpenPanel < 200 ||
    (self.panel.lastReaderViewWidth !==
      MN.studyController.readerController.view.frame.width &&
      [0, 1, 2].includes(self.globalProfile.addon.panelPosition[0]))
  ) {
    layoutViewController()
  }
}

function queryAddonCommandStatus() {
  return MN.studyController.studyMode !== StudyMode.review &&
    MN.currnetNotebookid &&
    (MN.db.getNotebookById(MN.currnetNotebookid)?.documents?.length ?? 0)
    ? {
        image: "logo.png",
        object: self,
        selector: "switchPanel:",
        checked: self.panel.status
      }
    : null
}

export default {
  queryAddonCommandStatus,
  switchPanel,
  controllerWillLayoutSubviews
}
