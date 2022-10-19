import lang from "./lang"
import { unique } from "."

function reverseEscape(str: string, quote = false) {
  try {
    return JSON.parse(quote ? `"${str}"` : str)
  } catch (e) {
    console.error(e)
    throw lang.parse_error
  }
}

function escapeDoubleQuote(str: string) {
  return str.replace(/"/g, `\\"`)
}
const isIntegerString = (text: string) => /^[0-9]+$/.test(text)
const isNumberString = (text: string) => /^[0-9]+\.?[0-9]*$/.test(text)

function string2ReplaceParam(str: string): ReplaceParam[] {
  const brackets = str.split(/\s*;\s*(?=\()/)
  const params = []
  for (const bracket of brackets) {
    const [regString, newSubStr, fnKey] = bracket
      .replace(/\((\/.*\/[gimsuy]*)\x20*,\x20*"(.*")\x20*\)?/, `$1😎"$2`)
      .replace(/"\x20*,\x20*(\d)\)/g, '"😎$1')
      .split("😎")
    if (
      (fnKey && !isIntegerString(fnKey)) ||
      (!fnKey && isIntegerString(newSubStr))
    )
      throw "invalid replace param"
    params.push({
      regexp: string2Reg(regString),
      // newSubStr : always have double quotes
      newSubStr: reverseEscape(newSubStr),
      fnKey: fnKey ? Number(fnKey) : 0
    })
  }
  return params
}

function string2Reg(str: string) {
  str = str.trim()
  if (str.startsWith("//")) throw lang.ban_1
  if (str.startsWith("/./")) throw lang.ban_2
  if (!str.startsWith("/")) return new RegExp(escapeStringRegexp(str))
  const regParts = str.match(/^\/(.+?)\/([gimsuy]*)$/)
  if (!regParts) throw ""
  return new RegExp(regParts[1], regParts[2])
}

function escapeStringRegexp(str: string) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
}

function string2RegArray(str: string): RegExp[][] {
  if (/^\(.+\)$/.test(str)) throw ""
  const brackets = str.split(/\s*;\s*(?=(?:\[\s*\/|\/\s*[^\]gimsuy,]))/)
  return brackets.map(bracket => {
    return bracket
      .replace(/^\s*\[(.+?)\]\s*$/, "$1")
      .split(/\s*,\s*(?=\/[^\s,gimsuy]+)/)
      .map(str => string2Reg(str))
  })
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

function extractArray(text: string, params: ReplaceParam[]) {
  return unique(
    params.reduce((acc, { newSubStr, regexp }) => {
      regexp = regFlag.add(regexp, "g")
      if (regexp.test(text)) {
        acc.push(...text.match(regexp)!.map(k => k.replace(regexp, newSubStr)))
      }
      return acc
    }, [] as string[])
  )
}

export {
  string2ReplaceParam,
  reverseEscape,
  string2Reg,
  string2RegArray,
  escapeDoubleQuote,
  escapeStringRegexp,
  regFlag,
  extractArray,
  isIntegerString,
  isNumberString
}
