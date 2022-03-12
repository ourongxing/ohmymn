/**
 * 反转义字符串，用于处理用户输入
 */
const reverseEscape = (str: string, quote = false) =>
  JSON.parse(quote ? `{"key": "${str}"}` : `{"key": ${str}}`).key
const escapeDoubleQuote = (str: string) => str.replace(/"/g, `\\"`)
const isNumber = (text: string) => /^[0-9]+$/.test(text)

const string2ReplaceParam = (str: string): ReplaceParam[] => {
  // 输入格式 (/sd/, "", 1);(/sd/, "", 1)
  const brackets = str.split(/\s*;\s*(?=\()/)
  const params = []
  for (let bracket of brackets) {
    const [regString, newSubStr, fnKey] = bracket
      .replace(/\((\/.*\/[gimsuy]*)\x20*,\x20*"(.*")\)?/, `$1😎"$2`)
      .replace(/"\x20*,\x20*(\d)\)/g, '"😎$1')
      .split("😎")
    if ((fnKey && !isNumber(fnKey)) || (!fnKey && isNumber(newSubStr))) throw ""
    params.push({
      regexp: string2Reg(regString),
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

  if (/^\(.*\)$/.test(str)) throw ""
  if (!/^\[.*\]$/.test(str))
    return [
      [
        string2Reg(
          /^\/(.*?)\/([gimsuy]*)$/.test(str)
            ? str
            : `/${escapeStringRegexp(str)}/g`
        )
      ]
    ]
  const brackets = str.split(/\s*;\s*(?=\[)/)
  return brackets.map(bracket =>
    bracket
      .slice(1, -1)
      .split(/\s*,\s*(?=\/)/)
      .map(str => string2Reg(str))
  )
}

const regFlag = {
  add(reg: RegExp, flag: "g" | "i" | "m" | "s" | "y" | "u") {
    return reg.flags.includes(flag)
      ? reg
      : new RegExp(reg.source, reg.flags + flag)
  },
  remove(reg: RegExp, flag: "g" | "i" | "m" | "s" | "y" | "u") {
    return reg.flags.includes(flag)
      ? new RegExp(reg.source, reg.flags.replace(flag, ""))
      : reg
  }
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
  regFlag
}
