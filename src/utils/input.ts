import { log } from "./common"

const checkInputCorrect = (text: string, key: string): boolean => {
  try {
    switch (key) {
      case "wordCount":
        const input = reverseEscape(text)
        if (
          typeof input == "number" ||
          (Array.isArray(input) &&
            input.length == 2 &&
            input.every(item => Number.isInteger(item)))
        ) {
        } else {
          throw ""
        }
      case "customFill":
        reverseEscape(text)
        break
      case "changeFillSelected": {
        const index = Number(text)
        if (!Number.isInteger(index)) throw ""
        if (index > 3 || index < 0) throw ""
        break
      }
      case "changeColorSelected": {
        const index = Number(text)
        if (!Number.isInteger(index)) throw ""
        if (index > 16 || index < 0) throw ""
        break
      }
      case "renameSelected":
        if (!/\(.*"\)/.test(text)) text = `(/^.*$/g, ${text})`
      default:
        const params = string2ReplaceParam(text)
        for (const item of params) "test".replace(item.regexp, item.newSubStr)
        break
    }
  } catch {
    return false
  }
  return true
}

/**
 * 反转义字符串，用于处理用户输入
 */
const reverseEscape = (text: string) => {
  return JSON.parse(`{"key": ${text}}`).key
}

const string2ReplaceParam = (text: string): ReplaceParam[] => {
  // 首先通过分号来分离，格外注意，MN 无法使用(?<!)，正则很多都不支持，try catch 都没用
  // 会导致插件无法加载，这样写或许兼容性高一点
  const brackets = text
    .replace(/\)\s*;/g, ")delimiter")
    .split("delimiter")
    .map(item => item.trim())
  const willReturn = []
  for (const bracket of brackets) {
    const tmp = bracket
      .substring(1, bracket.length - 1)
      .replace(/(\/[gi]{0,2})\s*,/g, "$1delimiter")
      .replace(/"\s*,/g, '"delimiter')
      .split("delimiter")
      .map(item => item.trim())
    const [regString, newSubStr, fnKey] = tmp
    if (fnKey && isNaN(Number(fnKey))) throw new Error("")
    const regParts = regString.match(/^\/(.*?)\/([gim]*)$/)
    let regexp = null
    if (regParts) regexp = new RegExp(regParts[1], regParts[2])
    else regexp = new RegExp(regString)

    willReturn.push({
      regexp,
      newSubStr: reverseEscape(newSubStr),
      fnKey: fnKey ? Number(fnKey) : 0
    })
  }
  return willReturn
}

declare interface ReplaceParam {
  regexp: RegExp
  newSubStr: string
  fnKey: number
}

export { checkInputCorrect, string2ReplaceParam, reverseEscape }
