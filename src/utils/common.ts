const log = (obj: any, suffix = "normal") => {
  JSB.log(`ohmymn-${suffix} %@`, obj)
}

const showHUD = (message: string, duration: number = 1) => {
  // 注意要把 window 赋给所有 OC 对象才行
  Application.sharedInstance().showHUD(message, self.window, duration)
}

const alert = (message: string) => {
  Application.sharedInstance().alert(message)
}

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

const delay = (sec: number) => {
  return new Promise(resolve =>
    NSTimer.scheduledTimerWithTimeInterval(sec, false, resolve)
  )
}

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

const openUrl = (url: string) => {
  Application.sharedInstance().openURL(NSURL.URLWithString(encodeURI(url)))
}

const postNotification = (key: string, userInfo: any) => {
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
    key,
    self,
    userInfo
  )
}

const isThisWindow = (sender: any, window: any) => {
  return Application.sharedInstance().checkNotifySenderInWindow(
    sender,
    self.window
  )
}

const popup = (
  title: string,
  message: string,
  type: UIAlertViewStyle,
  buttons: string[],
  f: (
    alert: UIAlertView,
    buttonIndex: number
  ) => {
    key: string
    content: string
  }
) => {
  return new Promise<{
    key: string
    content: string
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
}

/**
 * 用来判断是否是 OC 的 NSNull 对象
 */
const isOCNull = (obj: any) => {
  // 用 obj is NSNull 不大行，因为只有运行时才能判断是否是 NSNull
  return obj == NSNull.new()
}

export {
  log,
  showHUD,
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
