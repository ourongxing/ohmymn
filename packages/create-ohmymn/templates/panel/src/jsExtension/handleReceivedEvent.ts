import {
  defineEventHandlers,
  eventObserverController,
  showHUD,
  StudyMode
} from "marginnote"
import { Addon } from "~/addon"
import { layoutViewController } from "~/JSExtension/switchPanel"
import { saveProfile } from "~/profile"
import handleMagicAction from "./handleMagicAction"
import lang from "./lang"

const panelEvents = [
  { event: Addon.key + "InputOver", handler: "onInputOver" },
  { event: Addon.key + "ButtonClick", handler: "onButtonClick" },
  { event: Addon.key + "SelectChange", handler: "onSelectChange" },
  { event: Addon.key + "SwitchChange", handler: "onSwitchChange" }
] as const

const events = ["AddonBroadcast"] as const

export const eventObservers = eventObserverController([
  ...panelEvents,
  ...events
])

export default defineEventHandlers<
  (typeof events)[number] | (typeof panelEvents)[number]["handler"]
>({
  async onButtonClick(sender) {
    if (self.window !== MN.currentWindow) return
    // For magicaction
    MN.log("Click a button", "event")
    const { row, type } = sender.userInfo
    await handleMagicAction(type, row)
  },
  async onSwitchChange(sender) {
    if (self.window !== MN.currentWindow) return
    MN.log("Switch the switch", "event")
    const { name, key, status } = sender.userInfo
    await saveProfile(name, key, status)
  },
  async onSelectChange(sender) {
    if (self.window !== MN.currentWindow) return
    MN.log("Change the selection", "event")
    const { name, key, selections } = sender.userInfo
    switch (key) {
      case "panelPosition":
        layoutViewController(undefined, selections[0])
        break
      case "panelHeight":
        layoutViewController(selections[0])
        break
    }
    await saveProfile(name, key, selections)
  },
  async onInputOver(sender) {
    if (self.window !== MN.currentWindow) return
    MN.log("Input", "event")
    const { name, key, content } = sender.userInfo
    showHUD(content ? lang.input_saved : lang.input_clear)
    await saveProfile(name, key, content)
  },
  async onAddonBroadcast(sender) {
    // 需要点击卡片才能锁定到当前窗口
    if (self.window !== MN.currentWindow) return
    if (MN.studyController.studyMode === StudyMode.review) return
    MN.log("Addon broadcast", "event")
    const { message } = sender.userInfo
    MN.log(sender.userInfo)
    const params = message.replace(new RegExp(`^${Addon.key}\\?`), "")
    if (message !== params) {
      // await handleURLScheme(params)
    }
  }
})
