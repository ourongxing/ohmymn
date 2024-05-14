import { getMNLinkValue } from "../profile/utils"
import {
  escapeDoubleQuote,
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "./input"
import lang from "./lang"

export function checkPlainText(input: string) {
  reverseEscape(`${escapeDoubleQuote(input)}`, true)
}

export function checkRegArray(input: string) {
  for (const reg of string2RegArray(input).flat()) {
    reg.test("test")
  }
}

export function checkRegArrayFromMNLink(input: string) {
  const res = getMNLinkValue(input)
  if (!res) throw lang.no_profile_in_card
  checkRegArray(res)
}

export function checkReplaceParam(input: string) {
  for (const param of string2ReplaceParam(input)) {
    "test".replace(param.regexp, param.newSubStr)
  }
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
  const noteid = input.replace(MN.scheme + "://note/", "")
  if (noteid === input) throw lang.not_mnlink
  if (!MN.db.getNoteById(noteid)) throw lang.not_exist
}
