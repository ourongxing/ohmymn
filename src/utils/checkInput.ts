import {
  escapeDoubleQuote,
  getMNLinkValue,
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "./input"

export const checkPlainText = (input: string) => {
  reverseEscape(`${escapeDoubleQuote(input)}`, true)
}

export const checkRegArray = (input: string) => {
  string2RegArray(input)
    .flat()
    .forEach(reg => void reg.test("test"))
}

export const checkRegArrayFromMNLink = (input: string) => {
  const res = getMNLinkValue(input)
  if (!res) throw "卡片中不存在配置信息"
  checkRegArray(res)
}

export const checkReplaceParam = (input: string) => {
  string2ReplaceParam(input).forEach(param => {
    "test".replace(param.regexp, param.newSubStr)
  })
}

export const checkReplaceParamFromMNLink = (input: string) => {
  const res = getMNLinkValue(input)
  if (!res) throw "卡片中不存在配置信息"
  checkReplaceParam(res)
}
