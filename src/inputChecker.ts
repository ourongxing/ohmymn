import { util as magicaction } from "addons/magicaction"
import {
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "utils/input"
import { getMNLinkValue } from "utils/profile/updateDataSource"

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
        } else throw ""
      case "mergeText":
        reverseEscape(`"${text}"`)
        break
      case "customComplete":
        reverseEscape(text)
        break
      case "changeColor": {
        const index = Number(text)
        if (!Number.isInteger(index)) throw ""
        if (index > 16 || index < 1) throw ""
        break
      }
      case "renameTitle":
        text = /^\(.*\)$/.test(text) ? text : `(/^.*$/g, "${text}")`
        const params = string2ReplaceParam(text)
        if (params.length > 1) throw ""
        "test".replace(params[0].regexp, params[0].newSubStr)
        if (/%\[(.*)\]/.test(params[0].newSubStr))
          magicaction.getSerialInfo(params[0].newSubStr, 1)
        break
      case "customDefLink":
      case "customBeTitle":
      case "customSplit":
      case "filterCards": {
        const res = getMNLinkValue(text)
        if (!res) throw ""
        const regs = string2RegArray(res)
        regs.flat().forEach(reg => {
          reg.test("test")
        })
        break
      }
      case "customExtractTitle":
      case "customReplace":
      case "customList":
      case "customTag": {
        const res = getMNLinkValue(text)
        if (!res) throw ""
        string2ReplaceParam(res).forEach(param => {
          "test".replace(param.regexp, param.newSubStr)
        })
        break
      }
      default:
        throw ""
    }
  } catch {
    return false
  }
  return true
}

export default checkInputCorrect
