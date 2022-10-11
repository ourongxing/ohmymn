import { Addon } from "~/addon"
import { escapeDoubleQuote, CJK, reverseEscape, serialSymbols } from "~/utils"
import {
  CGRectValue2CGRect,
  isfileExists,
  isNSNull,
  showHUD,
  fetch,
  MN,
  popup,
  selectIndex
} from "marginnote"

import { render } from "~/utils/third party/mustache"
import pangu from "~/utils/third party/pangu"
import { TranslateProviders } from "../autotranslate/typings"
import { baiduTranslate, caiyunTranslate } from "../autotranslate/utils"
import { lang } from "./lang"
import { Word, FillWordInfo, Exchange } from "./typings"
import { MbBookNote, UIAlertViewStyle } from "marginnote"

async function selectParaphrase(
  obj: Record<string, string[]>,
  message: string,
  title: string
) {
  const parts = Object.entries(obj)
    .map(k => k[1].map(m => `${k[0]}. ${m}`))
    .flat()
    .slice(0, 9)
  const { option, content } = await popup(
    {
      title,
      message,
      buttons: [
        ...parts.map((k, i) => `${serialSymbols.hollow_circle_number[i]} ${k}`),
        "自定义"
      ],
      multiLine: true,
      canCancel: false,
      type: UIAlertViewStyle.PlainTextInput
    },
    ({ alert, buttonIndex }) => ({
      option: buttonIndex,
      content: alert.textFieldAtIndex(0).text
    })
  )
  if (option < parts.length) return parts[option]
  else if (content) {
    return (reverseEscape(content, true) as string)
      .replace(/\s*\[\s*([a-z]+)\s*\]\s*/, (_, m) => {
        if (m === "all")
          return Object.entries(obj)
            .map(k => `${k[0]}. ${k[1].join("; ")}`)
            .join("\n")
        if (m in obj) return `${m}. ${obj[m].join("; ")}`
        else return ""
      })
      .replace(/\s*\[([0-9\-]+)\]\s*/, (_, m) => {
        const matched = Array.from({ length: parts.length }, (v, i) => i + 1)
          .join(", ")
          .match(new RegExp(`[${m}]`, "g"))
        if (matched?.length) {
          return (
            "\n" +
            Object.entries(
              matched.reduce((acc, k) => {
                const [part, meaning] = parts[Number(k) - 1]
                  .split(/^(\w+)\.\s*/)
                  .filter(k => k)
                acc[part] = [...(acc[part] ?? []), meaning]
                return acc
              }, {} as Record<string, string[]>)
            )
              .map(k => `${k[0]}. ${k[1].join("; ")}`)
              .join("\n") +
            "\n"
          )
        } else return ""
      })
      .trim()
  }
}

async function getPureZH(text: string, isSelect = false) {
  const arr = pangu.spacing(pangu.toFullwidth(text)).split("\n") as string[]
  const allMeanings = arr.reduce((acc, cur) => {
    if (!/人名|\[.+\]/.test(cur)) acc.push(cur.replace(/^a\.\s*/gm, "adj. "))
    return acc
  }, [] as string[])
  if (isSelect) {
    const m = {} as Record<string, string[]>
    allMeanings.forEach(k => {
      const [part, meaning] = k.split(/^(\w+)\.\s*/).filter(k => k)
      if (meaning) {
        if (/[；;]/.test(meaning))
          m[part] = [
            ...(m[part] ?? []),
            ...meaning.split(/\s*[；;]\s*/).map(k => k)
          ]
        else {
          m[part] = [
            ...(m[part] ?? []),
            ...meaning.split(/\s*[,，]\s*/).map(k => k)
          ]
        }
      } else m.un = [k]
    })
    if (Object.values(m).flat().length > 1)
      return await selectParaphrase(m, lang.choose_meaning, Addon.title)
  }
  return allMeanings.join("\n")
}

async function getEN(text: string, isSelect = false) {
  const allMeanings = text
    .split("\n")
    .map(k => k.replace(/^a\.\s*/gm, "adj. ").replace(/^[rs]\.\s*/gm, "adv. "))
  if (isSelect) {
    const m = {} as Record<string, string[]>
    allMeanings.forEach(k => {
      const [part, meaning] = k.split(/^(\w+)\.\s*/).filter(k => k)
      if (meaning) {
        if (/[；;]/.test(meaning))
          m[part] = [
            ...(m[part] ?? []),
            ...meaning.split(/\s*[；;]\s*/).map(k => k)
          ]
        else {
          m[part] = [
            ...(m[part] ?? []),
            ...meaning.split(/\s*[,，]\s*/).map(k => k)
          ]
        }
      } else m.un = [k]
    })
    if (Object.values(m).flat().length > 1)
      return await selectParaphrase(m, lang.choose_meaning, Addon.title)
  }
  return allMeanings.join("\n")
}

async function getWordInfo(word: string): Promise<Word> {
  const { dataSource } = self.globalProfile.autocomplete
  function unifiyData(obj: any) {
    const newObj = {} as Word
    Object.entries(obj).forEach(([k, v]) => {
      if (isNSNull(v) || !v) newObj[k] = undefined
      else if (!Number.isNaN(Number(v))) newObj[k] = Number(v)
      else newObj[k] = v
    })
    return newObj
  }
  if (dataSource[0] === 0) {
    const res = await fetch("http://dict.e.opac.vip/dict.php?sw=" + word).then(
      res => res.json()
    )
    const info = <Word[]>res.filter((info: any) => info.word == info.sw)
    if (!info.length) throw ""
    return unifiyData(info[0])
  } else {
    if (!Addon.dataAutoComplete) {
      if (isfileExists(`${Addon.path}/AutoCompleteData.db`)) {
        Addon.dataAutoComplete = SQLiteDatabase.databaseWithPath(
          `${Addon.path}/AutoCompleteData.db`
        )
        Addon.dataAutoComplete.open()
      } else throw "没有本地数据库"
    }
    const query = Addon.dataAutoComplete.executeQueryWithArgumentsInArray(
      `SELECT * FROM stardict WHERE word = '${word}'`,
      []
    )
    let info!: any
    while (query.next()) {
      info = query.resultDictionary()
    }
    query.close()
    if (!info) throw ""
    return unifiyData(info)
  }
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

function undefine2undefine<T>(v: T | undefined, f?: (t: T) => string) {
  if (v) {
    if (f) {
      const res = f(v)
      if (res) return res
    } else return v
  }
}

async function getFillInfo(info: Word) {
  const { customFill, customFillFront, fillWordInfo, selectMeanings } =
    self.globalProfile.autocomplete
  if (fillWordInfo[0] === FillWordInfo.None) return ["", ""]

  const templateFront =
    fillWordInfo[0] === FillWordInfo.Custom
      ? reverseEscape(`"${escapeDoubleQuote(customFillFront)}"`)
      : ""
  const template =
    fillWordInfo[0] === FillWordInfo.Custom
      ? reverseEscape(`"${escapeDoubleQuote(customFill)}"`)
      : "{{zh}}"

  const renderTemplate = async (
    template: string,
    isSelect = [] as number[]
  ) => {
    let en
    let zh
    if (/{{\s*zh\s*}}/.test(template) && info.translation)
      zh = await getPureZH(info.translation, isSelect.includes(0))
    if (/{{\s*en\s*}}/.test(template) && info.definition)
      en = await getEN(info.definition, isSelect.includes(1))

    const vars = {
      word: info.word,
      phonetic: info.phonetic,
      tags: undefine2undefine(info.tag, t => getTag(t).join("/")),
      collins: undefine2undefine(info.collins, t => getCollinsStar(t)),
      en,
      zh
    }
    return render(template, vars).trim()
  }

  return [
    await renderTemplate(templateFront),
    await renderTemplate(template, selectMeanings)
  ]
}

function getWordEx(lemma: string, ex: string | undefined) {
  if (!ex) return [lemma]
  return Object.entries(resolveExchange(ex)).reduce(
    (acc, cur) => {
      const [k, v] = cur
      if (k !== "current" && k !== "lemma" && !acc.includes(v)) acc.push(v)
      return acc
    },
    [lemma]
  )
}

function resolveExchange(ex: string): Exchange {
  /**
       这个的意思就是 lay 的原型是 lie，它作为第三人称，但是 lay 本身也可以作为单词原型，所有后面它也有各种变换
       lay
       0:lie/1:p/d:laid/p:laid/i:laying/3:lays/s:lays
       lie
       p:lay/i:lying/3:lies/s:lies/d:lain
       lain
       0:lie/1:d
       p	过去式（did）
       d	过去分词（done）
       i	现在分词（doing）
       3	第三人称单数（does）
       r	形容词比较级（-er）
       t	形容词最高级（-est）
       s	名词复数形式
       0	Lemma，如 perceived 的 Lemma 是 perceive
       1	Lemma 的变换形式，比如 s 代表 apples 是其 lemma 的复数形式
     */
  const ret: Exchange = {}
  ex.split("/").forEach(k => {
    const [m, n] = k.split(":")
    switch (m) {
      case "s":
        ret.s = n
        break
      case "d":
        ret.done = n
        break
      case "p":
        ret.did = n
        break
      case "i":
        ret.doing = n
        break
      case "3":
        ret.does = n
        break
      case "r":
        ret.er = n
        break
      case "t":
        ret.est = n
        break
      case "0":
        ret.lemma = n
        break
      case "1":
        ret.current = n
        break
    }
  })
  return ret
}

// TODO improve context recognition
function getContext(note: MbBookNote, text: string) {
  try {
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
  } catch {
    return
  }
}

async function getLemmaInfo(word: string) {
  const info = await getWordInfo(word)
  const { exchange } = info
  if (exchange) {
    const exchanges = resolveExchange(exchange)
    const { lemma, current } = exchanges
    if (lemma && current) {
      // 说明当前单词既是原型也是其他单词的变形
      if (
        Object.keys(exchanges).length > 2 &&
        self.globalProfile.autocomplete.selectLemma
      ) {
        const i = await selectIndex(
          [word, lemma],
          Addon.title,
          "检测到当前单词既可能是其他单词的变形，也可能就是原形，请选择单词原形"
        )
        if (i) return await getWordInfo(lemma)
      } else {
        word = lemma
        return await getWordInfo(lemma)
      }
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
    const { collins } = self.globalProfile.autocomplete
    if (
      (info.collins && !collins.includes(Number(info.collins))) ||
      (!info.collins && !collins.includes(0))
    ) {
      return undefined
    }
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
          res.translation = await (async () => {
            try {
              return translateProviders[0] === TranslateProviders.Baidu
                ? await baiduTranslate(res.context, 2, 0)
                : await caiyunTranslate(res.context, 2, 0)
            } catch {
              showHUD("上下文翻译失败，请检查 AutoTranslate 是否工作正常。")
              return ""
            }
          })()
        }
      }
      return res
    })()
    return {
      title,
      comments: [...(await getFillInfo(info)), context, translation],
      text: ""
    }
  } catch (error) {
    console.error(error)
    error && showHUD(String(error), 2)
    return undefined
  }
}
