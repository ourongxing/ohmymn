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

/**
 * 用来判断是否是 OC 的 NSNull 对象
 */
const isNull = (obj: any) => {
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
  isNull
}
