import { reverseEscape, string2ReplaceParam } from "utils/input"

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
      case "changeColorSelected": {
        let index = 0
        if (text[0] == "(") {
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

export default checkInputCorrect
