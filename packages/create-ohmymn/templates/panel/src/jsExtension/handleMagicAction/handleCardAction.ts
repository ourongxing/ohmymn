import { NodeNote } from "marginnote"
import { actions as actions } from "~/coreModule"
import { closePanel } from "../switchPanel"

export default async function (key: string, option: number, content: string) {
  const nodes = NodeNote.getSelectedNodes()
  switch (key) {
    default:
      await actions[key]({
        content,
        nodes,
        option
      })
  }
  closePanel()
}
