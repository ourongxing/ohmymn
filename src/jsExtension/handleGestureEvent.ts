import type { GestureHandler, IRowButton } from "types/Addon"
import { UISwipeGestureRecognizerDirection } from "types/UIKit"
import { MN } from "const"
import { docMapSplitMode, studyMode, groupMode } from "types/MarginNote"
import { util as gesture } from "modules/gesture"
import { actionKey, dataSourceIndex, QuickSwitch } from "synthesizer"
import handleMagicAction from "./magicActionHandler"
import { closePanel, openPanel } from "./switchPanel"
import { PanelControl } from "modules/ohmymn"

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

const isWithinArea = (
  pos: {
    swipeX?: number
    swipeY?: number
  },
  area: {
    x?: number
    y?: number
    height?: number
    width?: number
  }
) => {
  const { swipeX, swipeY } = pos
  const { x, y, width, height } = area
  const xx =
    x === undefined ||
    width === undefined ||
    swipeX === undefined ||
    (swipeX > x && swipeX < x + width)

  const yy =
    y === undefined ||
    height === undefined ||
    swipeY === undefined ||
    (swipeY > y && swipeY < y + height)

  return xx && yy
}

const checkSwipePosition = (sender: UIGestureRecognizer): swipePositon => {
  const studyController = MN.studyController()
  const { mindmapView } = studyController.notebookController
  const { selViewLst } = mindmapView
  // 必须打开脑图，并且选中卡片
  if (
    studyController.studyMode != studyMode.study ||
    studyController.docMapSplitMode == docMapSplitMode.allDoc ||
    !selViewLst?.length
  )
    return swipePositon.None

  const { x: swipeX, y: swipeY } = sender.locationInView(studyController.view)
  const { width, height } = studyController.view.bounds
  // 屏蔽一些会误触的 UI
  if (swipeY < 60 || swipeX < 70 || swipeX > width - 70)
    return swipePositon.None
  if (
    self.panelStatus &&
    isWithinArea({ swipeX, swipeY }, self.settingViewController.view.frame)
  )
    return swipePositon.None

  if (selViewLst.length == 1 && self.barStatus) {
    const { width: readerViewWidth } =
      studyController.readerController.view.frame

    // 不响应文档区域的滑动
    if (
      studyController.docMapSplitMode == docMapSplitMode.half &&
      ((studyController.rightMapMode && swipeX < readerViewWidth) ||
        (!studyController.rightMapMode && swipeX > width - readerViewWidth))
    )
      return swipePositon.None

    const view = selViewLst![0].view
    const { y: cardY, height: cardHeight } =
      mindmapView.subviews[0].subviews[0].convertRectToView(
        view.frame,
        studyController.view
      )
    const mode = selViewLst[0].note.note.groupMode
    /**
     * 单选工具栏
     * 高度 30
     * 与卡片相距 20
     */
    if (
      mode === groupMode.Tree &&
      // y > 60，单选工具栏在卡片上方
      ((cardY > 60 &&
        isWithinArea({ swipeY }, { y: cardY - 20 - 30, height: 30 })) ||
        // y < 60 单选工具栏在卡片下方
        (cardY < 60 &&
          isWithinArea(
            { swipeY },
            {
              y: cardY + cardHeight + 20,
              height: 30
            }
          )))
    )
      return swipePositon.SingleBar

    // 框架形式的单选工具栏在卡片中间和上方
    if (
      mode === groupMode.Frame &&
      isWithinArea(
        { swipeY },
        {
          y: cardY - 20 - 30,
          height: cardHeight + 20 + 30
        }
      )
    )
      return swipePositon.SingleBar
  }

  /**
   * 多选工具栏
   * iPad Pro 12.9
   * 高度 y(900-850 = 50) 窗口宽度 980
   * 工具栏底部距离窗口底部 980 - 900 = 80 这个值固定
   * 工具栏顶部距离窗口底部 980 - 850 = 130 这个值也固定
   *
   * 宽度 x(930 - 430 = 500) 窗口宽度 1366
   * 窗口小于 width < 510 时，工具栏会自动收缩到 width - 50，两边各空出来 25
   * 1/2 窗口时 宽度 x(590 - 90 = 500) 窗口宽度 678
   * 1/4 窗口时 宽度 x(350 - 25 = 325) 窗口宽度 375
   */
  const barWidth = width > 510 ? 500 : width - 50
  const muiltBarArea = {
    x: (width - barWidth) / 2,
    y: height - 130,
    height: 50,
    width: barWidth
  }

  if (isWithinArea({ swipeX, swipeY }, muiltBarArea))
    return swipePositon.MuiltBar

  return swipePositon.None
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

const onSwipeUpOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeUp, muiltBarSwipeUp } = self.profile.gesture
  actionTrigger(singleBarSwipeUp[0], muiltBarSwipeUp[0], sender)
}
const onSwipeDownOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeDown, muiltBarSwipeDown } = self.profile.gesture
  actionTrigger(singleBarSwipeDown[0], muiltBarSwipeDown[0], sender)
}
const onSwipeLeftOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeLeft, muiltBarSwipeLeft } = self.profile.gesture
  actionTrigger(singleBarSwipeLeft[0], muiltBarSwipeLeft[0], sender)
}
const onSwipeRightOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeRight, muiltBarSwipeRight } = self.profile.gesture
  actionTrigger(singleBarSwipeRight[0], muiltBarSwipeRight[0], sender)
}

const onDoubleClickOnTableView: GestureHandler = sender => {
  const { panelControl } = self.profile.ohmymn
  if (panelControl.includes(PanelControl.DoubleClickClose)) closePanel()
}

export default {
  onSwipeUpOnMindMapView,
  onSwipeDownOnMindMapView,
  onSwipeLeftOnMindMapView,
  onSwipeRightOnMindMapView,
  onDoubleClickOnTableView
}
