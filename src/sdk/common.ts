import { lang } from "./lang"
import { MN } from "./mn"

const console = {
  log(obj: any, suffix = "normal") {
    JSB.log(`${self.addon?.key ?? "marginnote"}-${suffix} %@`, obj)
  },
  error(obj: any, suffix = "error") {
    JSB.log(
      `${self.addon?.key ?? "marginnote"}-${suffix} %@`,
      String(obj) === "[object Object]"
        ? JSON.stringify(obj, undefined, 2)
        : String(obj)
    )
  },
  /** Unrelated to the real meaning, used for stringify objects */
  assert(obj: any, suffix = "normal") {
    JSB.log(
      `${self.addon?.key ?? "marginnote"}-${suffix} %@`,
      JSON.stringify(obj, undefined, 2)
    )
  }
}

function showHUD(message: string, duration = 2, window = self.window) {
  MN.app.showHUD(message, window, duration)
}

const HUDController = {
  show(message: string, window = self.window) {
    MN.app.waitHUDOnView(message, window)
  },
  hidden(window = self.window) {
    MN.app.stopWaitHUDOnView(window)
  }
}

function getLocalDataByKey(key: string) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

function setLocalDataByKey(data: any, key: string) {
  NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)
}

function alert(message: string) {
  MN.app.alert(message)
}

function getObjCClassDeclar(name: string, type: string) {
  return `${name} : ${type}`
}

function evaluateJavaScript(webView: UIWebView, script: string) {
  return new Promise<string>(resolve =>
    webView.evaluateJavaScript(script, resolve)
  )
}

function openUrl(url: string) {
  MN.app.openURL(NSURL.URLWithString(encodeURI(url)))
}

function postNotification(key: string, userInfo: any) {
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
    key,
    self,
    userInfo
  )
}

function isThisWindow(sender: any, window = self.window) {
  return MN.app.checkNotifySenderInWindow(sender, window)
}

function isOCNull(obj: any): obj is OCNull {
  return obj === NSNull.new()
}

function OCNull2null<T>(k: T) {
  return isOCNull(k) ? null : (k as Exclude<T, OCNull>)
}

function eventHandlerController(
  handlerList: ({ event: string; handler?: string } | string)[],
  addonKey: string
): {
  add: () => void
  remove: () => void
} {
  const add = () => {
    handlerList.forEach(v => {
      v = typeof v == "string" ? { event: v } : v
      NSNotificationCenter.defaultCenter().addObserverSelectorName(
        self,
        v.handler
          ? `${v.handler}:`
          : v.event.includes(addonKey)
          ? `on${v.event.replace(addonKey, "")}:`
          : `on${v.event}:`,
        v.event
      )
    })
  }
  const remove = () => {
    handlerList.forEach(v => {
      NSNotificationCenter.defaultCenter().removeObserverName(
        self,
        typeof v == "string" ? v : v.event
      )
    })
  }
  return { add, remove }
}

function copy(text: string, hud = true) {
  if (text) {
    UIPasteboard.generalPasteboard().string = text.trim()
    hud && showHUD(lang.copy_success)
  } else hud && showHUD(lang.copy_empty)
}

export {
  console,
  showHUD,
  HUDController,
  alert,
  getObjCClassDeclar,
  openUrl,
  postNotification,
  isThisWindow,
  isOCNull,
  OCNull2null,
  eventHandlerController,
  copy,
  evaluateJavaScript,
  getLocalDataByKey,
  setLocalDataByKey
}
