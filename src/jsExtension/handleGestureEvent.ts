import type { GestureHandler, IRowButton, IRowSelect } from "typings"
import {
  groupMode,
  UISwipeGestureRecognizerDirection,
  docMapSplitMode,
  studyMode,
  DirectionOfSelection
} from "typings/enum"
import { MN } from "const"
import gesture from "modules/gesture"
import { actionKey4Card, actionKey4Text, dataSourceIndex } from "dataSource"
import handleMagicAction from "./magicActionHandler"
import { closePanel, openPanel } from "./switchPanel"
import { PanelControl } from "modules/addon/enum"
import { showHUD } from "utils/common"
import lang from "lang"
import { reverseEscape } from "utils/input"
import { moduleKeyArray, ModuleKeyType } from "synthesizer"

// Mac 上无法使用触摸
export const gestureHandlers = gesture.utils.gestureHandlerController([
  {
    // 如果直接传递 view 和 gesture，此时无法获取到 self
    view: () => MN.studyController().view,
    gesture: () =>
      gesture.utils.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Up,
        "SwipeUpOnMindMapView"
      )
  },
  {
    view: () => MN.studyController().view,
    gesture: () =>
      gesture.utils.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Down,
        "SwipeDownOnMindMapView"
      )
  },
  {
    view: () => MN.studyController().view,
    gesture: () =>
      gesture.utils.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Left,
        "SwipeLeftOnMindMapView"
      )
  },
  {
    view: () => MN.studyController().view,
    gesture: () =>
      gesture.utils.initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Right,
        "SwipeRightOnMindMapView"
      )
  },
  {
    view: () => self.settingViewController.tableView!,
    gesture: () => gesture.utils.initGesture.tap(1, 2, "DoubleClickOnTableView")
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
  const { x: swipeX, y: swipeY } = sender.locationInView(studyController.view)
  const { width, height } = studyController.view.bounds
  // 屏蔽一些会误触的 UI
  if (swipeY < 70 || swipeX < 70 || swipeX > width - 70)
    return SwipePosition.None
  if (studyController.studyMode != studyMode.study) return SwipePosition.None
  if (
    self.panelStatus &&
    isWithinArea({ swipeX, swipeY }, self.settingViewController.view.frame)
  )
    return SwipePosition.None

  // 如果是文本选择的工具栏
  if (self.textSelectBar) {
    const { winRect, arrow } = self.textSelectBar
    const [, y] = reverseEscape(`[${winRect.replace(/[{}]/g, "")}]`) as number[]
    /**
     * 如果是从右往左框选，菜单在上面，(y-140, y-110)
     * 从左往右框选，菜单在下面， (y-75, y-45)
     */
    if (
      isWithinArea(
        { swipeY },
        {
          y: y - (arrow === DirectionOfSelection.toRight ? 75 : 140),
          height: 30
        }
      )
    )
      return SwipePosition.SelectionBar
  }

  // 必须打开脑图，并且选中卡片
  const { mindmapView } = studyController.notebookController
  const { selViewLst } = mindmapView
  if (
    studyController.studyMode != studyMode.study ||
    studyController.docMapSplitMode == docMapSplitMode.allDoc ||
    !selViewLst?.length
  )
    return SwipePosition.None
  if (selViewLst.length == 1 && self.noteSelectBar?.status) {
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
      isWithinArea(
        { swipeY },
        {
          y: cardY > 60 ? cardY - 20 - 30 : cardY + cardHeight + 20,
          height: 30
        }
      )
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
  }
  return SwipePosition.None
}

const actionTrigger = async (
  sigleBarOption: number,
  muiltBarOption: number,
  selectionBarOption: number,
  sender: UIGestureRecognizer
) => {
  if (
    !self.profile.addon.quickSwitch.includes(moduleKeyArray.indexOf("gesture"))
  )
    return
  const isModuleOFF = (key: ModuleKeyType): boolean => {
    const [sec, row] = dataSourceIndex.addon.quickSwitch
    const quickSwitch = (self.dataSource[sec].rows[row] as IRowSelect)
      .selections
    const index = moduleKeyArray.indexOf(key)
    return index !== -1 && !quickSwitch.includes(index)
  }
  const swipePosition = checkSwipePosition(sender)
  if (swipePosition === SwipePosition.None) return

  let actionInfo: typeof actionKey4Card[number]
  let type: "card" | "text" = "card"

  if (swipePosition === SwipePosition.SingleBar && sigleBarOption) {
    actionInfo = actionKey4Card[sigleBarOption]
  } else if (swipePosition === SwipePosition.MuiltBar && muiltBarOption) {
    actionInfo = actionKey4Card[muiltBarOption]
  } else if (
    swipePosition === SwipePosition.SelectionBar &&
    selectionBarOption
  ) {
    type = "text"
    actionInfo = actionKey4Text[selectionBarOption]
  } else return

  const { key, module, option, moduleName } = actionInfo
  if (key == "open_panel") openPanel()
  else if (module && isModuleOFF(module))
    showHUD(
      `${moduleName ?? module} ${lang.handle_gesture_event.action_not_work}`,
      2
    )
  else {
    const [sec, row] =
      dataSourceIndex[
        type === "card" ? "magicaction4card" : "magicaction4text"
      ][key]
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

const onDoubleClickOnTableView: GestureHandler = () => {
  const { panelControl } = self.profile.addon
  if (panelControl.includes(PanelControl.DoubleClickClose)) closePanel()
}

export default {
  onSwipeUpOnMindMapView,
  onSwipeDownOnMindMapView,
  onSwipeLeftOnMindMapView,
  onSwipeRightOnMindMapView,
  onDoubleClickOnTableView
}
