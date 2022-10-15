import {
  MbBookNote,
  HUDController,
  getSelectNodes,
  showHUD,
  popup,
  UIAlertViewStyle,
  getNodeTree,
  undoGroupingWithRefresh
} from "marginnote"
import { actions4card } from "~/merged"
import { PanelControl } from "~/modules/addon/typings"
import { manageProfileAction } from "~/profile"
import lang from "../lang"
import { closePanel } from "../switchPanel"

export default async function (key: string, option: number, content: string) {
  let nodes: MbBookNote[] = []
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
    nodes = getSelectNodes()
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
            buttons: lang.smart_select.$option4,
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
      undoGroupingWithRefresh(() => {
        actions4card[key]({
          content,
          nodes,
          option
        })
      })
  }
}
