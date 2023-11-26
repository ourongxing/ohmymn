import {
  CGRectValue2CGRect,
  copyFile,
  delay,
  fetch,
  HUDController,
  isfileExists,
  isNSNull,
  MN,
  openFile,
  openURL,
  popup,
  select,
  showHUD
} from "marginnote"
import { Addon } from "~/addon"
import { CJK, CJKRegex, escapeDoubleQuote, reverseEscape } from "~/utils"

import type { MbBookNote } from "marginnote"
import { UIAlertViewStyle } from "marginnote"
import Mustache from "~/utils/third party/mustache"
import pangu from "~/utils/third party/pangu"
import lang from "./lang"
import type { Exchange, Word } from "./typings"
import { FillWordInfo } from "./typings"

async function selectParaphrase(
  obj: Record<string, string[]>,
  message: string,
  title: string
) {
  const parts = Object.entries(obj)
    .map(k => k[1].map(m => `${k[0]}. ${m}`))
    .flat()
    .slice(0, 9)
  const { buttonIndex: option, inputContent: content } = await popup({
    title,
    message,
    buttons: [...parts.map((k, i) => `(${i + 1}) ${k}`), lang.custom],
    multiLine: true,
    canCancel: true,
    type: UIAlertViewStyle.PlainTextInput
  })
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
  function unifiyData(obj: any) {
    const newObj = {} as Word
    Object.entries(obj).forEach(([k, v]) => {
      if (isNSNull(v) || !v) newObj[k] = undefined
      else if (!Number.isNaN(Number(v))) newObj[k] = Number(v)
      else newObj[k] = v
    })
    return newObj
  }
  // if (dataSource[0] === 0) {
  if (0) {
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
      } else {
        const { index } = await select(
          lang.not_find_db.$options2,
          undefined,
          lang.not_find_db.message,
          true
        )
        switch (index) {
          case 0:
            openURL(
              "https://github.com/ourongxing/ohmymn/releases/tag/database"
            )
            throw ""
          case 1:
            {
              const path = await openFile("com.pkware.zip-archive")
              if (path) {
                if (
                  path.endsWith("AutoCompleteData.zip") ||
                  path.endsWith("AutoCompleteData.online.zip")
                ) {
                  HUDController.show(lang.not_find_db.wait)
                  await delay(0.1)
                  copyFile(path, `${Addon.path}/AutoCompleteData.zip`)
                  ZipArchive.unzipFileAtPathToDestination(
                    `${Addon.path}/AutoCompleteData.zip`,
                    Addon.path
                  )
                  HUDController.hidden()
                  if (isfileExists(`${Addon.path}/AutoCompleteData.db`)) {
                    Addon.dataAutoComplete = SQLiteDatabase.databaseWithPath(
                      `${Addon.path}/AutoCompleteData.db`
                    )
                    Addon.dataAutoComplete.open()
                  } else {
                    throw lang.not_find_db.wrong_file
                  }
                } else {
                  throw lang.not_find_db.wrong_file
                }
              }
            }
            break
          default:
            throw ""
        }
      }
    }
    const query = Addon.dataAutoComplete!.executeQueryWithArgumentsInArray(
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
    // @ts-ignore
    return Mustache.render(template, vars).trim()
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
          // 上下 50
          if (des < 50 && des > -50) {
            let flag = 0
            let line = cur.reduce((k, c) => {
              k += String.fromCharCode(Number(c.char))
              if (flag !== 1 && des < 5 && des > -5) {
                const { x } = CGRectValue2CGRect(c.rect)
                // 上下左右 5，当前单词所在行
                if (x - wordX < 5 && x - wordX > -5) {
                  flag = 1
                  k += "orogxng"
                } else flag = 2
              }
              return k
            }, "")
            line = line.replace(CJKRegex, ".$1.")
            if (flag === 1) {
              const index = line.indexOf("orogxng")
              line = line.replace("orogxng", "")
              const matched = line.match(new RegExp(text, "g"))
              if (!matched?.length) throw ""
              if (matched.length === 1) {
                line = line.replace(text, "orogxng")
              } else {
                line = line.replace(new RegExp(text, "g"), (_, i) => {
                  if (index - i > -5 && index - i < 5) return "orogxng"
                  return _
                })
              }
            }
            // 每一行后面加上空格，不包括 "-" 结尾
            if (!/[ \-]$/.test(line)) line += " "
            // 如果前一行以空格结尾，当前行以大写，数字+"." ，或者非字母开头，就把前一行看作单独一句话。
            if (
              acc.length &&
              !/-$/.test(acc[acc.length - 1].text) &&
              /^(?:\s+|[A-Z]\w*|[^A-Za-z-])/.test(line)
            ) {
              acc[acc.length - 1].text = acc[acc.length - 1].text.trim() + "..."
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
      let [head, tail] = context.split(/\s*orogxng\s*/)
      head = head.replace(
        /^.*(?:[?!。？！…;；]|\.(?!\d))\s*(.*)$|^\s*(.*)$/,
        "$1$2"
      )
      tail = tail.replace(
        /^(\s*.*?(?:[?!。？！…;；]|\.(?!\d))).*$|^(.*)\s*$/,
        "$1$2"
      )
      const res = [
        head,
        /\W$/.test(head) ? "" : " ",
        text,
        /^\W/.test(head) ? "" : " ",
        tail
      ]
        .join("")
        .replace(/^\.+/, "")
        .replace(/^[\[【(]?(?:\d+|[A-Za-z])[\]】)]/, "")

      if (!/^\w+$/.test(res)) return res
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
        const { index } = await select(
          [word, lemma],
          Addon.title,
          lang.maybe_other_word
        )
        if (index) return await getWordInfo(lemma)
      } else {
        word = lemma
        return await getWordInfo(lemma)
      }
    }
  }
  return info
}

export async function completeWord(
  text: string,
  note: MbBookNote,
  needInfo = false
) {
  try {
    const pureText = text.replace(
      new RegExp(`^[^${CJK}a-zA-Z]*(\\w+)[^${CJK}a-zA-Z]*$`, "g"),
      "$1"
    )
    if (!/^\w[a-z]+$/.test(pureText)) return undefined
    const word = pureText.toLowerCase()
    const info = await getLemmaInfo(word)
    const { collins, autoContext } = self.globalProfile.autocomplete
    if (
      (info.collins && !collins.includes(Number(info.collins))) ||
      (!info.collins && !collins.includes(0))
    ) {
      return undefined
    }
    const title = getWordEx(info.word, info.exchange)
    if (needInfo) {
      const context = autoContext ? getContext(note, pureText) ?? "" : ""
      return {
        title,
        comments: [...(await getFillInfo(info))],
        text: context
      }
    } else {
      return {
        title,
        comments: [],
        text: ""
      }
    }
  } catch (error) {
    MN.error(error)
    error && showHUD(String(error), 2)
    return undefined
  }
}
