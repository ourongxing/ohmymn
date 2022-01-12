/**
 * 反转义字符串，用于处理用户输入
 */
const reverseEscape = (str: string) => JSON.parse(`{"key": ${str}}`).key
const escapeDoubleQuote = (str: string) => str.replace(/"/g, `\\"`)
const isNumber = (text: string) => !isNaN(Number(text))

const string2ReplaceParam = (str: string): ReplaceParam[] => {
  // 输入格式 (/sd/, "", 1);(/sd/, "", 1)
  const brackets = str.trim().split(/\s*;\s*(?=\()/)
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
      // newSubStr 始终有双引号，反转义也是字符串
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

// https://github.com/sindresorhus/escape-string-regexp/blob/main/index.js
const escapeStringRegexp = (str: string) =>
  str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")

const string2RegArray = (str: string): RegExp[][] => {
  /**
   * 输入 [/sd/,/sd/];[/sd/,/sd/]
   * /sd/
   * sd => 会转义，相当于普通字符串
   * 输出 [[/sd/]]
   */

  if (!/^\[.*\]$/.test(str))
    return [
      [
        string2Reg(
          /^\/(.*?)\/([gimsuy]*)$/.test(str) ? str : escapeStringRegexp(str)
        )
      ]
    ]
  const brackets = str.trim().split(/\s*;\s*(?=\[)/)
  return brackets.map(bracket =>
    bracket
      .slice(1, -1)
      .split(/\s*,\s*(?=\/)/)
      .map(str => string2Reg(str))
  )
}

const addFlags = (reg: RegExp, flags: string) => {
  // 去重
  let allFlags: string
  if (flags.length == 1)
    allFlags = reg.flags.includes(flags) ? reg.flags : reg.flags + flags
  else
    allFlags = [...new Set(reg.flags + flags)]
      .filter(flag => "gimuy".includes(flag))
      .join("")
  return new RegExp(reg.source, allFlags)
}

export interface ReplaceParam {
  regexp: RegExp
  newSubStr: string
  fnKey: number
}

export {
  string2ReplaceParam,
  reverseEscape,
  string2Reg,
  string2RegArray,
  escapeDoubleQuote,
  escapeStringRegexp,
  addFlags
}
