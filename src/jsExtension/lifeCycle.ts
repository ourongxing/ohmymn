import {
  alert,
  defineLifeCycelHandler,
  isfileExists,
  MN,
  openUrl,
  popup,
  showHUD
} from "marginnote"
import { Addon } from "~/addon"
import { defaultDataSource } from "~/dataSource"
import lang from "./lang"
import {
  defaultDocProfile,
  defaultGlobalProfile,
  defaultNotebookProfile,
  defaultTempProfile,
  Range,
  readProfile,
  removeProfile
} from "~/profile"
import SettingViewController from "~/SettingViewController"
import { deepCopy } from "~/utils"
import { removeLastCommentCacheTitle } from "./excerptHandler"
import { gestureHandlers } from "./handleGestureEvent"
import { eventHandlers } from "./handleReceivedEvent"
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

export default defineLifeCycelHandler({
  instanceMethods: {
    sceneWillConnect() {
      console.log("Open a new window", "lifeCycle")
      // Multiple windows will share global variables, so they need to be saved to self.
      self.panel = {
        status: false,
        lastOpenPanel: 0,
        lastClickButton: 0,
        lastReaderViewWidth: 0
      }
      self.addon = {
        key: Addon.key,
        title: Addon.title
      }
      self.metadata = {
        data: undefined,
        lastFetch: 0
      }
      self.excerptStatus = {
        isProcessNewExcerpt: false,
        isChangeExcerptRange: false,
        lastExcerptText: "😎",
        OCROnline: { times: 0, status: "free" },
        isModify: false,
        lastRemovedComment: undefined
      }
      self.isFirstOpenDoc = true
      self.customSelectedNodes = []
      self.globalProfile = deepCopy(defaultGlobalProfile)
      self.docProfile = deepCopy(defaultDocProfile)
      self.notebookProfile = deepCopy(defaultNotebookProfile)
      self.tempProfile = deepCopy(defaultTempProfile)
      self.dataSource = deepCopy(defaultDataSource)

      self.settingViewController = SettingViewController.new()
      self.settingViewController.addon = self.addon
      self.settingViewController.dataSource = self.dataSource
      self.settingViewController.profile = self.globalProfile
      self.settingViewController.docProfile = self.docProfile
      self.settingViewController.notebookProfile = self.notebookProfile
    },
    notebookWillOpen(notebookid: string) {
      console.log("Open a notebook", "lifeCycle")
      if (!self.isFirstOpenDoc)
        readProfile({
          range: Range.Notebook,
          notebookid
        })
      // Add hooks, aka observers
      eventHandlers.add()
      gestureHandlers().add()
    },
    documentDidOpen(docmd5: string) {
      // Switch document, read doc profile
      if (self.isFirstOpenDoc) {
        console.log("First open a document", "lifeCycle")
        self.isFirstOpenDoc = false
        readProfile({
          range: Range.All,
          docmd5,
          notebookid: MN.currnetNotebookid!
        })
      } else {
        readProfile({
          range: Range.Doc,
          docmd5
        })
      }
      console.log("Open a document", "lifeCycle")
    },
    notebookWillClose(notebookid: string) {
      console.log("Close a notebook", "lifeCycle")
      removeLastCommentCacheTitle()
      closePanel()
      // Remove hooks, aka observers
      eventHandlers.remove()
      gestureHandlers().remove()
    },
    documentWillClose(docmd5: string) {
      console.log("Close a document", "lifeCycle")
    },
    // Not triggered on ipad
    sceneDidDisconnect() {
      console.log("Close a window", "lifeCycle")
    },
    sceneWillResignActive() {
      // or go to the background
      console.log("Window is inactivation", "lifeCycle")
      removeLastCommentCacheTitle()
      // !MN.isMac && closePanel()
    },
    sceneDidBecomeActive() {
      layoutViewController()
      // or go to the foreground
      console.log("Window is activated", "lifeCycle")
    }
  },
  classMethods: {
    async addonWillDisconnect() {
      console.log("Addon disconected", "lifeCycle")
      const { option } = await popup(
        {
          title: Addon.title,
          message: lang.uninstall.have_bugs,
          buttons: lang.uninstall.$options2
        },
        ({ buttonIndex }) => ({
          option: buttonIndex
        })
      )
      switch (option) {
        case 0: {
          removeProfile()
          // clear to be a new scene
          self.isFirstOpenDoc = true
          // could not get the value of self.window
          showHUD(lang.uninstall.profile_reset, 2)
          break
        }
        case 1: {
          Addon.forum && openUrl(Addon.forum)
        }
      }
    },
    addonDidConnect() {
      console.log("Addon connected", "lifeCycle")
      if (
        !isfileExists(`${Addon.path}/AutoCompleteData.db`) &&
        isfileExists(`${Addon.path}/AutoCompleteData.zip`)
      ) {
        ZipArchive.unzipFileAtPathToDestination(
          `${Addon.path}/AutoCompleteData.zip`,
          Addon.path
        )
      }
    }
  }
})
