import { Addon, MN } from "~/const"
import lang from "~/lang"
import { PanelControl } from "~/modules/addon/typings"
import { mainOCR as autoocr } from "~/modules/autoocr/utils"
import {
  checkInputCorrect,
  moduleKeys,
  actions4text,
  actions4card
} from "~/synthesizer"
import { IRowButton, MbBookNote } from "~/typings"
import { CellViewType, UIAlertViewStyle } from "~/typings/enum"
import { showHUD, HUDController } from "~/utils/common"
import {
  getSelectNodes,
  getNodeTree,
  undoGroupingWithRefresh
} from "~/utils/note"
import popup from "~/utils/popup"
import { getMNLinkValue, manageProfileAction } from "~/utils/profile"
import handleTextAction from "./handleTextAction"
import { closePanel } from "./switchPanel"

export default async (
  type: "card" | "text",
  row: IRowButton,
  option?: number
) => {
  if (option !== undefined)
    await handleMagicAction({ type, key: row.key, option })
  else
    switch (row.type) {
      case CellViewType.ButtonWithInput:
        while (1) {
          const { option, content } = await popup(
            {
              title: row.label,
              message: row.help ?? "",
              type: UIAlertViewStyle.PlainTextInput,
              // It is better to have only two options, because then the last option will be automatically selected after the input
              buttons: row.option ? row.option : [lang.sure]
            },
            ({ alert, buttonIndex }) => ({
              content: alert.textFieldAtIndex(0).text,
              option: buttonIndex
            })
          )
          if (option === -1) return
          const text = content ? getMNLinkValue(content) : ""
          // Allowed to be empty
          if (
            text === "" ||
            (text && (await checkInputCorrect(text, row.key)))
          ) {
            await handleMagicAction({
              type,
              key: row.key,
              option,
              content: text
            })
            return
          }
        }
      case CellViewType.Button:
        const { option } = await popup(
          {
            title: row.label,
            message: row.help ?? "",
            type: UIAlertViewStyle.Default,
            buttons: row.option ?? [lang.sure]
          },
          ({ buttonIndex }) => ({
            option: buttonIndex
          })
        )
        if (option === -1) return
        await handleMagicAction({
          type,
          key: row.key,
          option
        })
    }
}

const handleMagicAction = async ({
  type,
  key,
  option,
  content = ""
}: {
  type: "card" | "text"
  key: string
  option: number
  content?: string
}) => {
  try {
    if (type === "text") {
      const { currentDocumentController } =
        MN.studyController().readerController
      const imageFromSelection = currentDocumentController
        .imageFromSelection()
        ?.base64Encoding()
      if (!imageFromSelection) {
        showHUD(lang.not_select_text, 2)
        return
      }
      const text = self.docProfile.magicaction4text.preOCR
        ? (await autoocr(imageFromSelection)) ??
          currentDocumentController.selectionText ??
          ""
        : currentDocumentController.selectionText ?? ""

      const res: string | undefined = await actions4text[key]({
        text,
        imgBase64: imageFromSelection,
        option
      })
      res && (await handleTextAction(res, key))
    } else if (type === "card") {
      let nodes: MbBookNote[] = []
      key != "filterCards" &&
        self.globalProfile.addon.panelControl.includes(
          PanelControl.CompleteClose
        ) &&
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

        if (
          self.globalProfile.magicaction4card.smartSelection &&
          isHavingChildren &&
          !noNeedSmartSelection
        ) {
          const { option } = await popup(
            {
              title: lang.smart_select.title,
              message:
                nodes.length > 1
                  ? lang.smart_select.cards_with_children
                  : lang.smart_select.card_with_children,
              type: UIAlertViewStyle.Default,
              buttons: lang.smart_select.option,
              canCancel: false
            },
            ({ buttonIndex }) => ({
              option: buttonIndex
            })
          )

          if (option !== 0) {
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
          await manageProfileAction(nodes[0], option)
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
