import { log } from "./common"

/**
 * 反转义字符串，用于处理用户输入
 */
const reverseEscape = (text: string) => JSON.parse(`{"key": ${text}}`).key
const isNumber = (text: string) => !isNaN(Number(text))

const string2ReplaceParam = (text: string): ReplaceParam[] => {
  // 输入格式 (/sd/, "", 1)
  const brackets = text.split(/;\s*(?=\()/).map(item => item.trim())
  const params = []
  for (let bracket of brackets) {
    const [regString, newSubStr, fnKey] = bracket
      // 去括号
      .slice(1, -1)
      .replace(/(\/[gimsuy]*)\s*,\s*"/, `$1😎"`)
      .replace(/"\s*,/g, '"😎')
      .split("😎")
    if (fnKey && !isNumber(fnKey)) throw ""
    if (!fnKey && isNumber(newSubStr)) throw ""
    const regParts = regString.match(/^\/(.*?)\/([gimsuy]*)$/)
    const regexp = regParts
      ? new RegExp(regParts[1], regParts[2])
      : new RegExp(regString)
    params.push({
      regexp,
      newSubStr: reverseEscape(newSubStr),
      fnKey: fnKey ? Number(fnKey) : 0
    })
  }
  return params
}

interface ReplaceParam {
  regexp: RegExp
  newSubStr: string
  fnKey: number
}

export { string2ReplaceParam, reverseEscape }
