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

declare interface ReplaceParam {
  regexp: RegExp,
  replace: string
}

const string2ReplaceParam = (text: string): ReplaceParam[] => {
  // 首先通过分号来分离，格外注意，MN 无法使用(?<!)，正则很多都不支持，try catch 都没用
  // 会导致插件无法加载，这样写或许兼容性高一点
  const brackets = text.replace(/\)\s*(;)/g, ")delimiter")
    .split("delimiter").map(item => item.trim())
  const willReturn = []
  for (const bracket of brackets) {
    const tmp = bracket.substring(1, bracket.length - 1)
      .replace(/(\/[gi]{0,2})\s*,/g, "$1delimiter")
      .split("delimiter").map(item => item.trim())
    const [regString, replace] = tmp

    const regParts = regString.match(/^\/(.*?)\/([gim]*)$/)
    let regexp = null
    if (regParts) regexp = new RegExp(regParts[1], regParts[2])
    else regexp = new RegExp(regString);

    // 反转义
    const parsing = JSON.parse(`{ "key": ${replace} }`)
    willReturn.push({
      regexp,
      replace: parsing.key
    })
  }
  return willReturn
}

export {
  log,
  showHUD,
  getObjCClassDeclar,
  isHalfWidth,
  string2ReplaceParam,
}
