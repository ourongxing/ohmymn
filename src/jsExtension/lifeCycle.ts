import settingViewControllerInst from "settingViewController/main"
import { Range, readProfile, removeProfile, saveProfile } from "utils/profile"
import { getObjCClassDeclar, showHUD } from "utils/common"
import { closePanel, layoutViewController } from "./switchPanel"
import { docProfilePreset, profilePreset, profileTempPreset } from "profile"
import { gestureHandlers } from "./handleGestureEvent"
import { eventHandlers } from "./handleReceivedEvent"
import lang from "lang"
import { dataSourcePreset } from "synthesizer"
import { deepCopy } from "utils"

const SettingViewController = JSB.defineClass(
  getObjCClassDeclar("SettingViewController", "UITableViewController"),
  settingViewControllerInst
)

/**
 * MN 的生命周期有点离谱，尤其是先关闭笔记本再关闭文档，
 * 如果直接关闭窗口，是不会触发关闭笔记本和文档的
 * 1. 启用插件
 * 2. 打开窗口
 * 3. 打开笔记本
 * 4. 打开文档
 * 5. 关闭笔记本
 * 6. 关闭文档
 * 7. 关闭窗口
 */

// 打开窗口，可以用来初始化
const sceneWillConnect = () => {
  console.log("打开窗口", "lifeCycle")
  // 面板和按键状态
  self.panelStatus = false
  self.profile = deepCopy(profilePreset)
  self.docProfile = deepCopy(docProfilePreset)
  self.profileTemp = deepCopy(profileTempPreset)
  self.dataSource = deepCopy(dataSourcePreset)
  self.settingViewController = new SettingViewController()
  self.settingViewController.dataSource = self.dataSource
  self.settingViewController.window = self.window
}

// 关闭窗口，不会调用关闭笔记本和关闭文档的方法
// iPad 上不触发，切换到后台可以
const sceneDidDisconnect = () => {
  console.log("关闭窗口", "lifeCycle")
  // 只要打开过文档，再关闭窗口就保存
  if (self.docMD5) saveProfile(self.docMD5)
}

// 打开笔记本
const notebookWillOpen = (notebookid: string) => {
  console.log("打开笔记本", "lifeCycle")
  self.notebookid = notebookid
  eventHandlers.add()
  gestureHandlers.add()
}

// 关闭笔记本
const notebookWillClose = (notebookid: string) => {
  console.log("关闭笔记本", "lifeCycle")
  closePanel()
  eventHandlers.remove()
  gestureHandlers.remove()
}

const documentDidOpen = (docmd5: string) => {
  // 如果 docMD5 有值，说明是换书，反正不是第一次打开书
  if (self.docMD5) readProfile(Range.doc, docmd5)
  // 如果 docMD5 没有值，说明是刚打开 MN
  else {
    readProfile(Range.first, docmd5)
    UIApplication.sharedApplication().idleTimerDisabled =
      self.profile.ohmymn.screenAlwaysOn
  }
  console.log("打开文档", "lifeCycle")
  self.docMD5 = docmd5
}

// 关闭文档
const documentWillClose = (docmd5: string) => {
  console.log("关闭文档", "lifeCycle")
  saveProfile(docmd5)
}

const addonDidConnect = () => {
  console.log("插件启用", "lifeCycle")
}

// 清空配置文件，如果出现问题可以关闭再打开插件开关，重启即可
const addonWillDisconnect = () => {
  console.log("插件停用", "lifeCycle")
  showHUD(lang.addon_life_cycle.remove, 2)
  removeProfile()
}

const sceneWillResignActive = () => {
  console.log("应用进入后台", "lifeCycle")
  if (self.docMD5) saveProfile(self.docMD5)
}

const sceneDidBecomeActive = () => {
  layoutViewController()
  console.log("应用进入前台", "lifeCycle")
}

export const clsMethons = {
  addonWillDisconnect
}

export default {
  sceneWillConnect,
  sceneDidDisconnect,
  sceneWillResignActive,
  sceneDidBecomeActive,
  notebookWillClose,
  documentWillClose,
  notebookWillOpen,
  documentDidOpen
}
