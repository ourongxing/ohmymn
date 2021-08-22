const log = (obj: any, suffix = "normal") => {
  JSB.log(`MNLOG-${suffix} %@`, obj);
}

const showHUD = (message: string, duration: number = 1) => {
  Application.sharedInstance().showHUD(message, self.window, duration);
}

/**
 * Get Objective-C class declaration
 */
const getObjCClassDeclar = (name: string, type: string, delegate: Array<string> = []) => {
  let str: string = `${name} : ${type}`
  // 可以不用写 delegate 协议名
  if (delegate.length) {
    delegate.forEach(value => {
      str = `${str} ${value}Delegate`
    })
  }
  return str
}

const isHalfWidth = (text: string): boolean => {
  return text.match(/[\u0000-\u00ff]/g)?.length == text.length
}

export {
  log,
  showHUD,
  getObjCClassDeclar,
  isHalfWidth
}
