import { MN } from "~/sdk"
import { PanelControl } from "~/modules/addon/typings"
import {
  actionTrigger,
  gestureHandlerController,
  initGesture
} from "~/modules/gesture/utils"
import { GestureHandler } from "~/typings"
import { UISwipeGestureRecognizerDirection } from "~/enum"
import { closePanel } from "./switchPanel"

// Not support Mac
// Cannot access self unless use function
export const gestureHandlers = () =>
  gestureHandlerController([
    {
      view: MN.studyController().view,
      gesture: initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Up,
        "SwipeUpOnMindMapView"
      )
    },
    {
      view: MN.studyController().view,
      gesture: initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Down,
        "SwipeDownOnMindMapView"
      )
    },
    {
      view: MN.studyController().view,
      gesture: initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Left,
        "SwipeLeftOnMindMapView"
      )
    },
    {
      view: MN.studyController().view,
      gesture: initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Right,
        "SwipeRightOnMindMapView"
      )
    },
    {
      view: self.settingViewController.tableView!,
      gesture: initGesture.tap(1, 2, "DoubleClickOnTableView")
    }
  ])

const onSwipeUpOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeUp, muiltBarSwipeUp, selectionBarSwipeUp } =
    self.globalProfile.gesture
  actionTrigger(
    singleBarSwipeUp[0],
    muiltBarSwipeUp[0],
    selectionBarSwipeUp[0],
    sender
  )
}
const onSwipeDownOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeDown, muiltBarSwipeDown, selectionBarSwipeDown } =
    self.globalProfile.gesture
  actionTrigger(
    singleBarSwipeDown[0],
    muiltBarSwipeDown[0],
    selectionBarSwipeDown[0],
    sender
  )
}
const onSwipeLeftOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeLeft, muiltBarSwipeLeft, selectionBarSwipeLeft } =
    self.globalProfile.gesture
  actionTrigger(
    singleBarSwipeLeft[0],
    muiltBarSwipeLeft[0],
    selectionBarSwipeLeft[0],
    sender
  )
}
const onSwipeRightOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeRight, muiltBarSwipeRight, selectionBarSwipeRight } =
    self.globalProfile.gesture
  actionTrigger(
    singleBarSwipeRight[0],
    muiltBarSwipeRight[0],
    selectionBarSwipeRight[0],
    sender
  )
}

const onDoubleClickOnTableView: GestureHandler = () => {
  const { panelControl } = self.globalProfile.addon
  if (panelControl.includes(PanelControl.DoubleClickClose)) closePanel()
}

export default {
  onSwipeUpOnMindMapView,
  onSwipeDownOnMindMapView,
  onSwipeLeftOnMindMapView,
  onSwipeRightOnMindMapView,
  onDoubleClickOnTableView
}
