import magicaction from "addons/magicaction"
import {
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "utils/input"

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
      case "custom":
        reverseEscape(text)
        break
      case "changeColorSelected": {
        let index = 0
        if (/^\s*\(.*\)\s*$/.test(text)) {
          const param = string2ReplaceParam(text)
          if (param.length > 1) throw ""
          param[0].regexp.test("test")
          index = Number(param[0].newSubStr)
        } else {
          index = Number(text)
        }
        if (!Number.isInteger(index)) throw ""
        if (index > 16 || index < 0) throw ""
        break
      }
      case "custom":
        const regs = string2RegArray(text)
        regs.forEach(reg => {
          reg.test("test")
        })
        break
      case "renameSelected":
        text = /^\s*".*"\s*$/.test(text) ? `(/^.*$/g, ${text})` : text
        string2ReplaceParam(text).forEach(param => {
          "test".replace(param.regexp, param.newSubStr)
          magicaction.util.getSerialInfo(param.newSubStr, 1)
        })
        break
      default:
        string2ReplaceParam(text).forEach(param => {
          "test".replace(param.regexp, param.newSubStr)
        })
        break
    }
  } catch {
    return false
  }
  return true
}

export default checkInputCorrect
