import { MbBookNote } from "@/typings"
import { isOCNull, showHUD } from "@/utils/common"
import { reverseEscape, escapeDoubleQuote } from "@/utils/input"
import fetch from "@/utils/network"
import { render } from "@/utils/third party/mustache"
import pangu from "@/utils/third party/pangu"
import { lang } from "./lang"
import { Dict, FillWordInfo } from "./typings"
const { error } = lang

export function getPureZH(text: string) {
  const arr = text.split("\n")
  text =
    arr.length > 1
      ? arr.filter(item => !/\[.*\]/.test(item)).join("\n")
      : arr[0].replace(/\[.*\]/, "")
  return pangu.spacing(pangu.toFullwidth(text.replace(/\ba\. /g, "adj. ")))
}

export async function getWordInfo(word: string): Promise<Dict> {
  const res = await fetch("http://dict.e.opac.vip/dict.php?sw=" + word).then(
    res => res.json()
  )
  const info = <Dict[]>res.filter((info: any) => info.word == info.sw)
  if (!info.length) throw error.not_find_word
  return info[0]
}

export function getWordEx(lemma: string, ex: string) {
  // s:demands/p:demanded/i:demanding/d:demanded/3:demands
  return ex.split(/\//).reduce(
    (acc, k) => {
      if (!/[01]:/.test(k)) {
        const word = k.slice(2)
        if (!acc.includes(word)) acc.push(word)
      }
      return acc
    },
    [lemma]
  )
}

export function getTag(str: string) {
  const params = [
    ["zk", "中考"],
    ["gk", "高考"],
    ["cet4", "四级"],
    ["cet6", "六级"],
    ["ky", "考研"],
    ["gre", "GRE"],
    ["toefl", "托福"],
    ["ielts", "雅思"]
  ]
  return params
    .reduce((acc, param) => acc.replace(param[0], param[1]), str)
    .split(/\x20+/)
    .filter(k => k)
}

export function getCollinsStar(num: number) {
  return "⭐".repeat(num)
}

export function getFillInfo(info: Dict) {
  const { customFill, fillWordInfo } = self.globalProfile.autocomplete
  if (
    fillWordInfo[0] === FillWordInfo.None ||
    (fillWordInfo[0] === FillWordInfo.Custom && !customFill)
  )
    return ""
  const template =
    fillWordInfo[0] === FillWordInfo.Custom
      ? reverseEscape(`"${escapeDoubleQuote(customFill)}"`)
      : "{{zh}}"
  const null2false = (
    v: OCNull | string,
    f: (t: string) => string | string[] = t => t
  ) => {
    if (isOCNull(v)) return false
    const res = f(v as string)
    return res ? res : false
  }
  const vars = {
    word: null2false(info.word),
    phonetic: null2false(info.phonetic),
    tags: null2false(info.tag, t => getTag(t).join("/")),
    collins: null2false(info.collins, t => getCollinsStar(Number(t))),
    en: null2false(info.definition),
    zh: null2false(info.translation, t => getPureZH(t))
  }
  return render(template, vars)
}

export async function completeWords(text: string) {
  try {
    if (!/^\w[a-z]+$/.test(text)) return undefined
    let word = text.toLowerCase()
    let info = await getWordInfo(word)
    const ex = info.exchange
    let title = [word]
    if (ex && !isOCNull(ex)) {
      const lemma = ex.replace(/^0:(\w+).*$/, "$1")
      if (lemma != ex) {
        word = lemma
        info = await getWordInfo(lemma)
      }
      title = getWordEx(word, info.exchange as string)
    }
    return {
      title,
      comments: [getFillInfo(info)],
      text: ""
    }
  } catch (error) {
    console.error(error)
    showHUD(String(error), 2)
    return undefined
  }
}
