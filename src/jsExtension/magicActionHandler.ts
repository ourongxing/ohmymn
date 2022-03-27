import lang from "lang"
import { actions4card, actions4text, moduleKeyArray } from "synthesizer"
import { PanelControl } from "modules/addon/enum"
import { checkInputCorrect } from "synthesizer"
import type { IRowButton, MbBookNote } from "typings"
import { CellViewType, UIAlertViewStyle } from "typings/enum"
import { popup, showHUD, HUDController } from "utils/common"
import { manageProfileAction } from "utils/profile"
import { closePanel } from "./switchPanel"
import {
  getSelectNodes,
  getNodeTree,
  undoGroupingWithRefresh
} from "utils/note"
import { MN } from "const"
import { getMNLinkValue } from "utils/input"
import autoocr from "modules/autoocr"

export default async (
  type: "card" | "text",
  row: IRowButton,
  option?: number
) => {
  if (option !== undefined)
    await handleMagicAction(type, row.key, option, undefined)
  else
    switch (row.type) {
      case CellViewType.ButtonWithInput:
        for (;;) {
          const { option, content } = await popup(
            row.label,
            row.help ?? "",
            UIAlertViewStyle.PlainTextInput,
            row.option ? row.option : [lang.sure],
            (alert: UIAlertView, buttonIndex: number) => {
              // It is better to have only two options, because then the last option will be automatically selected after the input
              return {
                content: alert.textFieldAtIndex(0).text,
                option: buttonIndex
              }
            }
          )
          const text = content ? getMNLinkValue(content) : ""
          // Allowed to be empty
          if (
            text === "" ||
            (text && (await checkInputCorrect(text, row.key)))
          ) {
            await handleMagicAction(type, row.key, option!, text)
            return
          }
        }
      case CellViewType.Button:
        const { option } = await popup(
          row.label,
          row.help ?? "",
          UIAlertViewStyle.Default,
          row.option ?? [lang.sure],
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
  try {
    if (type === "text") {
      const documentController =
        MN.studyController().readerController.currentDocumentController
      const imageFromSelection = documentController
        .imageFromSelection()
        ?.base64Encoding()
      if (!imageFromSelection) {
        showHUD(lang.not_select_text, 2)
        return
      }
      const text =
        self.docProfile.magicaction4text.preOCR &&
        self.profile.addon.quickSwitch.includes(
          moduleKeyArray.indexOf("autoocr")
        )
          ? (await autoocr.utils.main(imageFromSelection)) ??
            documentController.selectionText ??
            ""
          : documentController.selectionText ?? ""

      if (!text) {
        showHUD(lang.no_text_selection, 2)
        return
      }

      actions4text[key]({
        text,
        imgBase64: imageFromSelection,
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
          showHUD(lang.not_select_card)
          return
        }
        // The need for the same level is to avoid the situation where both parent and descendant nodes are selected,
        // which leads to duplicate processing.
        const isHavingChildren = nodes.every(
          node =>
            nodes[0].parentNote === node.parentNote && node?.childNotes?.length
        )

        const noNeedSmartSelection =
          key === "renameTitle" && /#\[(.+)\]/.test(content)

        const { smart_select } = lang
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
        case "manageProfile":
          undoGroupingWithRefresh(
            () => void manageProfileAction({ nodes, option })
          )
          break
        default:
          // Promise can not be placed in undoGroupingWithRefresh()
          if (actions4card[key] instanceof Promise)
            actions4card[key]({
              content,
              nodes,
              option
            })
          else
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
  } catch (err) {
    console.error(String(err))
  }
}
