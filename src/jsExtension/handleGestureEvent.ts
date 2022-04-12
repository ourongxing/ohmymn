import type { GestureHandler, IRowButton } from "typings"
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
import { isModuleON, moduleKeyArray } from "synthesizer"

// Not support Mac
// Cannot access self unless use function
const { initGesture } = gesture.utils
export const gestureHandlers = () =>
  gesture.utils.gestureHandlerController([
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

const enum SwipePosition {
  None = 0,
  SingleBar,
  MuiltBar,
  SelectionBar
}

const isWithinArea = (
  {
    swipeX,
    swipeY
  }: {
    swipeX?: number
    swipeY?: number
  },
  {
    x,
    y,
    height,
    width
  }: {
    x?: number
    y?: number
    height?: number
    width?: number
  }
) => {
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
  // Block some UI that can be touched by mistake
  if (swipeY < 70 || swipeX < 70 || swipeX > width - 70)
    return SwipePosition.None
  if (studyController.studyMode != studyMode.study) return SwipePosition.None
  if (
    self.panelStatus &&
    isWithinArea({ swipeX, swipeY }, self.settingViewController.view.frame)
  )
    return SwipePosition.None

  // Popup menu on selection
  if (self.textSelectBar) {
    const { winRect, arrow } = self.textSelectBar
    const [, y] = reverseEscape(`[${winRect.replace(/[{}]/g, "")}]`) as number[]
    /**
     * 如果是从右往左框选，菜单在上面，(y-140, y-110)
     * 从左往右框选，菜单在下面， (y-75, y-45)
     */
    // alert(`y - ${parseInt(String(y - swipeY))} = swipeY`)
    if (
      isWithinArea(
        { swipeY },
        {
          // mme 中修改了
          // y: y - (arrow === DirectionOfSelection.toRight ? 75 : 140),
          y: y - (arrow === DirectionOfSelection.toRight ? 155 : 220),
          height: 35
        }
      )
    )
      return SwipePosition.SelectionBar
  }

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

    // Block document area
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
     * Popup menu on mindmap note
     * height 30
     * distance from the card 20
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

    // Menu will be in the middle and above the card when frame style
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
     * Muilt select toolbar
     * height: 50
     * buttom to buttom: 80
     * width: 500
     * if window width < 510, width = window width - 50
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
  else if (module && !isModuleON(module))
    showHUD(`${moduleName ?? module} ${lang.action_not_work}`, 2)
  else {
    const [sec, row] =
      dataSourceIndex[
        type === "card" ? "magicaction4card" : "magicaction4text"
      ][key]
    await handleMagicAction(
      type,
      self.dataSource[sec].rows[row] as IRowButton,
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
