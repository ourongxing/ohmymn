import { defineEventHandlers, eventObserverController } from "marginnote"

const events = ["AddonBroadcast"] as const

export const eventObservers = eventObserverController([...events])

export default defineEventHandlers<(typeof events)[number]>({
  async onAddonBroadcast(sender) {
    if (self.window !== MN.currentWindow) return
    MN.log("Addon broadcast", "event")
  }
})
