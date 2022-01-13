import type { gestureHandler, IRowButton } from "types/Addon"
import { UISwipeGestureRecognizerDirection } from "types/UIKit"
import { MN } from "const"
import { studyMode } from "types/MarginNote"
import { util as gesture } from "addons/gesture"
import { actionKey, dataSourceIndex, QuickSwitch } from "synthesizer"
import handleMagicAction from "./magicActionHandler"
import { closePanel, openPanel } from "./switchPanel"

// Mac 上无法使用触摸
export const gestureHandlers = gesture.gestureHandlerController([
  {
    // 如果直接传递 view 和 gesture，此时无法获取到 self
    view: () => MN.studyController().view,
    gesture: () =>
      gesture.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Up,
        "SwipeUpOnMindMapView"
      )
  },
  {
    view: () => MN.studyController().view,
    gesture: () =>
      gesture.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Down,
        "SwipeDownOnMindMapView"
      )
  },
  {
    view: () => MN.studyController().view,
    gesture: () =>
      gesture.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Left,
        "SwipeLeftOnMindMapView"
      )
  },
  {
    view: () => MN.studyController().view,
    gesture: () =>
      gesture.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Right,
        "SwipeRightOnMindMapView"
      )
  },
  {
    view: () => self.settingViewController.tableView!,
    gesture: () => gesture.initGesture.tap(1, 2, "DoubleClickOnTableView")
  }
])

const enum swipePositon {
  None = 0,
  SingleBar,
  MuiltBar
}

const checkSwipePosition = (sender: UIGestureRecognizer): swipePositon => {
  const studyController = MN.studyController()
  const { mindmapView } = studyController.notebookController
  const { selViewLst } = mindmapView
  // 必须打开脑图，并且选中卡片
  if (studyController.studyMode != studyMode.study || !selViewLst?.length)
    return swipePositon.None
  const { y: swipeY } = sender.locationInView(studyController.view)
  if (selViewLst.length == 1) {
    const view = selViewLst![0].view
    const { x, y, height } =
      mindmapView.subviews[0].subviews[0].convertRectToView(
        view.frame,
        studyController.view
      )
    // 工具栏在上面
    return (y - swipeY < 50 && y - swipeY > 0) ||
      // 工具栏在下面
      (swipeY - y < height + 50 && swipeY - y > height)
      ? swipePositon.SingleBar
      : swipePositon.None
  } else {
    const { height } = studyController.view.bounds
    return height - swipeY > 50 && height - swipeY < 150
      ? swipePositon.MuiltBar
      : swipePositon.None
  }
}

const actionTrigger = async (
  sigleOption: number,
  muiltOption: number,
  sender: UIGestureRecognizer
) => {
  if (!self.profile.ohmymn.quickSwitch.includes(QuickSwitch.gesture)) return
  switch (checkSwipePosition(sender)) {
    case swipePositon.None:
      return
    case swipePositon.SingleBar: {
      if (!sigleOption) return
      if (actionKey[sigleOption].key == "open_panel") openPanel()
      else {
        const [sec, row] =
          dataSourceIndex.magicaction[actionKey[sigleOption].key]
        await handleMagicAction(
          <IRowButton>self.dataSource[sec].rows[row],
          actionKey[sigleOption].option
        )
      }
      break
    }
    case swipePositon.MuiltBar: {
      if (!muiltOption) return
      if (actionKey[muiltOption].key == "open_panel") openPanel()
      else {
        const [sec, row] =
          dataSourceIndex.magicaction[actionKey[muiltOption].key]
        await handleMagicAction(
          <IRowButton>self.dataSource[sec].rows[row],
          actionKey[muiltOption].option
        )
      }
      break
    }
  }
}

const onSwipeUpOnMindMapView: gestureHandler = sender => {
  const { singleBarSwipeUp, muiltBarSwipeUp } = self.profile.gesture
  actionTrigger(singleBarSwipeUp[0], muiltBarSwipeUp[0], sender)
}
const onSwipeDownOnMindMapView: gestureHandler = sender => {
  const { singleBarSwipeDown, muiltBarSwipeDown } = self.profile.gesture
  actionTrigger(singleBarSwipeDown[0], muiltBarSwipeDown[0], sender)
}
const onSwipeLeftOnMindMapView: gestureHandler = sender => {
  const { singleBarSwipeLeft, muiltBarSwipeLeft } = self.profile.gesture
  actionTrigger(singleBarSwipeLeft[0], muiltBarSwipeLeft[0], sender)
}
const onSwipeRightOnMindMapView: gestureHandler = sender => {
  const { singleBarSwipeRight, muiltBarSwipeRight } = self.profile.gesture
  actionTrigger(singleBarSwipeRight[0], muiltBarSwipeRight[0], sender)
}

const onDoubleClickOnTableView: gestureHandler = sender => {
  closePanel()
}

export default {
  onSwipeUpOnMindMapView,
  onSwipeDownOnMindMapView,
  onSwipeLeftOnMindMapView,
  onSwipeRightOnMindMapView,
  onDoubleClickOnTableView
}
