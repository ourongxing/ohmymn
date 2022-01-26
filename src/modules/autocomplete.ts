import lang from "lang"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import { MbBookNote } from "types/MarginNote"
import { isOCNull, showHUD } from "utils/common"
import { escapeDoubleQuote, reverseEscape } from "utils/input"
import fetch from "utils/network"
import { undoGroupingWithRefresh } from "utils/note"
import pangu from "utils/pangu"
import { isHalfWidth, countWord } from "utils/text"

const { error, intro, link, option, label } = lang.module.autocomplete
const config: IConfig = {
  name: "AutoComplete",
  intro,
  link,
  settings: [
    {
      key: "fillWordInfo",
      type: cellViewType.select,
      option: option.fill_word_info,
      label: label.fill_word_info
    },
    {
      key: "customFill",
      type: cellViewType.input,
      label: label.custom_fill,
      bind: [["fillWordInfo", 1]],
      link
    }
  ],
  actions: [
    {
      key: "completeSelected",
      type: cellViewType.button,
      label: label.complete_selected,
      option: option.complete_selected
    }
  ]
}

export const enum FillWordInfo {
  None,
  Custom,
  Chinese
}

type Dict = {
  word: string
  sw: string
  exchange?: string
  // 下面这些都有可能是 NSNull
  phonetic: string
  definition: string
  translation: string
  tag: string
  collins: string
}

const util = {
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

  getWordEx(lemma: string, ex: string): string {
    // s:demands/p:demanded/i:demanding/d:demanded/3:demands
    const arr = ex.split(/\//).reduce(
      (acc, k) => {
        if (!/[01]:/.test(k)) {
          const word = k.slice(2)
          if (!acc.includes(word)) acc.push(word)
        }
        return acc
      },
      [lemma]
    )
    return arr.join("; ")
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
      tag: isOCNull(info.tag) ? "" : this.getTag(info.tag),
      collins: isOCNull(info.collins)
        ? ""
        : this.getCollinsStar(Number(info.collins)),
      en: isOCNull(info.definition) ? "" : info.definition,
      zh: isOCNull(info.translation) ? "" : this.getPureZH(info.translation!)
    }
    const varsReg = `(?:${Object.keys(vars).join("|")})`
    const braceReg = new RegExp(`{{(${varsReg})}}`, "g")
    const bracketReg = new RegExp(
      `\\\(\\\((.*?{{(${varsReg})}}.*?)\\\)\\\)`,
      "g"
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
      .replace(/^\s*[\r\n]/gm, "")
    // 优化一下格式
    return pangu.spacing(pangu.toFullwidth(text))
  },
  async getCompletedWord(text: string) {
    try {
      if (!isHalfWidth(text) || countWord(text) != 1) throw "不是单词"
      let title = text.toLowerCase()
      let info = await this.getWordInfo(title)
      if (info.exchange) {
        const ex = info.exchange
        const lemma = ex.replace(/^0:(\w+).*$/, "$1")
        if (lemma != ex) {
          title = lemma
          info = await this.getWordInfo(lemma)
        }
        title = this.getWordEx(title, info.exchange!)
      }
      return {
        title,
        text: this.getFillInfo(info)
      }
    } catch (error) {
      console.log(error, "autocomplete")
      if (error != "不是单词") showHUD(String(error))
      return undefined
    }
  }
}

const enum CompleteSelected {
  OnlyComplete,
  AlsoFillWordInfo
}

const action: IActionMethod = {
  async completeSelected({ nodes, option }) {
    if (nodes.length > 5) {
      showHUD(lang.module.autocomplete.error.forbid, 2)
      return
    }
    const getCompletedWord = (node: MbBookNote) => {
      const title = node?.noteTitle
      return title
        ? util.getCompletedWord(title.split(/\s*[;；]\s*/)[0])
        : undefined
    }
    const allInfo = await Promise.all(nodes.map(node => getCompletedWord(node)))
    undoGroupingWithRefresh(() => {
      nodes.forEach((node, index) => {
        const info = allInfo?.[index]
        if (info) {
          node.noteTitle = info.title
          if (option == CompleteSelected.AlsoFillWordInfo)
            node.excerptText = info.text
        }
      })
    })
  }
}

export { config, util, action }
