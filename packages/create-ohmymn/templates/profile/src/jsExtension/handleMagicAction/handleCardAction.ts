import {
  HUDController,
  NodeNote,
  popup,
  showHUD,
  UIAlertViewStyle,
  undoGroupingWithRefresh
} from "marginnote"
import { actions as actions } from "~/coreModule"
import { PanelControl } from "~/modules/addon/typings"
import { manageProfileAction } from "~/profile"
import lang from "../lang"
import { closePanel } from "../switchPanel"

export default async function (key: string, option: number, content: string) {
  const nodes = NodeNote.getSelectedNodes()
  switch (key) {
    case "manageProfile":
      if (option > 1) await manageProfileAction(nodes[0], option)
      else {
        if (!nodes.length) {
          showHUD(lang.not_select_card)
          return
        }
        await manageProfileAction(nodes[0], option)
      }
      return
    default:
      await actions[key]({
        content,
        nodes,
        option
      })
  }
  closePanel()
}
