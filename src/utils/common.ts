import lang from "lang"
import { UIAlertViewStyle } from "typings/enum"
import { Addon, MN } from "../const"

const console = {
  log(obj: any, suffix = "normal") {
    JSB.log(`${Addon.key}-${suffix} %@`, obj)
  },
  error(obj: any, suffix = "error") {
    JSB.log(`${Addon.key}-${suffix} %@`, obj)
  },
  // 与真实意思无关，用于 stringify 对象
  assert(obj: any, suffix = "normal") {
    JSB.log(`${Addon.key}-${suffix} %@`, JSON.stringify(obj))
  }
}

// 注意要把 window 赋给所有 OC 对象才行
const showHUD = (message: string, duration = 1, window = self.window) =>
  void MN.app.showHUD(message, window, duration)

const HUDController = {
  show(message: string, window = self.window) {
    MN.app.waitHUDOnView(message, window)
  },
  hidden(window = self.window) {
    MN.app.stopWaitHUDOnView(window)
  }
}

const alert = (message: string) => void MN.app.alert(message)

const getObjCClassDeclar = (
  name: string,
  type: string,
  delegate: Array<string> = []
) => {
  let str = `${name} : ${type}`
  // 可以不用写 delegate 协议名
  if (delegate.length) {
    delegate.forEach(value => {
      str = `${str} ${value}Delegate`
    })
  }
  return str
}

const delay = (sec: number) =>
  new Promise(resolve =>
    NSTimer.scheduledTimerWithTimeInterval(sec, false, resolve)
  )

const delayBreak = async (
  times: number,
  sec: number,
  f: () => boolean
): Promise<boolean> => {
  for (let i = 0; i < times; i++) {
    await delay(sec)
    if (f()) return true
  }
  return false
}

const openUrl = (url: string) =>
  void MN.app.openURL(NSURL.URLWithString(encodeURI(url)))

const postNotification = (key: string, userInfo: any) => {
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
    key,
    self,
    userInfo
  )
}

const isThisWindow = (sender: any, window = self.window) =>
  MN.app.checkNotifySenderInWindow(sender, window)

const popup = (
  title: string,
  message: string,
  type: UIAlertViewStyle,
  buttons: string[],
  f: (
    alert: UIAlertView,
    buttonIndex: number
  ) => {
    option?: number
    content?: string
  }
) =>
  new Promise<{
    option?: number
    content?: string
  }>(resolve =>
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      title,
      message,
      type,
      lang.cancel,
      buttons,
      (alert: UIAlertView, buttonIndex: number) => {
        if (buttonIndex != 0) resolve(f(alert, buttonIndex - 1))
      }
    )
  )

/**
 * 用来判断是否是 OC 的 NSNull 对象
 */
const isOCNull = (obj: any) => obj === NSNull.new()

const eventHandlerController = (
  handlerList: ({ event: string; handler?: string } | string)[]
): {
  add: () => void
  remove: () => void
} => {
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
  popup,
  eventHandlerController
}
