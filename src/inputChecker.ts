import { util as magicaction } from "addons/magicaction"
import { log } from "utils/common"
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
      case "customComplete":
        reverseEscape(text)
        break
      case "changeColorSelected": {
        const index = Number(text)
        if (!Number.isInteger(index)) throw ""
        if (index > 16 || index < 0) throw ""
        break
      }
      case "customBeTitle":
        const regs = string2RegArray(text)
        regs.forEach(reg => {
          reg.test("test")
        })
        break
      case "renameSelected":
        text = /^\s*".*"\s*$/.test(text) ? `(/^.*$/g, ${text})` : text
        string2ReplaceParam(text).forEach(param => {
          "test".replace(param.regexp, param.newSubStr)
          magicaction.getSerialInfo(param.newSubStr, 1)
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
