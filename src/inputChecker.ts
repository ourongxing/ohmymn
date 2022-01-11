import {
  escapeDoubleQuote,
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "utils/input"
import { util as magicaction } from "addons/magicaction"
import { getMNLinkValue } from "utils/profile/updateDataSource"

const checkInputCorrect = (str: string, key: string): boolean => {
  try {
    switch (key) {
      case "wordCount": {
        const input = reverseEscape(str)
        if (
          Array.isArray(input) &&
          input.length == 2 &&
          input.every(item => Number.isInteger(item))
        ) {
        } else throw ""
        break
      }
      case "wordCountArea": {
        const input = reverseEscape(str)
        if (
          Array.isArray(input) &&
          input.length == 3 &&
          input.every(item => Number.isInteger(item))
        ) {
        } else throw ""
        break
      }
      case "mergeText":
      case "customComplete":
        reverseEscape(`"${escapeDoubleQuote(str)}"`)
        break
      case "changeColor": {
        const index = Number(str)
        if (!Number.isInteger(index)) throw ""
        if (index > 16 || index < 1) throw ""
        break
      }
      case "renameTitle":
        str = /^\(.*\)$/.test(str)
          ? str
          : `(/^.*$/g, "${escapeDoubleQuote(str)}")`
        const params = string2ReplaceParam(str)
        if (params.length > 1) throw ""
        "test".replace(params[0].regexp, params[0].newSubStr)
        if (/%\[(.*)\]/.test(params[0].newSubStr))
          magicaction.getSerialInfo(params[0].newSubStr, 1)
        break
      case "customDefLink":
      case "customBeTitle":
      case "customSplit":
      case "filterCards": {
        const res = getMNLinkValue(str)
        if (!res) throw ""
        const regs = string2RegArray(res)
        regs.flat().forEach(reg => {
          reg.test("test")
        })
        break
      }
      case "tagSelected":
        str = /^\(.*\)$/.test(str) ? str : `(/./, "${escapeDoubleQuote(str)}")`
      default: {
        const res = getMNLinkValue(str)
        if (!res) throw ""
        string2ReplaceParam(res).forEach(param => {
          "test".replace(param.regexp, param.newSubStr)
        })
        break
      }
    }
  } catch {
    return false
  }
  return true
}

export default checkInputCorrect
