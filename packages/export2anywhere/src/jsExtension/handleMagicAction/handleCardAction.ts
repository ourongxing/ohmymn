import {
  HUDController,
  NodeNote,
  popup,
  showHUD,
  UIAlertViewStyle
} from "marginnote"
import { actions4card } from "~/coreModule"
import { PanelControl } from "~/modules/addon/typings"
import { manageProfileAction } from "~/profile"
import lang from "../lang"
import { closePanel } from "../switchPanel"

export default async function (key: string, option: number, content: string) {
  let nodes: NodeNote[] = []
  if (
    key != "filterCard" &&
    self.globalProfile.addon.panelControl.includes(PanelControl.CompleteClose)
  )
    closePanel()

  if (self.customSelectedNodes.length) {
    nodes = self.customSelectedNodes
    self.customSelectedNodes = []
    HUDController.hidden()
  } else {
    nodes = NodeNote.getSelectedNodes()
    if (key === "manageProfile") {
      if (option > 1) await manageProfileAction(nodes[0], option)
      else {
        if (!nodes.length) {
          showHUD(lang.not_select_card)
          return
        }
        await manageProfileAction(nodes[0], option)
      }
      return
    } else {
      if (!nodes.length) {
        showHUD(lang.not_select_card)
        return
      }
      // The need for the same level is to avoid the situation where both parent and descendant nodes are selected,
      // which leads to duplicate processing.
      const isHavingChildren = nodes.every(
        node =>
          nodes[0].parentNode?.nodeId === node.note.parentNote?.noteId &&
          node.childNodes.length
      )

      const notNeedSmartSelection =
        key === "renameTitle" && /#\[(.+)\]/.test(content)

      if (
        self.globalProfile.magicaction4card.smartSelection &&
        isHavingChildren &&
        !notNeedSmartSelection
      ) {
        const { buttonIndex: option } = await popup({
          title: lang.smart_select.title,
          message:
            nodes.length > 1
              ? lang.smart_select.cards_with_children
              : lang.smart_select.card_with_children,
          type: UIAlertViewStyle.Default,
          buttons: lang.smart_select.$option4,
          canCancel: false
        })

        if (option !== 0) {
          const { children, descendant, all } = nodes.reduce(
            (acc, node) => {
              const { descendant } = node.descendantNodes
              acc.descendant.push(...descendant)
              acc.children.push(...node.childNodes)
              acc.all.push(node, ...descendant)
              return acc
            },
            {
              children: [] as NodeNote[],
              descendant: [] as NodeNote[],
              all: [] as NodeNote[]
            }
          )
          nodes = [children, descendant, all][option - 1]
        }
      }
    }
  }

  switch (key) {
    case "filterCard":
      self.customSelectedNodes = actions4card.filterCard!({
        content,
        nodes,
        option
      })
      break
    default:
      await actions4card[key]({
        content,
        nodes,
        option
      })
  }
}
