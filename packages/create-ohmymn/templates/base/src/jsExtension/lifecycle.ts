import { defineLifecycleHandlers, getLocalDataByKey } from "marginnote"
import { Addon } from "~/addon"
import { eventObservers } from "./handleReceivedEvent"

export default defineLifecycleHandlers({
  instanceMethods: {
    sceneWillConnect() {
      self.useConsole = false
      self.addon = {
        key: Addon.key,
        title: Addon.title
      }
      MN.log("Open a new window", "lifecycle")
      const status = getLocalDataByKey(Addon.key)
      self.panel = {
        status: status ?? false
      }
    },
    notebookWillOpen(notebookid: string) {
      MN.log("Open a notebook", "lifecycle")
      eventObservers.add()
    },
    documentDidOpen(docmd5: string) {
      MN.log("Open a document", "lifecycle")
    },
    notebookWillClose(notebookid: string) {
      MN.log("Close a notebook", "lifecycle")
      eventObservers.remove()
    },
    documentWillClose(docmd5: string) {
      MN.log("Close a document", "lifecycle")
    },
    // Not triggered on ipad
    sceneDidDisconnect() {
      MN.log("Close a window", "lifecycle")
    },
    sceneWillResignActive() {
      // or go to the background
      MN.log("Window is inactivation", "lifecycle")
    },
    sceneDidBecomeActive() {
      // or go to the foreground
      MN.log("Window is activated", "lifecycle")
    }
  },
  classMethods: {
    addonWillDisconnect() {
      MN.log("Addon disconected", "lifecycle")
    },
    addonDidConnect() {
      MN.log("Addon connected", "lifecycle")
    }
  }
})
