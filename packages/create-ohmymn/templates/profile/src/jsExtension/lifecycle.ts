import {
  defineLifecycleHandlers,
  openURL,
  popup,
  showHUD,
  StudyMode
} from "marginnote"
import { Addon } from "~/addon"
import { defaultDataSource } from "~/dataSource"
import lang from "./lang"
import {
  defaultDocProfile,
  defaultGlobalProfile,
  defaultNotebookProfile,
  Range,
  readProfile,
  removeProfile,
  writeProfile
} from "~/profile"
import SettingViewController from "~/SettingViewController"
import { deepCopy } from "~/utils"
import { eventObservers } from "./handleReceivedEvent"
import { closePanel, layoutViewController } from "./switchPanel"

/**
 * Addon life cycle
 * If you close the window directly, it will not trigger the closing of notebooks and documents
 * 1. Addon connected
 * 2. Open a new window
 * 3. Open a notebook
 * 4. Open a document
 * 5. Close a notebook
 * 6. Close a document
 * 7. Close a window
 */

export default defineLifecycleHandlers({
  instanceMethods: {
    sceneWillConnect() {
      self.useConsole = false
      self.addon = {
        key: Addon.key,
        title: Addon.title
      }
      MN.log("Open a new window", "lifecycle")
      // Multiple windows will share global variables, so they need to be saved to self.
      self.panel = {
        status: false,
        lastOpenPanel: 0,
        lastClickButton: 0,
        lastReaderViewWidth: 0
      }
      self.isFirstOpenDoc = true
      self.globalProfile = deepCopy(defaultGlobalProfile)
      self.docProfile = deepCopy(defaultDocProfile)
      self.notebookProfile = deepCopy(defaultNotebookProfile)
      self.dataSource = deepCopy(defaultDataSource)

      self.settingViewController = SettingViewController.new()
      self.settingViewController.addon = self.addon
      self.settingViewController.dataSource = self.dataSource
      self.settingViewController.globalProfile = self.globalProfile
      self.settingViewController.docProfile = self.docProfile
      self.settingViewController.notebookProfile = self.notebookProfile
    },
    notebookWillOpen(notebookid: string) {
      MN.log("Open a notebook", "lifecycle")
      if (MN.studyController.studyMode === StudyMode.review) return
      if (!self.isFirstOpenDoc) {
        readProfile({
          range: Range.Notebook,
          notebookid
        })
      }
      // Add hooks, aka observers
      eventObservers.add()
      if (MN.db.getNotebookById(notebookid)?.documents?.length === 0) {
        if (self.isFirstOpenDoc) {
          self.isFirstOpenDoc = false
          readProfile({
            range: Range.All,
            docmd5: "00000000",
            notebookid
          })
        } else {
          readProfile({
            range: Range.Doc,
            docmd5: "00000000"
          })
        }
      }
    },
    documentDidOpen(docmd5: string) {
      MN.log("Open a document", "lifecycle")
      if (MN.studyController.studyMode === StudyMode.review) return
      // Switch document, read doc profile
      if (self.isFirstOpenDoc) {
        MN.log("First open a document", "lifecycle")
        self.isFirstOpenDoc = false
        readProfile({
          range: Range.All,
          docmd5,
          notebookid: MN.currnetNotebookId!
        })
      } else {
        readProfile({
          range: Range.Doc,
          docmd5
        })
      }
    },
    notebookWillClose(notebookid: string) {
      MN.log("Close a notebook", "lifecycle")
      if (MN.studyController.studyMode === StudyMode.review) return
      writeProfile({
        range: Range.Notebook,
        notebookid
      })
      closePanel()
      // Remove hooks, aka observers
      eventObservers.remove()
    },
    documentWillClose(docmd5: string) {
      MN.log("Close a document", "lifecycle")
      if (MN.studyController.studyMode === StudyMode.review) return
      writeProfile({
        range: Range.Doc,
        docmd5
      })
    },
    // Not triggered on ipad
    sceneDidDisconnect() {
      MN.log("Close a window", "lifecycle")
      if (MN.isMac && MN.currentDocmd5 && MN.currnetNotebookId) {
        writeProfile({
          range: Range.All,
          docmd5: MN.currentDocmd5,
          notebookid: MN.currnetNotebookId
        })
      }
    },
    sceneWillResignActive() {
      // or go to the background
      MN.log("Window is inactivation", "lifecycle")
      if (!MN.isMac && MN.currentDocmd5 && MN.currnetNotebookId) {
        writeProfile({
          range: Range.All,
          docmd5: MN.currentDocmd5,
          notebookid: MN.currnetNotebookId
        })
      }
    },
    sceneDidBecomeActive() {
      !MN.isMac && layoutViewController()
      // or go to the foreground
      MN.log("Window is activated", "lifecycle")
    }
  },
  classMethods: {
    async addonWillDisconnect() {
      MN.log("Addon disconected", "lifecycle")
      const { buttonIndex: option } = await popup({
        title: Addon.title,
        message: lang.uninstall.have_bugs,
        buttons: lang.uninstall.$options2
      })
      switch (option) {
        case 0: {
          removeProfile()
          showHUD(lang.uninstall.profile_reset, 2)
          break
        }
        case 1: {
          Addon.forum && openURL(Addon.forum)
        }
      }
    },
    addonDidConnect() {
      MN.log("Addon connected", "lifecycle")
    }
  }
})
