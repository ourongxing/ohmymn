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
import { reverseEscape } from "~/utils"
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
    /**
     * 脑图
     * 如果是从右往左框选，菜单在上面，(y-70, y-30)
     * 从左往右框选，菜单在下面，(y-0, y+40)
     */
    if (self.globalProfile.gesture.showY) {
      showHUD(String(Math.round(y - swipeY)), 3)
    }
    const [L2R, R2L] = reverseEscape(
      self.globalProfile.gesture.selectionBarY || "[0,70]"
    ) as number[]
    if (
      isWithinArea(
        { swipeY },
        {
          y: y - (arrow === DirectionOfSelection.toRight ? L2R : R2L),
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

    // alert(`y: ${parseInt(String(cardY))}
    // swipeY: ${parseInt(String(swipeY))}
    // y - ${parseInt(String(cardY - swipeY))} = swipeY`)
    const mode = selViewLst[0].note.note.groupMode
    /**
     * Popup menu on mindmap note
     * height 30
     * distance from the card 20
     */
    if (
      mode === GroupMode.Tree &&
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
      mode === GroupMode.Frame &&
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
