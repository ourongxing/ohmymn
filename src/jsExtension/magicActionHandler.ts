import { PanelControl } from "addons/ohmymn"
import checkInputCorrect from "inputChecker"
import lang from "lang"
import { actions } from "synthesizer"
import { cellViewType, IRowButton } from "types/Addon"
import { MbBookNote } from "types/MarginNote"
import { UIAlertViewStyle } from "types/UIKit"
import { popup, showHUD, HUDController } from "utils/common"
import {
  getSelectNodes,
  getSelectNodesAll,
  undoGroupingWithRefresh
} from "utils/note"
import { manageProfileAction } from "utils/profile"
import { closePanel } from "./switchPanel"

export default async (row: IRowButton) => {
  switch (row.type) {
    case cellViewType.buttonWithInput:
      for (;;) {
        const { option, content } = await popup(
          row.label,
          row.help ?? "",
          UIAlertViewStyle.PlainTextInput,
          row.option ? row.option : [lang.handle_user_action.sure],
          (alert: UIAlertView, buttonIndex: number) => {
            // 最好只有两个选项，因为这样会在输入后自动选中最后一个选项
            return {
              content: alert.textFieldAtIndex(0).text,
              option: buttonIndex
            }
          }
        )
        // 允许为空
        if (!content || checkInputCorrect(content, row.key)) {
          await handleMagicAction(row.key, option!, content)
          return
        } else showHUD(lang.handle_user_action.input_error)
      }
    case cellViewType.button:
      const { option } = await popup(
        row.label,
        row.help ?? "",
        UIAlertViewStyle.Default,
        row.option ?? [lang.handle_user_action.sure],
        (_, buttonIndex: number) => ({
          option: buttonIndex
        })
      )
      await handleMagicAction(row.key, option!)
  }
}

let customSelectedNodes: MbBookNote[] = []
const handleMagicAction = async (key: string, option: number, content = "") => {
  if (
    key != "filterCards" &&
    self.profile.ohmymn.panelControl.includes(PanelControl.CompleteClose)
  )
    closePanel()
  let nodes: MbBookNote[] = []
  if (customSelectedNodes.length) {
    nodes = customSelectedNodes
    customSelectedNodes = []
    HUDController.hidden()
  } else {
    nodes = getSelectNodes()
    if (!nodes.length) {
      showHUD(lang.magic_action_handler.not_selected)
      return
    }
    const isHavingChildren = nodes.every(
      node => nodes[0].parentNote == node.parentNote && node?.childNotes.length
    )
    const { smart_select } = lang.magic_action_handler
    if (isHavingChildren) {
      const { option } = await popup(
        "OhMyMN",
        nodes.length > 1
          ? smart_select.cards_with_children
          : smart_select.card_with_children,
        UIAlertViewStyle.Default,
        smart_select.option,
        (alert: UIAlertView, buttonIndex: number) => ({
          option: buttonIndex
        })
      )
      nodes = [nodes, getSelectNodesAll(true), getSelectNodesAll()][option!]
    }
  }
  switch (key) {
    case "filterCards":
      customSelectedNodes = actions[key]({
        content,
        nodes,
        option
      })
      break
    // 异步函数，不要包裹在 undoGrouping 里面
    case "completeSelected":
      actions[key]({
        content,
        nodes,
        option
      })
      break
    case "manageProfile":
      undoGroupingWithRefresh(() => void manageProfileAction({ nodes, option }))
      break
    default:
      undoGroupingWithRefresh(
        () =>
          void actions[key]({
            content,
            nodes,
            option
          })
      )
  }
}
