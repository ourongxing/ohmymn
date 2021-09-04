const log = (obj: any, suffix = "normal") => {
  JSB.log(`_NAME_-${suffix} %@`, obj);
}

const showHUD = (message: string, duration: number = 1) => {
  Application.sharedInstance().showHUD(message, self.window, duration);
}

const alert = (message: string) => {
  Application.sharedInstance().alert(message)
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

declare interface ReplaceParam {
  regexp: RegExp,
  newSubStr: string,
  fnKey: number
}

const string2ReplaceParam = (text: string): ReplaceParam[] => {
  // 首先通过分号来分离，格外注意，MN 无法使用(?<!)，正则很多都不支持，try catch 都没用
  // 会导致插件无法加载，这样写或许兼容性高一点
  const brackets = text.replace(/\)\s*;/g, ")delimiter")
    .split("delimiter").map(item => item.trim())
  const willReturn = []
  for (const bracket of brackets) {
    const tmp = bracket.substring(1, bracket.length - 1)
      .replace(/(\/[gi]{0,2})\s*,/g, "$1delimiter")
      .replace(/"\s*,/g, "\"delimiter")
      .split("delimiter").map(item => item.trim())
    const [regString, newSubStr, fnKey] = tmp
    if (fnKey && isNaN(Number(fnKey))) throw new Error("")
    const regParts = regString.match(/^\/(.*?)\/([gim]*)$/)
    let regexp = null
    if (regParts) regexp = new RegExp(regParts[1], regParts[2])
    else regexp = new RegExp(regString);

    // 反转义
    const parsing = JSON.parse(`{ "key": ${newSubStr} }`)
    willReturn.push({
      regexp,
      newSubStr: parsing.key,
      fnKey: fnKey ? Number(fnKey) : 0
    })
  }
  return willReturn
}

const delay = (sec: number) => {
  return new Promise(
    resolve => NSTimer.scheduledTimerWithTimeInterval(sec, false, resolve))
}

const delayBreak = async (times: number, sec: number, f: () => boolean): Promise<boolean> => {
  for (let i = 0; i < times; i++) {
    await delay(sec)
    if (f()) return true
  }
  return false
}

export {
  log,
  showHUD,
  alert,
  getObjCClassDeclar,
  isHalfWidth,
  string2ReplaceParam,
  delay,
  delayBreak
}