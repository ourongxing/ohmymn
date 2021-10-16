/**
 * 反转义字符串，用于处理用户输入
 */
const reverseEscape = (text: string) => JSON.parse(`{"key": ${text}}`).key
const isNumber = (text: string) => !isNaN(Number(text))

const string2ReplaceParam = (text: string): ReplaceParam[] => {
  // 输入格式 (/sd/, "", 1)
  const brackets = text.trim().split(/\s*;\s*(?=\()/)
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
    const regexp = string2Reg(regString)
    params.push({
      regexp,
      newSubStr: reverseEscape(newSubStr),
      fnKey: fnKey ? Number(fnKey) : 0
    })
  }
  return params
}

const string2Reg = (str: string) => {
  const regParts = str.match(/^\/(.*?)\/([gimsuy]*)$/)
  if (!regParts) throw ""
  return new RegExp(regParts[1], regParts[2])
}

const string2RegArray = (str: string): RegExp[] => {
  /**
   * 输入 [/sd/,/sd/]
   * /sd/
   *  sd
   */
  if (!/^\[.*\]$/.test(str))
    return [string2Reg(/^\/(.*?)\/([gimsuy]*)$/.test(str) ? str : `/${str}/`)]
  const regStrArr = str.slice(1, -1).split(/\s*,\s*(?=\/)/)
  return regStrArr.map(str => string2Reg(str))
}

interface ReplaceParam {
  regexp: RegExp
  newSubStr: string
  fnKey: number
}

export { string2ReplaceParam, reverseEscape, string2Reg, string2RegArray }
