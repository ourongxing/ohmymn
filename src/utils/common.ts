import { UIAlertViewStyle } from "types/UIKit"
import { Addon, MN } from "../const"

const console = {
  log(obj: any, suffix = "normal") {
    JSB.log(`${Addon.key}-${suffix} %@`, obj)
  },
  error(obj: any, suffix = "error") {
    JSB.log(`${Addon.key}-${suffix} %@`, obj)
  }
}

// 注意要把 window 赋给所有 OC 对象才行
const showHUD = (message: string, duration: number = 1) =>
  void MN.app.showHUD(message, self.window, duration)

const HUDController = {
  show(message: string) {
    MN.app.waitHUDOnView(message, self.window)
  },
  hidden() {
    MN.app.stopWaitHUDOnView(self.window)
  }
}

const alert = (message: string) => void MN.app.alert(message)

const getObjCClassDeclar = (
  name: string,
  type: string,
  delegate: Array<string> = []
) => {
  let str: string = `${name} : ${type}`
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

const isThisWindow = (sender: any) =>
  MN.app.checkNotifySenderInWindow(sender, self.window)

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
      "取消",
      buttons,
      (alert: UIAlertView, buttonIndex: number) => {
        if (buttonIndex == 0) return
        resolve(f(alert, buttonIndex - 1))
      }
    )
  )

/**
 * 用来判断是否是 OC 的 NSNull 对象
 */
const isOCNull = (obj: any) => obj == NSNull.new()

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
  popup
}
