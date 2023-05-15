import { setLocalDataByKey } from "marginnote"
import { Addon } from "~/addon"

export function closePanel() {
  if (!self.panel.status) return
  self.panel.status = false
  MN.studyController.refreshAddonCommands()
  setLocalDataByKey(false, Addon.key)
}

export function openPanel() {
  if (self.panel.status) return
  self.panel.status = true
  MN.studyController.refreshAddonCommands()
  setLocalDataByKey(true, Addon.key)
}

/**
 * 点击插件按钮时触发
 */
export function switchPanel() {
  if (self.panel.status) closePanel()
  else openPanel()
}

function queryAddonCommandStatus() {
  return MN.currnetNotebookId &&
    MN.currentDocmd5 &&
    MN.currentDocmd5 !== "00000000"
    ? {
        image: "logo.png",
        object: self,
        selector: "switchPanel:",
        checked: self.panel.status
      }
    : null
}

export default {
  queryAddonCommandStatus,
  switchPanel
}
