import settingViewControllerInst from "settingViewController/main"
import eventHandlerController from "utils/eventHandlers"
import { readProfile, saveProfile } from "utils/readsaveProfile";
import { getObjCClassDeclar, log, showHUD } from "utils/public"
import { closePanel } from "./switchPanel";

const SettingViewController = JSB.defineClass(getObjCClassDeclar("SettingViewController", "UITableViewController"), settingViewControllerInst)
const eventCtrl = eventHandlerController([
    { event: "InputOver" },
    { event: "SwitchChange" },
    { event: "ButtonClick" },
    { event: "ProcessNewExcerpt", handler: "onProcessExcerptText" },
    { event: "ChangeExcerptRange", handler: "onProcessExcerptText" }
]);

// 打开 MN，可以用来初始化
const sceneWillConnect = () => {
    log("打开 MN", "lifeCycle")
    self.studyController = Application.sharedInstance().studyController(self.window)
    self.settingViewController = SettingViewController.new()
    self.settingViewController.window = self.window
}

// 关闭 MN，不会调用关闭笔记本和关闭文档的方法
// iPad 上不生效
const sceneDidDisconnect = () => {
    log("关闭 MN", "lifeCycle")
    log("保存所有配置", "profile")
    // 总要打开文档再关闭 MN 才会保存配置吧
    if (thisDocMd5) saveProfile(thisDocMd5, true)
}

let lastOpenNotebook = 0
// 打开笔记本
const notebookWillOpen = (notebookid: string) => {
    log("打开笔记本", "lifeCycle")
    lastOpenNotebook = new Date().getTime()
    eventCtrl.add()
}

// 关闭笔记本
const notebookWillClose = (notebookid: string) => {
    log("关闭笔记本", "lifeCycle")
    // 关闭面板
    closePanel()
    eventCtrl.remove()
}

let lastCloseDoc = 0
const documentDidOpen = (docmd5: string) => {
    log("打开文档", "lifeCycle")
    thisDocMd5 = docmd5
    const now = new Date().getTime()
    // 打开书，如果关书和打开书的间隔在一定时间内，则为换书
    if (lastCloseDoc && now - lastCloseDoc < 300) {
        log("读取当前文档的配置", "profile")
        readProfile(docmd5)
        closePanel()
    }
    // 如果打开笔记本和打开书的间隔在一定时间内，并且从来没有关闭过文档，说明是此次
    // 打开 MN 第一次打开笔记本，此时读取全部配置，其余时间均只读取文档配置
    if (!lastCloseDoc && lastOpenNotebook && now - lastOpenNotebook < 300) {
        log("读取所有配置", "profile")
        readProfile(docmd5, true)
    }
}

// 关闭文档，为了在关闭 MN 时，也能保存文档的配置
let thisDocMd5 = ""
const documentWillClose = (docmd5: string) => {
    log("关闭文档", "lifeCycle")
    lastCloseDoc = new Date().getTime()
    log("保存当前文档配置", "profile")
    saveProfile(docmd5)
}

const addonDidConnect = () => {
    log("插件启用", "lifeCycle")
}

// 清空配置文件，如果出现问题可以关闭再打开插件开关，重启即可
const addonWillDisconnect = () => {
    log("插件停用", "lifeCycle")
    // 清空配置，很遗憾，在 iPad 上，更新插件也会触发，导致配置被清空，所以只支持 Mac 端
    if (Application.sharedInstance().osType == 2) {
        NSUserDefaults.standardUserDefaults().removeObjectForKey("marginnote_ohmymn_profile_global")
        NSUserDefaults.standardUserDefaults().removeObjectForKey("marginnote_ohmymn_profile_doc")
    }
}

// 进入后台保存配置，适合 iPad 上
const applicationDidEnterBackground = () => {
    log("应用进入后台", "lifeCycle")
    log("保存所有配置", "profile")
    if (thisDocMd5) saveProfile(thisDocMd5, true)
}

const applicationWillEnterForeground = () => {
    log("应用进入前台", "lifeCycle")
    log("读取当前文档配置", "profile")
    if (thisDocMd5) readProfile(thisDocMd5)
}

export const clsMethons = {
    addonDidConnect,
    addonWillDisconnect,
    applicationDidEnterBackground,
    applicationWillEnterForeground
}

export const InstMethods = {
    sceneWillConnect,
    sceneDidDisconnect,
    notebookWillOpen,
    notebookWillClose,
    documentDidOpen,
    documentWillClose
}