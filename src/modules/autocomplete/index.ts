import { IConfig, MbBookNote } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { checkPlainText } from "@/utils/checkInput"
import { showHUD, isOCNull } from "@/utils/common"
import { reverseEscape, escapeDoubleQuote } from "@/utils/input"
import fetch from "@/utils/network"
import { undoGroupingWithRefresh } from "@/utils/note"
import { render } from "@/utils/third party/mustache"
import pangu from "@/utils/third party/pangu"
import { lang } from "./lang"
import { CompleteSelected, Dict, FillWordInfo } from "./typings"

const { error, intro, link, option, label, help } = lang
const configs: IConfig<"autocomplete"> = {
  name: "AutoComplete",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on
    },
    {
      key: "fillWordInfo",
      type: CellViewType.Select,
      option: option.fill_word_info,
      label: label.fill_word_info
    },
    {
      key: "customFill",
      type: CellViewType.Input,
      help: help.custom_fill,
      bind: [["fillWordInfo", 1]],
      link,
      check({ input }) {
        checkPlainText(input)
      }
    }
  ],
  actions4card: [
    {
      key: "completeSelected",
      type: CellViewType.Button,
      label: label.complete_selected,
      option: option.complete_selected,
      method: async ({ nodes, option }) => {
        if (nodes.length > 5) {
          showHUD(lang.error.forbid, 2)
          return
        }
        const getCompletedWord = (node: MbBookNote) => {
          const title = node?.noteTitle
          return title
            ? utils.main(node, title.split(/\s*[;；]\s*/)[0])
            : undefined
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

const utils = {
  getPureZH(text: string) {
    const arr = text.split("\n")
    text =
      arr.length > 1
        ? arr.filter(item => !/\[.*\]/.test(item)).join("\n")
        : arr[0].replace(/\[.*\]/, "")
    return pangu.spacing(pangu.toFullwidth(text.replace(/\ba\. /g, "adj. ")))
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
      .split(/\x20+/)
      .filter(k => k)
  },

  getCollinsStar(num: number) {
    return "⭐".repeat(num)
  },

  getFillInfo(info: Dict) {
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
      tags: null2false(info.tag, t => utils.getTag(t).join("/")),
      collins: null2false(info.collins, t => utils.getCollinsStar(Number(t))),
      en: null2false(info.definition),
      zh: null2false(info.translation, t => utils.getPureZH(t))
    }
    return render(template, vars)
  },

  async main(note: MbBookNote, text: string) {
    try {
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
        title = utils.getWordEx(word, info.exchange as string)
      }
      return {
        title,
        comments: [utils.getFillInfo(info)],
        text: ""
      }
    } catch (error) {
      console.error(String(error))
      showHUD(String(error), 2)
      return undefined
    }
  }
}

export default { configs, utils }
