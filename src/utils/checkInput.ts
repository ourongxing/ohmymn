import lang from "~/lang"
import {
  escapeDoubleQuote,
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "./input"
import { getMNLinkValue } from "./profile/utils"

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
  if (!res) throw lang.no_profile_in_card
  checkRegArray(res)
}

export const checkReplaceParam = (input: string) => {
  string2ReplaceParam(input).forEach(param => {
    "test".replace(param.regexp, param.newSubStr)
  })
}

export const checkReplaceParamFromMNLink = (input: string) => {
  const res = getMNLinkValue(input)
  if (!res) throw lang.no_profile_in_card
  checkReplaceParam(res)
}

export const checkInteger = (input: number) => {
  if (!Number.isInteger(input)) throw lang.input_integer
}
export const checkPositiveinteger = (input: number) => {
  checkInteger(input)
  if (input < 0) throw lang.input_positive
}
