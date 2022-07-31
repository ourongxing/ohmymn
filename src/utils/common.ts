import { Addon } from "~/const"
import lang from "~/lang"
import { Timer } from "~/typings"

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

function delay(sec: number) {
  return new Promise(resolve =>
    NSTimer.scheduledTimerWithTimeInterval(sec, false, resolve)
  )
}

async function delayBreak(
  times: number,
  sec: number,
  f: () => boolean
): Promise<boolean> {
  for (let i = 0; i < times; i++) {
    if (f()) return true
    await delay(sec)
  }
  return false
}

async function setTimeInterval(sec: number, f: () => any): Promise<Timer> {
  const setTimer = async (
    sec: number,
    f: () => any,
    config: { stop: boolean }
  ): Promise<void> => {
    while (1) {
      if (config.stop) break
      f()
      await delay(sec)
    }
  }
  const config = {
    stop: false
  }
  setTimer(sec, f, config)
  return () => {
    config.stop = true
  }
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

function NSValue2String(v: NSValue) {
  return Database.transArrayToJSCompatible([v])[0] as string
}

function CGRectString2CGRect(s: string): CGRect {
  // {{116, 565}, {11, 15}}
  // {x,y}, {h,w}
  const arr = s.match(/\d+/g)!.map(k => Number(k))
  return {
    x: arr[0],
    y: arr[1],
    height: arr[2],
    width: arr[3]
  }
}

function CGSizeString2CGSize(s: string): CGSize {
  const arr = s.match(/\d+/g)!.map(k => Number(k))
  return {
    width: arr[0],
    height: arr[1]
  }
}

function CGSizeValue2CGSize(v: NSValue) {
  return CGSizeString2CGSize(NSValue2String(v))
}

function CGRectValue2CGRect(v: NSValue) {
  return CGRectString2CGRect(NSValue2String(v))
}

function isfileExists(path: string) {
  return NSFileManager.defaultManager().fileExistsAtPath(path)
}

export {
  console,
  showHUD,
  HUDController,
  alert,
  delay,
  delayBreak,
  getObjCClassDeclar,
  openUrl,
  postNotification,
  isThisWindow,
  isOCNull,
  OCNull2null,
  eventHandlerController,
  copy,
  NSValue2String,
  evaluateJavaScript,
  isfileExists,
  CGRectValue2CGRect,
  CGRectString2CGRect,
  CGSizeString2CGSize,
  CGSizeValue2CGSize,
  setTimeInterval
}
