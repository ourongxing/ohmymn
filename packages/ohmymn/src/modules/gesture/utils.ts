import {
  alert,
  DirectionOfSelection,
  DocMapSplitMode,
  GroupMode,
  MN,
  openURL,
  showHUD,
  StudyMode
} from "marginnote"
import { actionKey4Card, actionKey4Text, dataSourceIndex } from "~/dataSource"
import handleMagicAction from "~/jsExtension/handleMagicAction"
import { switchPanel } from "~/jsExtension/switchPanel"
import { isModuleON } from "~/coreModule"
import type { IRowButton } from "~/typings"
import lang from "./lang"

export const enum SwipePosition {
  None = 0,
  SingleBar,
  MuiltBar,
  SelectionBar
}

export function isWithinArea(
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
) {
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

export function checkSwipePosition(sender: UIGestureRecognizer): SwipePosition {
  const { studyController } = MN
  const { x: swipeX, y: swipeY } = sender.locationInView(studyController.view)
  const { width, height } = studyController.view.bounds
  // Block some UI that can be touched by mistake
  if (swipeY < 100 || swipeX < 70 || swipeX > width - 70)
    return SwipePosition.None
  if (
    self.panel.status &&
    isWithinArea({ swipeX, swipeY }, self.settingViewController.view.frame)
  )
    return SwipePosition.None

  // Popup menu on selection
  if (self.bar.text) {
    const { winRect, arrow } = self.bar.text
    const { y } = winRect
    if (
      isWithinArea(
        { swipeY },
        {
          y: (arrow === DirectionOfSelection.toLeft ? y - 67 : y + 1) - 3,
          height: 40
        }
      )
    )
      return SwipePosition.SelectionBar
  }

  if (studyController.studyMode != StudyMode.study) return SwipePosition.None
  const { mindmapView } = studyController.notebookController
  const { selViewLst } = mindmapView
  if (
    studyController.docMapSplitMode == DocMapSplitMode.allDoc ||
    !selViewLst?.length
  )
    return SwipePosition.None
  if (selViewLst.length == 1 && self.bar.card) {
    const { width: readerViewWidth } =
      studyController.readerController.view.frame

    // Block document area
    if (
      studyController.docMapSplitMode == DocMapSplitMode.half &&
      ((studyController.rightMapMode && swipeX < readerViewWidth) ||
        (!studyController.rightMapMode && swipeX > width - readerViewWidth))
    )
      return SwipePosition.None

    const { y: cardY, height: cardHeight } = self.bar.card.winRect

    if (
      isWithinArea(
        { swipeY },
        {
          y: (cardY > 60 ? cardY - 67 : cardY + cardHeight - 9) - 3,
          height: 40
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

export async function actionTrigger(
  direction: string,
  singleBarOption: number,
  muiltBarOption: number,
  selectionBarOption: number,
  sender: UIGestureRecognizer
) {
  if (!isModuleON("gesture")) return
  const swipePosition = checkSwipePosition(sender)
  if (swipePosition === SwipePosition.None) return

  let actionInfo: (typeof actionKey4Card)[number]
  let type: "card" | "text" = "card"
  if (swipePosition === SwipePosition.SingleBar && singleBarOption) {
    actionInfo = actionKey4Card[singleBarOption]
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
  if (key === "none") return
  else if (key == "switchPanel") switchPanel()
  else if (key === "customShortcut") {
    const pKey =
      ["singleBar", "muiltBar", "selectionBar"][swipePosition - 1] +
      "Swipe" +
      direction +
      "Shortcut"
    const val = self.globalProfile.gesture[pKey]
    if (val) openURL(val)
  } else if (module && !isModuleON(module))
    showHUD(`${moduleName ?? module} ${lang.action_not_work}`, 2)
  else {
    const [sec, row] =
      dataSourceIndex[
        type === "card" ? "magicaction4card" : "magicaction4text"
      ][key]
    // if(key === "aiActionPromptsText" || key === "aiActionPromptsCard") option = undefined
    await handleMagicAction(
      type,
      self.dataSource[sec].rows[row] as IRowButton,
      option
    )
  }
}
