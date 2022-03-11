import type { GestureHandler, IRowButton, IRowSelect } from "typings"
import {
  groupMode,
  UISwipeGestureRecognizerDirection,
  docMapSplitMode,
  studyMode
} from "typings/enum"
import { MN } from "const"
import { utils as gesture } from "modules/gesture"
import {
  actionKey4Card,
  dataSourceIndex,
  moduleList,
  QuickSwitch
} from "synthesizer"
import handleMagicAction from "./magicActionHandler"
import { closePanel, openPanel } from "./switchPanel"
import { PanelControl } from "modules/ohmymn"
import { showHUD } from "utils/common"
import lang from "lang"

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

enum SwipePosition {
  None = 0,
  SingleBar,
  MuiltBar,
  SelectionBar
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

const checkSwipePosition = (sender: UIGestureRecognizer): SwipePosition => {
  const studyController = MN.studyController()
  const { mindmapView } = studyController.notebookController
  const { selViewLst } = mindmapView
  // 必须打开脑图，并且选中卡片
  if (
    studyController.studyMode != studyMode.study ||
    studyController.docMapSplitMode == docMapSplitMode.allDoc ||
    !selViewLst?.length
  )
    return SwipePosition.None

  const { x: swipeX, y: swipeY } = sender.locationInView(studyController.view)
  const { width, height } = studyController.view.bounds
  // 屏蔽一些会误触的 UI
  if (swipeY < 70 || swipeX < 70 || swipeX > width - 70)
    return SwipePosition.None
  if (
    self.panelStatus &&
    isWithinArea({ swipeX, swipeY }, self.settingViewController.view.frame)
  )
    return SwipePosition.None

  if (selViewLst.length == 1 && self.singleBarStatus) {
    const { width: readerViewWidth } =
      studyController.readerController.view.frame

    // 不响应文档区域的滑动
    if (
      studyController.docMapSplitMode == docMapSplitMode.half &&
      ((studyController.rightMapMode && swipeX < readerViewWidth) ||
        (!studyController.rightMapMode && swipeX > width - readerViewWidth))
    )
      return SwipePosition.None

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
      return SwipePosition.SingleBar

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
      return SwipePosition.SingleBar
  } else if (selViewLst.length > 1) {
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
      return SwipePosition.MuiltBar
  } else {
    if (
      self.selectionBar &&
      isWithinArea({ swipeX, swipeY }, self.selectionBar)
    )
      return SwipePosition.SelectionBar
  }
  return SwipePosition.None
}

const actionTrigger = async (
  sigleBarOption: number,
  muiltBarOption: number,
  selectionBarOption: number,
  sender: UIGestureRecognizer
) => {
  if (!self.profile.ohmymn.quickSwitch.includes(QuickSwitch.gesture)) return
  // 模块未启用，则菜单隐藏
  const isModuleOFF = (header: string): boolean => {
    const { quickSwitch } = self.profile.ohmymn
    return (
      moduleList.includes(header) &&
      !quickSwitch.includes(moduleList.findIndex(key => key === header))
    )
  }
  const swipePosition = checkSwipePosition(sender)
  if (swipePosition === SwipePosition.None) return

  let actionInfo: typeof actionKey4Card[number]
  let type: "card" | "text" = "card"

  if (swipePosition === SwipePosition.SingleBar && sigleBarOption) {
    actionInfo = actionKey4Card[sigleBarOption]
  } else if (swipePosition === SwipePosition.MuiltBar && muiltBarOption) {
    actionInfo = actionKey4Card[muiltBarOption]
  } else if (swipePosition === SwipePosition.SelectionBar) {
    type = "text"
    actionInfo = actionKey4Card[selectionBarOption]
  } else return

  const { key, module, option } = actionInfo
  if (key == "open_panel") openPanel()
  else if (module && isModuleOFF(module))
    showHUD(`${module} ${lang.handle_gesture_event.action_not_work}`, 2)
  else {
    const [sec, row] = dataSourceIndex.magicaction[key]
    await handleMagicAction(
      type,
      <IRowButton>self.dataSource[sec].rows[row],
      option
    )
  }
}

const onSwipeUpOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeUp, muiltBarSwipeUp, selectionBarSwipeUp } =
    self.profile.gesture
  actionTrigger(
    singleBarSwipeUp[0],
    muiltBarSwipeUp[0],
    selectionBarSwipeUp[0],
    sender
  )
}
const onSwipeDownOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeDown, muiltBarSwipeDown, selectionBarSwipeDown } =
    self.profile.gesture
  actionTrigger(
    singleBarSwipeDown[0],
    muiltBarSwipeDown[0],
    selectionBarSwipeDown[0],
    sender
  )
}
const onSwipeLeftOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeLeft, muiltBarSwipeLeft, selectionBarSwipeLeft } =
    self.profile.gesture
  actionTrigger(
    singleBarSwipeLeft[0],
    muiltBarSwipeLeft[0],
    selectionBarSwipeLeft[0],
    sender
  )
}
const onSwipeRightOnMindMapView: GestureHandler = sender => {
  const { singleBarSwipeRight, muiltBarSwipeRight, selectionBarSwipeRight } =
    self.profile.gesture
  actionTrigger(
    singleBarSwipeRight[0],
    muiltBarSwipeRight[0],
    selectionBarSwipeRight[0],
    sender
  )
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
