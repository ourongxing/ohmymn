import type { CGPoint, CGRect, UIViewController } from "marginnote"
import { delay, StudyMode } from "marginnote"
import { Addon } from "~/addon"
import { PanelControl, PanelPosition } from "~/modules/addon/typings"

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
  const customFrame = JSON.parse(self.globalProfile.additional.settingViewFrame)
  const height = [600, 450, 300, customFrame.height ?? 450][heightNum]
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
  if (positionNum === PanelPosition.Custom && customFrame.x) {
    resizeSettingView(
      {
        ...ensureSafety({ x: customFrame.x, y: customFrame.y }),
        height,
        width
      },
      0.2
    )
  } else {
    const x = [
      docSide,
      middleDocMap,
      mapSide,
      () => 50,
      () => (frame.width - width) / 2,
      () => frame.width - width - 50,
      docSide
    ][positionNum]()
    resizeSettingView(
      {
        x,
        y: MN.isMN4 ? 150 : 110,
        height,
        width
      },
      0.2
    )
  }
}

export function closePanel() {
  if (!self.panel.status) return
  self.settingViewController.view.removeFromSuperview()
  self.dragOverlayView.removeFromSuperview()
  self.stretchOverlayView.removeFromSuperview()
  self.panel.status = false
  MN.studyController.refreshAddonCommands()
}

export function openPanel() {
  if (self.panel.status) return
  const { studyController } = MN
  studyController.view.addSubview(self.settingViewController.view)
  studyController.view.addSubview(self.dragOverlayView)
  studyController.view.addSubview(self.stretchOverlayView)
  self.panel.status = true
  studyController.refreshAddonCommands()
  self.panel.lastOpenPanel = Date.now()
  delay(0.2).then(() => void studyController.view.becomeFirstResponder())
}

export function switchPanel(sender?: UIView) {
  const addonBarView = sender?.superview.superview
  Addon.barPosition = addonBarView?.frame.x ? "right" : "left"
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
    MN.currnetNotebookId &&
    MN.currentDocmd5
    ? {
        image: "logo.png",
        object: self,
        selector: "switchPanel:",
        checked: self.panel.status
      }
    : null
}

export function resizeSettingView(rect: CGRect, animateDuration?: number) {
  const { y, height } = rect
  function resize() {
    self.settingViewController.view.frame = {
      ...rect
    }
    self.dragOverlayView.frame = {
      ...rect,
      height: self.dragOverlayView.frame.height
    }
    self.stretchOverlayView.frame = {
      ...rect,
      y: y + height - self.stretchOverlayView.frame.height / 2,
      height: self.stretchOverlayView.frame.height
    }
  }
  if (animateDuration)
    UIView.animateWithDurationAnimationsCompletion(
      animateDuration,
      resize,
      () => {}
    )
  else resize()
}

function onCloseButtonClick() {
  closePanel()
}

export function ensureSafety(
  { x, y }: CGPoint,
  frame = MN.studyController.view.bounds,
  dragOverlayFrame = self.dragOverlayView.frame
) {
  let tmp = x
  if (Addon.barPosition === "left") {
    if (x < 50) x = 50
    else if (x > (tmp = frame.width - dragOverlayFrame.width - 10)) x = tmp
  } else {
    if (x < 10) x = 10
    else if (x > (tmp = frame.width - dragOverlayFrame.width - 50)) x = tmp
  }
  if (y < 50) y = 50
  else if (y > (tmp = frame.height - dragOverlayFrame.height - 50)) y = tmp
  return { x, y }
}

export default {
  queryAddonCommandStatus,
  switchPanel,
  controllerWillLayoutSubviews
}
