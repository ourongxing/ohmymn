import { lang } from "./lang"
import type { MbBookNote, IConfig, ICheckMethod } from "typings"
import { cellViewType } from "typings/enum"
import { isOCNull, showHUD } from "utils/common"
import { escapeDoubleQuote, reverseEscape } from "utils/input"
import fetch from "utils/network"
import { undoGroupingWithRefresh } from "utils/note"
import pangu from "utils/third party/pangu"
import { ActionKey, CompleteSelected, FillWordInfo } from "./enum"
import { profilePreset } from "profile"
import { checkPlainText } from "utils/checkInput"

const { error, intro, link, option, label, help } = lang
const profileTemp = {
  ...profilePreset.autocomplete
}

const configs: IConfig<typeof profileTemp, typeof ActionKey> = {
  name: "AutoComplete",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: label.on
    },
    {
      key: "fillWordInfo",
      type: cellViewType.select,
      option: option.fill_word_info,
      label: label.fill_word_info
    },
    {
      key: "customFill",
      type: cellViewType.input,
      help: help.custom_fill,
      bind: [["fillWordInfo", 1]],
      link
    }
  ],
  actions4card: [
    {
      key: "completeSelected",
      type: cellViewType.button,
      label: label.complete_selected,
      option: option.complete_selected,
      method: async ({ nodes, option }) => {
        if (nodes.length > 5) {
          showHUD(lang.error.forbid, 2)
          return
        }
        const getCompletedWord = (node: MbBookNote) => {
          const title = node?.noteTitle
          return title ? utils.main(title.split(/\s*[;；]\s*/)[0]) : undefined
        }
        const allInfo = await Promise.all(
          nodes.map(node => getCompletedWord(node))
        )
        undoGroupingWithRefresh(() => {
          nodes.forEach((node, index) => {
            const info = allInfo?.[index]
            if (info) {
              node.noteTitle = info.title.join("; ")
              if (option == CompleteSelected.AlsoFillWordInfo)
                node.excerptText = info.text
            }
          })
        })
      }
    }
  ]
}

type Dict = {
  word: string
  sw: string
  // 下面这些都有可能是 NSNull
  exchange: string
  phonetic: string
  definition: string
  translation: string
  tag: string
  collins: string
}

const utils = {
  getPureZH(text: string) {
    const arr = text.split("\n")
    text =
      arr.length > 1
        ? arr.filter(item => !/\[.*\]/.test(item)).join("\n")
        : arr[0].replace(/\[.*\]/, "")
    return text.replace(/\ba\. /g, "adj. ")
  },

  async getWordInfo(word: string): Promise<Dict> {
    const res = await fetch("http://dict.e.opac.vip/dict.php?sw=" + word).then(
      res => res.json()
    )
    const info = <Dict[]>res.filter((info: any) => info.word == info.sw)
    if (!info.length) throw error.not_find_word
    return info[0]
  },

  getWordEx(lemma: string, ex: string) {
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
  },

  getTag(str: string) {
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
      .replace(/\x20/g, "/")
  },
  getCollinsStar(num: number) {
    return "⭐".repeat(num)
  },
  getFillInfo(info: Dict) {
    const { customFill, fillWordInfo } = self.profile.autocomplete
    if (
      fillWordInfo[0] === FillWordInfo.None ||
      (fillWordInfo[0] === FillWordInfo.Custom && !customFill)
    )
      return ""
    const template =
      fillWordInfo[0] === FillWordInfo.Custom
        ? reverseEscape(`"${escapeDoubleQuote(customFill)}"`)
        : "{{zh}}"

    // 这里有点坑爹，OC 的 JSON 转换会把 null 转成 NSNull，NSNull 在 JS 中是一个对象
    const vars = {
      word: info.word,
      phonetic: isOCNull(info.phonetic) ? "" : info.phonetic,
      tag: isOCNull(info.tag) ? "" : utils.getTag(info.tag),
      collins: isOCNull(info.collins)
        ? ""
        : utils.getCollinsStar(Number(info.collins)),
      en: isOCNull(info.definition) ? "" : info.definition,
      zh: isOCNull(info.translation) ? "" : utils.getPureZH(info.translation!)
    }
    const varsReg = `(?:${Object.keys(vars).join("|")})`
    const braceReg = new RegExp(`{{(${varsReg})}}`, "g")
    const bracketReg = new RegExp(
      `\\\(\\\((.*?{{(${varsReg})}}.*?)\\\)\\\)`,
      "gs"
    )
    const text = template
      .replace(
        bracketReg,
        (match: string, bracket: string, brace: keyof typeof vars) =>
          /**
           * ((星级：{{collins}}))
           * bracket (())  星级：{{collins}}
           * brace {{}}   collins
           */
          vars[brace] ? bracket.replace(`{{${brace}}}`, vars[brace]) : ""
      )
      .replace(braceReg, (match: string, brace: keyof typeof vars) =>
        vars[brace] ? vars[brace] : ""
      )
      .trim()
    // 优化一下格式
    return pangu.spacing(pangu.toFullwidth(text))
  },
  /**
   * @param text 先去除划重点
   */
  async main(text: string) {
    try {
      // 只有第一个字母可以大写，否则直接返回
      if (!/^\w[a-z]+$/.test(text)) return undefined
      let word = text.toLowerCase()
      let info = await utils.getWordInfo(word)
      const ex = info.exchange
      let title = [word]
      if (ex && !isOCNull(ex)) {
        const lemma = ex.replace(/^0:(\w+).*$/, "$1")
        if (lemma != ex) {
          word = lemma
          info = await utils.getWordInfo(lemma)
        }
        // 原型必然有 exchange，不然哪来的它
        title = utils.getWordEx(word, info.exchange)
      }
      return {
        title,
        text: utils.getFillInfo(info)
      }
    } catch (error) {
      console.error(String(error))
      showHUD(String(error), 2)
      return undefined
    }
  }
}

const checker: ICheckMethod<PickByValue<typeof profileTemp, string>> = (
  input,
  key
) => {
  switch (key) {
    case "customFill":
      checkPlainText(input)
      break
    default:
      return undefined
  }
}

const autocomplete = { configs, utils, checker }
export default autocomplete
