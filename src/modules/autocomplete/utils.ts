import { Addon, MN } from "@/const"
import { MbBookNote } from "@/typings"
import { CGRectValue2CGRect, isOCNull, showHUD } from "@/utils/common"
import { reverseEscape, escapeDoubleQuote } from "@/utils/input"
import fetch from "@/utils/network"
import { select } from "@/utils/popup"
import { CJK } from "@/utils/text"
import { render } from "@/utils/third party/mustache"
import pangu from "@/utils/third party/pangu"
import { TranslateProviders } from "../autotranslate/typings"
import { baiduTranslate, caiyunTranslate } from "../autotranslate/utils"
import { lang } from "./lang"
import { Dict, FillWordInfo } from "./typings"
const { error } = lang

async function getPureZH(text: string) {
  const arr = pangu.spacing(pangu.toFullwidth(text)).split("\n") as string[]
  const allMeanings = arr.reduce((acc, cur) => {
    if (!/人名|\[.+\]/.test(cur)) acc.push(cur.replace(/\ba\. /g, "adj. "))
    return acc
  }, [] as string[])
  const { selectMeaning } = self.globalProfile.autocomplete
  if (selectMeaning) {
    const m = allMeanings
      .map(k => {
        const [category, meaning] = k.split(/^(\w+)\.\s*/).filter(k => k)
        if (meaning)
          return meaning.split(/\s*[,，]\s*/).map(k => `${category}. ${k}`)
        else return k
      })
      .flat()
    if (m.length > 1) return [await select(m, lang.choose_meaning, Addon.title)]
  }
  return allMeanings
}

async function getEN(text: string) {
  const allMeanings = text.split("\n")
  const { selectMeaning } = self.globalProfile.autocomplete
  if (selectMeaning && allMeanings.length > 1) {
    return [await select(allMeanings, lang.choose_meaning, Addon.title)]
  } else return allMeanings
}

async function getWordInfo(word: string): Promise<Dict> {
  const res = await fetch("http://dict.e.opac.vip/dict.php?sw=" + word).then(
    res => res.json()
  )
  const info = <Dict[]>res.filter((info: any) => info.word == info.sw)
  if (!info.length) throw error.not_find_word
  return info[0]
}

function getWordEx(lemma: string, ex: string | OCNull) {
  // s:demands/p:demanded/i:demanding/d:demanded/3:demands
  if (!ex || isOCNull(ex)) return [lemma]
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

function getTag(str: string) {
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

function getCollinsStar(num: number) {
  return "⭐".repeat(num)
}

function null2false(
  v: OCNull | string,
  f: (t: string) => string | string[] = t => t
) {
  if (isOCNull(v)) return undefined
  const res = f(v as string)
  return res ? res : undefined
}

async function getFillInfo(info: Dict) {
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
  let en
  let zh
  if (
    template.includes("{{zh}}") &&
    info.translation &&
    !isOCNull(info.translation)
  )
    zh = (await getPureZH(info.translation)).join("\n")
  if (
    template.includes("{{en}}") &&
    info.definition &&
    !isOCNull(info.definition)
  )
    en = (await getEN(info.definition)).join("\n")

  const vars = {
    word: null2false(info.word),
    phonetic: null2false(info.phonetic),
    tags: null2false(info.tag, t => getTag(t).join("/")),
    collins: null2false(info.collins, t => getCollinsStar(Number(t))),
    en,
    zh
  }
  return render(template, vars).trim()
}

export async function getLemmaInfo(word: string) {
  const info = await getWordInfo(word)
  const { exchange } = info
  if (exchange && !isOCNull(exchange)) {
    const lemma = exchange.replace(/^0:(\w+).*$/, "$1")
    if (lemma != exchange) {
      word = lemma
      return await getWordInfo(lemma)
    }
  }
  return info
}

export async function completeWord(text: string, note: MbBookNote) {
  try {
    const pureText = text.replace(
      new RegExp(`^[^${CJK}a-zA-Z]*(\\w+)[^${CJK}a-zA-Z]*$`, "g"),
      "$1"
    )
    if (!/^\w[a-z]+$/.test(pureText)) return undefined
    const word = pureText.toLowerCase()
    const info = await getLemmaInfo(word)
    const title = getWordEx(info.word, info.exchange)
    const { context, translation } = await (async () => {
      const { autoContext, translateContext } = self.globalProfile.autocomplete
      const res = {
        context: "",
        translation: ""
      }
      if (autoContext) {
        res.context = getContext(note, pureText) ?? ""
        if (res.context && translateContext) {
          const { translateProviders } = self.globalProfile.autotranslate
          res.translation =
            translateProviders[0] === TranslateProviders.Baidu
              ? await baiduTranslate(res.context, 2, 0)
              : await caiyunTranslate(res.context, 2, 0)
        }
      }
      return res
    })()
    return {
      title,
      comments: [await getFillInfo(info), context, translation],
      text: ""
    }
  } catch (error) {
    console.error(error)
    showHUD(String(error), 2)
    return undefined
  }
}

function getContext(note: MbBookNote, text: string) {
  if (!note.excerptText) return
  const data = MN.db
    .getDocumentById(note.docMd5!)
    ?.textContentsForPageNo(note.startPage!)
  const [x1, y1, x2, y2] = reverseEscape(
    `[${note.startPos},${note.endPos}]`
  ) as number[]
  const wordY = y1 < y2 ? y1 : y2
  const wordX = x1 < x2 ? x1 : x2
  if (data?.length) {
    let contextArray = data.reduce(
      (acc, cur) => {
        const { y } = CGRectValue2CGRect(cur[0].rect)
        const des = y - wordY
        if (des < 50 && des > -50) {
          let flag = 0
          let line = cur.reduce((a, c) => {
            a += String.fromCharCode(Number(c.char))
            if (flag !== 1 && des < 5 && des > -5) {
              const { x } = CGRectValue2CGRect(c.rect)
              if (x - wordX < 5 && x - wordX > -5) flag = 1
              else flag = 2
            }
            return a
          }, "")
          if (!line.endsWith(" ")) line += " "
          if (
            acc.length &&
            /\w\s*$/.test(acc[acc.length - 1].text) &&
            /^\s*(?:[A-Z]\w+|[A-Z]\.|\d+\.|\W)/.test(line)
          ) {
            acc[acc.length - 1].text = acc[acc.length - 1].text.trim() + "."
          }
          line &&
            acc.push({
              text: line,
              flag,
              des,
              index: acc.length
            })
        }
        return acc
      },
      [] as {
        text: string
        flag: number
        des: number
        index: number
      }[]
    )
    const row = contextArray.filter(k => k.flag !== 0)
    if (row.length > 1) {
      const x = row.findIndex(k => k.flag === 1)
      if (x === 0) {
        contextArray = contextArray.slice(0, row[x + 1].index)
      } else if (x === row.length - 1) {
        contextArray = contextArray.slice(row[x - 1].index)
      } else
        contextArray = contextArray.slice(row[x - 1].index, row[x + 1].index)
    }
    const context = contextArray.map(k => k.text).join("")
    if (context.includes(text)) {
      const res = context
        .replace(
          new RegExp(`^.*?([\u0000-\u00ff]*${text}[\u0000-\u00ff]*).*$`),
          "$1"
        )
        .replace(new RegExp(`^.*\\(([^)]*?${text}[^)]*?)\\).*$`), "$1")
        .replace(new RegExp(`^.*“([^”]*?${text}[^”]*?)”.*$`), "$1")
        .replace(new RegExp(`^.*"([^"]*?${text}[^"]*?)".*$`), "$1")
        .replace(new RegExp(`^.*\\[([^\\]]*?${text}[^\\]]*?)\\].*$`), "$1")
        .replace(
          new RegExp(
            `^.*?[ ,!.?)\\]]*?((?:\\d\\.\\d|[/()a-zA-Z0-9, \\-—'"’‘“”$])*${text}(?:\\d\\.\\d|[/()a-zA-Z0-9, \\-—'"‘“’”$])*[.?!]).*$`
          ),
          "$1"
        )
        .trim()
        .replace(/^O([A-Z])\w/, "$1")
      if (!/^\w+$/.test(res)) return res
    }
  }
}
