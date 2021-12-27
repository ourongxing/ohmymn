import { UIAlertViewStyle } from "types/UIKit"
import { Addon, MN } from "../const"

const log = (obj: any, suffix = "normal") =>
  void JSB.log(`${Addon.key}-${suffix} %@`, obj)

// 注意要把 window 赋给所有 OC 对象才行
const showHUD = (message: string, duration: number = 1) =>
  void Application.sharedInstance().showHUD(message, MN.window, duration)

const HUDController = {
  show(message: string) {
    Application.sharedInstance().waitHUDOnView(message, MN.window)
  },
  hidden() {
    Application.sharedInstance().stopWaitHUDOnView(MN.window)
  }
}

const alert = (message: string) =>
  void Application.sharedInstance().alert(message)

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
  void Application.sharedInstance().openURL(NSURL.URLWithString(encodeURI(url)))

const postNotification = (key: string, userInfo: any) =>
  void NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
    key,
    self,
    userInfo
  )

const isThisWindow = (sender: any) =>
  Application.sharedInstance().checkNotifySenderInWindow(sender, MN.window)

const popup = (
  title: string,
  message: string,
  type: UIAlertViewStyle,
  buttons: string[],
  f: (
    alert: UIAlertView,
    buttonIndex: number
  ) => {
    key?: string
    option?: number
    content?: string
  }
) =>
  new Promise<{
    key?: string
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
  log,
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
