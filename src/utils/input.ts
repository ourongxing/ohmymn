import { unique } from "."

/**
 *  Reverse escape string in order to process user input
 * @param str : The string to be processed
 * @param quote : Boolean. If quote is true, the output string will be surrounded by double quotes
 * @returns The string after reverse escape
 *
 * @example
 * ```
 * // Output string with double quotes surrounded
 * const myReverseEscape = reverseEscape(123,true)
 * // output: "123"
 * ```
 */
const reverseEscape = (str: string, quote = false) =>
  JSON.parse(quote ? `{"key": "${str}"}` : `{"key": ${str}}`).key

/**
 *  Escape double quotes of the string. We often use backslash(`\`) to escape double quote in order to prevent Typescript from interpreting the quote as the end of the string
 * @param str : The string to be processed
 * @returns A string after processing
 * @example
 * ```
 * const Myquote = escapeDoubleQuote("\"file\"-123")
 * // output: \\\"file\\\"-123
 * ```
 */
const escapeDoubleQuote = (str: string) => str.replace(/"/g, `\\"`)
/**
 *  Detect if the string is a number
 * @param text : The string to be processed
 * @returns Boolean, true if the input is a number
 * @example
 * ```
 * const myIsNumber = isNumber("1")
 * // output: true
 * const myIsNumber = isNumber("a")
 * // output: false
 * ```
 */
const isNumber = (text: string) => /^[0-9]+$/.test(text)

/**
 *  process user input and return a dict which contains Regexp ,string want to be replaced and fnkey.
 * @param str : string, the format is `(regexp,string,fnkey:optional);(regexp,string,fnkey:optional);...`
 * @returns list like `[{regexp:RegExp;newSubStr:any;fnkey:number},{regexp:RegExp;newSubStr:any;fnkey:number},...]`
 * @example
 * ```
 * const myReplaceParam = replaceParam("(/sd/g,"");(/tt/g,)"")
 * //output
 * [{regexp: /sd/g, newSubStr: "", fnkey: 0}, {regexp: /tt/g, newSubStr: "", fnkey: 0}]
 * ```
 */
const string2ReplaceParam = (str: string): ReplaceParam[] => {
  const brackets = str.split(/\s*;\s*(?=\()/)
  const params = []
  for (const bracket of brackets) {
    const [regString, newSubStr, fnKey] = bracket
      .replace(/\((\/.*\/[gimsuy]*)\x20*,\x20*"(.*")\x20*\)?/, `$1😎"$2`)
      .replace(/"\x20*,\x20*(\d)\)/g, '"😎$1')
      .split("😎")
    if ((fnKey && !isNumber(fnKey)) || (!fnKey && isNumber(newSubStr))) throw ""
    params.push({
      regexp: string2Reg(regString),
      // newSubStr : always have double quotes
      newSubStr: reverseEscape(newSubStr),
      fnKey: fnKey ? Number(fnKey) : 0
    })
  }
  return params
}

/**
 * @internal
 *  A function to return RegExp used by string2RegArray
 * @param str : The string to be processed like `/[/xxx/, /yyy/]; [/xxx/]/`
 * @returns RegExp
 */
const string2Reg = (str: string) => {
  str = str.trim()
  if (!str.startsWith("/")) return new RegExp(escapeStringRegexp(str))
  const regParts = str.match(/^\/(.*?)\/([gimsuy]*)$/)
  if (!regParts) throw ""
  return new RegExp(regParts[1], regParts[2])
}

/**
 * @internal
 *  A function to escape string for RegExp, used by string2RegArray
 * @param str : The string to be processed
 * @returns string
 */
const escapeStringRegexp = (str: string) =>
  str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")

/**
 *  Procecss user input and return
 * @param str : The string to be processed, input like `[/sd/,/sd/];[/sd/,/sd/]` => output like [[/sd/]]
 * @returns List of RegExp
 */
const string2RegArray = (str: string): RegExp[][] => {
  if (/^\(.*\)$/.test(str)) throw ""
  const brackets = str.split(/\s*;\s*(?=(?:\[\s*\/|\/\s*[^\]gimsuy,]))/)
  return brackets.map(bracket => {
    return bracket
      .replace(/^\s*\[(.*?)\]\s*$/, "$1")
      .split(/\s*,\s*(?=\/[^\s,gimsuy]+)/)
      .map(str => string2Reg(str))
  })
}

/**
 * @descrption Add or remove flags to RegExp
 * @method add Add flags to RegExp
 * @method remove Remove flags from RegExp
 */
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

/**
 * @param text The string to be processed
 * @param params The Array of {@link ReplaceParam}
 */
const extractArray = (text: string, params: ReplaceParam[]) => {
  return unique(
    params.reduce((acc, cur) => {
      const { newSubStr } = cur
      let { regexp } = cur
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
  extractArray
}
