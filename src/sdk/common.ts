import { Addon } from "~/addon"
import { lang } from "./lang"

const console = {
  log(obj: any, suffix = "normal") {
    JSB.log(`${Addon.key}-${suffix} %@`, obj)
  },
  error(obj: any, suffix = "error") {
    JSB.log(
      `${Addon.key}-${suffix} %@`,
      String(obj) === "[object Object]"
        ? JSON.stringify(obj, undefined, 2)
        : String(obj)
    )
  },
  /** Unrelated to the real meaning, used for stringify objects */
  assert(obj: any, suffix = "normal") {
    JSB.log(`${Addon.key}-${suffix} %@`, JSON.stringify(obj, undefined, 2))
  }
}

function showHUD(message: string, duration = 2, window = self.window) {
  Application.sharedInstance().showHUD(message, window, duration)
}

const HUDController = {
  show(message: string, window = self.window) {
    Application.sharedInstance().waitHUDOnView(message, window)
  },
  hidden(window = self.window) {
    Application.sharedInstance().stopWaitHUDOnView(window)
  }
}

function alert(message: string) {
  Application.sharedInstance().alert(message)
}

function getObjCClassDeclar(
  name: string,
  type: string,
  delegate: Array<string> = []
) {
  let str = `${name} : ${type}`
  if (delegate.length) {
    delegate.forEach(value => {
      str = `${str} ${value}Delegate`
    })
  }
  return str
}

function evaluateJavaScript(webView: UIWebView, script: string) {
  return new Promise<string>(resolve =>
    webView.evaluateJavaScript(script, resolve)
  )
}

function openUrl(url: string) {
  Application.sharedInstance().openURL(NSURL.URLWithString(encodeURI(url)))
}

function postNotification(key: string, userInfo: any) {
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
    key,
    self,
    userInfo
  )
}

function isThisWindow(sender: any, window = self.window) {
  return Application.sharedInstance().checkNotifySenderInWindow(sender, window)
}

function isOCNull(obj: any): obj is OCNull {
  return obj === NSNull.new()
}

function OCNull2null<T>(k: T) {
  return isOCNull(k) ? null : (k as Exclude<T, OCNull>)
}

function eventHandlerController(
  handlerList: ({ event: string; handler?: string } | string)[]
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
          : v.event.includes(Addon.key)
          ? `on${v.event.replace(Addon.key, "")}:`
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
  UIPasteboard.generalPasteboard().string = text.trim()
  hud && showHUD(lang.copy_success)
}

function isfileExists(path: string) {
  return NSFileManager.defaultManager().fileExistsAtPath(path)
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
  isfileExists
}
