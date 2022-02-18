import {
  escapeDoubleQuote,
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "utils/input"
import { util as magicaction } from "modules/magicaction"
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
        } else throw "格式错误"
        break
      }
      case "wordCountArea": {
        const input = reverseEscape(str)
        if (
          Array.isArray(input) &&
          input.length == 3 &&
          input.every(item => Number.isInteger(item))
        ) {
        } else throw "格式错误"
        break
      }
      case "searchChineseText":
      case "searchEnglishText":
      case "searchWord":
      case "searchTranslation":
      case "searchAcademic":
      case "searchQuestion":
      case "searchOtherText": {
        if (!str.includes("{{keyword}}")) throw "没有输入 {{keyword}}"
        break
      }
      case "mergeText":
      case "customContent":
      case "customFill":
        reverseEscape(`"${escapeDoubleQuote(str)}"`)
        break
      case "changeColor": {
        const index = Number(str)
        if (!Number.isInteger(index)) throw "不是数字"
        if (index > 16 || index < 1) throw "不再范围内"
        break
      }

      // 目前 MagicAction 无法使用 URL 导入配置，架构问题，暂无解
      case "filterCards": {
        string2RegArray(str)
          .flat()
          .forEach(reg => void reg.test("test"))
      }
      case "customDefLink":
      case "customBeTitle":
      case "customTitleSplit": {
        const res = getMNLinkValue(str)
        if (!res) throw ""
        string2RegArray(res)
          .flat()
          .forEach(reg => void reg.test("test"))
        break
      }
      case "renameTitle": {
        str = /^\(.+\)$/.test(str)
          ? str
          : `(/^.*$/g, "${escapeDoubleQuote(str)}")`
        const { regexp, newSubStr } = string2ReplaceParam(str)[0]
        "test".replace(regexp, newSubStr)
        if (/%\[.+\]/.test(newSubStr)) magicaction.getSerialInfo(newSubStr, 1)
        if (/#\[.+\]/.test(newSubStr))
          magicaction.getLayerSerialInfo(newSubStr, [[1, 1, 1]])
        break
      }
      case "customTag":
      case "customList":
      case "customReplace":
      case "customExtractTitle":
      case "customStandardize": {
        const res = getMNLinkValue(str)
        if (!res) throw "卡片中不存在配置信息"
        string2ReplaceParam(res).forEach(param => {
          "test".replace(param.regexp, param.newSubStr)
        })
        break
      }
      case "tagSelected":
        str = /^\(.*\)$/.test(str) ? str : `(/./, "${escapeDoubleQuote(str)}")`
      default:
        string2ReplaceParam(str).forEach(param => {
          "test".replace(param.regexp, param.newSubStr)
        })
        break
    }
  } catch (err) {
    console.assert(err, "error")
    return false
  }
  return true
}

export default checkInputCorrect
