import { MN } from "marginnote"
import lang from "./lang"
import {
  escapeDoubleQuote,
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "./input"
import { getMNLinkValue } from "../profile/utils"

export function checkPlainText(input: string) {
  reverseEscape(`${escapeDoubleQuote(input)}`, true)
}

export function checkRegArray(input: string) {
  string2RegArray(input)
    .flat()
    .forEach(reg => void reg.test("test"))
}

export function checkRegArrayFromMNLink(input: string) {
  const res = getMNLinkValue(input)
  if (!res) throw lang.no_profile_in_card
  checkRegArray(res)
}

export function checkReplaceParam(input: string) {
  string2ReplaceParam(input).forEach(param => {
    "test".replace(param.regexp, param.newSubStr)
  })
}

export function checkReplaceParamFromMNLink(input: string) {
  const res = getMNLinkValue(input)
  if (!res) throw lang.no_profile_in_card
  checkReplaceParam(res)
}

export function checkInteger(input: number) {
  if (!Number.isInteger(input)) throw lang.input_integer
}
export function checkPositiveinteger(input: number) {
  checkInteger(input)
  if (input < 0) throw lang.input_positive
}

export function checkMNLink(input: string) {
  const noteid = input.replace("marginnote3app://note/", "")
  if (noteid === input) throw "不是卡片链接"
  if (!MN.db.getNoteById(noteid)) throw "卡片不存在"
}
