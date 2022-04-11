import settingViewControllerInst from "settingViewController"
import { Range, readProfile, removeProfile, writeProfile } from "utils/profile"
import { getObjCClassDeclar, showHUD } from "utils/common"
import { closePanel, layoutViewController } from "./switchPanel"
import { docProfilePreset, profilePreset, profileTempPreset } from "profile"
import { removeLastCommentCacheTitle } from "./excerptHandler"
import { gestureHandlers } from "./handleGestureEvent"
import { eventHandlers } from "./handleReceivedEvent"
import { dataSourcePreset } from "dataSource"
import { UIWindow } from "typings"
import { deepCopy } from "utils"
import lang from "lang"
import { MN } from "const"

const SettingViewController = JSB.defineClass(
  getObjCClassDeclar("SettingViewController", "UITableViewController"),
  settingViewControllerInst
)

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

/** Cache window */
let _window: UIWindow

const addonDidConnect = () => {
  console.log("Addon connected", "lifeCycle")
}

const sceneWillConnect = () => {
  console.log("Open a new window", "lifeCycle")
  _window = self.window
  // Multiple windows will share global variables, so they need to be saved to self.
  self.panelStatus = false
  self.profile = deepCopy(profilePreset)
  self.docProfile = deepCopy(docProfilePreset)
  self.profileTemp = deepCopy(profileTempPreset)
  self.dataSource = deepCopy(dataSourcePreset)
  self.OCROnline = { times: 0, status: "free" }
  self.customSelectedNodes = []
  self.settingViewController = new SettingViewController()
  self.settingViewController.dataSource = self.dataSource
  self.settingViewController.window = self.window
  self.settingViewController.profile = self.profile
  self.settingViewController.docProfile = self.docProfile
}

const notebookWillOpen = (notebookid: string) => {
  console.log("Open a notebook", "lifeCycle")
  self.notebookid = notebookid
  // Add hooks, aka observers
  eventHandlers.add()
  gestureHandlers().add()
}

const documentDidOpen = (docmd5: string) => {
  // Switch docment
  if (self.docMD5) readProfile(Range.Doc, docmd5)
  else {
    readProfile(Range.First, docmd5)
    UIApplication.sharedApplication().idleTimerDisabled =
      self.profile.addon.screenAlwaysOn
  }
  // if (MN.db.getDocumentById(docmd5)?.textContentsForPageNo(1).length)
  //   showHUD("识别出来了")
  // else showHUD("没有文字层")
  console.log("Open a document", "lifeCycle")
  self.docMD5 = docmd5
}

const notebookWillClose = (notebookid: string) => {
  console.log("Close a notebook", "lifeCycle")
  closePanel()
  // Remove hooks, aka observers
  eventHandlers.remove()
  gestureHandlers().remove()
}

const documentWillClose = (docmd5: string) => {
  console.log("Close a document", "lifeCycle")
  removeLastCommentCacheTitle()
  writeProfile(docmd5)
}

// Not triggered on ipad
const sceneDidDisconnect = () => {
  console.log("Close a window", "lifeCycle")
  if (self.docMD5) writeProfile(self.docMD5)
}

const addonWillDisconnect = () => {
  console.log("Addon disconected", "lifeCycle")
  // could not get the value of self.window
  showHUD(lang.disconnect_addon, 2, _window)
  removeProfile()
}

const sceneWillResignActive = () => {
  // or go to the background
  console.log("Window is inactivation", "lifeCycle")
  removeLastCommentCacheTitle()
  !MN.isMac && closePanel()
  if (self.docMD5) writeProfile(self.docMD5)
}

const sceneDidBecomeActive = () => {
  layoutViewController()
  // or go to the foreground
  console.log("Window is activated", "lifeCycle")
}

export const clsMethons = {
  addonWillDisconnect
}

export default {
  sceneWillConnect,
  notebookWillOpen,
  documentDidOpen,
  notebookWillClose,
  documentWillClose,
  sceneDidDisconnect,
  sceneWillResignActive,
  sceneDidBecomeActive
}
