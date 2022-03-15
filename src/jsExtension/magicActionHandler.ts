import lang from "lang"
import { actions4card, actions4text } from "synthesizer"
import { PanelControl } from "modules/addon/enum"
import checkInputCorrect from "inputChecker"
import type { IRowButton, MbBookNote } from "typings"
import { cellViewType, UIAlertViewStyle } from "typings/enum"
import { popup, showHUD, HUDController } from "utils/common"
import { manageProfileAction } from "utils/profile"
import { closePanel } from "./switchPanel"
import {
  getSelectNodes,
  getNodeTree,
  undoGroupingWithRefresh
} from "utils/note"
import { MN } from "const"

export default async (
  type: "card" | "text",
  row: IRowButton,
  option?: number
) => {
  if (option !== undefined)
    await handleMagicAction(type, row.key, option, undefined)
  else
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
            await handleMagicAction(type, row.key, option!, content)
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
        await handleMagicAction(type, row.key, option!)
    }
}

const handleMagicAction = async (
  type: "card" | "text",
  key: string,
  option: number,
  content = ""
) => {
  if (type === "text") {
    const documentController =
      MN.studyController().readerController.currentDocumentController
    if (!documentController.selectionText) {
      showHUD("没有选择任何文字")
      return
    }
    actions4text[key]({
      text: documentController.selectionText,
      imgBase64: documentController.imageFromSelection().base64Encoding(),
      option
    })
  } else if (type === "card") {
    let nodes: MbBookNote[] = []
    key != "filterCards" &&
      self.profile.addon.panelControl.includes(PanelControl.CompleteClose) &&
      closePanel()

    if (self.customSelectedNodes.length) {
      nodes = self.customSelectedNodes
      self.customSelectedNodes = []
      HUDController.hidden()
    } else {
      nodes = getSelectNodes()
      if (!nodes.length) {
        showHUD(lang.magic_action_handler.not_selected)
        return
      }
      // 需要同层级是为了避免出现同时选中父节点和后代节点的情况，从而导致重复处理。
      const isHavingChildren = nodes.every(
        node =>
          nodes[0].parentNote === node.parentNote && node?.childNotes?.length
      )

      const noNeedSmartSelection =
        key === "renameTitle" && /#\[(.+)\]/.test(content)

      const { smart_select } = lang.magic_action_handler
      if (
        self.profile.magicaction4card.smartSelection &&
        isHavingChildren &&
        !noNeedSmartSelection
      ) {
        const { option } = await popup(
          smart_select.title,
          nodes.length > 1
            ? smart_select.cards_with_children
            : smart_select.card_with_children,
          UIAlertViewStyle.Default,
          smart_select.option,
          (alert: UIAlertView, buttonIndex: number) => ({
            option: buttonIndex
          })
        )

        if (option) {
          const { onlyChildren, onlyFirstLevel, allNodes } = nodes
            .slice(1)
            .reduce((acc, node) => {
              const { onlyChildren, onlyFirstLevel, allNodes } =
                getNodeTree(node)
              acc.allNodes.push(...allNodes)
              acc.onlyChildren.push(...onlyChildren)
              acc.onlyFirstLevel.push(...onlyFirstLevel)
              return acc
            }, getNodeTree(nodes[0]))
          nodes = [onlyFirstLevel, onlyChildren, allNodes][option - 1]
        }
      }
    }
    switch (key) {
      case "filterCards":
        self.customSelectedNodes = actions4card.filterCards!({
          content,
          nodes,
          option
        })
        break
      // 异步函数，不要包裹在 undoGrouping 里面
      case "completeSelected":
        actions4card[key]({
          content,
          nodes,
          option
        })
        break
      case "manageProfile":
        undoGroupingWithRefresh(
          () => void manageProfileAction({ nodes, option })
        )
        break
      default:
        undoGroupingWithRefresh(
          () =>
            void actions4card[key]({
              content,
              nodes,
              option
            })
        )
    }
  }
}
