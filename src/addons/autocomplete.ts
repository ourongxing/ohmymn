import { profile } from "profile"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import { isOCNull, log, showHUD } from "utils/common"
import { reverseEscape } from "utils/input"
import fetch from "utils/network"
import { RefreshAfterDBChange, undoGrouping } from "utils/note"
import { isHalfWidth, countWord } from "utils/text"
import { util as autostandardize } from "./autostandardize"

const config: IConfig = {
  name: "AutoComplete",
  intro: "补全单词词形，只支持动词和名词",
  settings: [
    {
      key: "customComplete",
      type: cellViewType.input,
      label: "自定义摘录填充信息，点击查看支持变量",
      link: "https://busiyi.notion.site/AutoComplete-1eab78ee6d7648339e088c593326b5ca"
    }
  ],
  actions: [
    {
      key: "completeSelected",
      type: cellViewType.button,
      label: "补全单词词形",
      option: ["仅补全单词词形", "同时填充单词信息"]
    }
  ]
}

const enum CompleteSelected {
  OnlyComplete,
  AlsoFillWordInfo
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
    if (!info.length) throw "查询不到该单词"
    return info[0]
  },

  getWordEx(lemma: string, ex: string): string {
    // s:demands/p:demanded/i:demanding/d:demanded/3:demands
    const arr = ex
      .split(/\//)
      .filter(item => !/[01]:/.test(item))
      .map(item => item.slice(2))
    return [...new Set([lemma, ...arr])].join("; ")
  },

  getTag(str: string) {
    const re = [
      ["zk", "中考"],
      ["gk", "高考"],
      ["cet4", "四级"],
      ["cet6", "六级"],
      ["ky", "考研"],
      ["gre", "GRE"],
      ["toefl", "托福"],
      ["ielts", "雅思"]
    ]
    for (const [a, b] of re) str = str.replace(a, b)
    return str.replace(/ /g, "/")
  },
  getCollinsStar(num: number) {
    return "⭐".repeat(num)
  },
  async checkGetWord(text: string) {
    try {
      if (!isHalfWidth(text) || countWord(text) != 1) throw "不是单词"
      text = text.toLowerCase()
      let title = text
      let info = await this.getWordInfo(text)
      if (info.exchange) {
        const ex = info.exchange
        const lemma = ex.replace(/^0:(\w*)\/[^/]*$/, "$1")
        if (lemma != ex) {
          text = lemma
          info = await this.getWordInfo(lemma)
        }
        title = this.getWordEx(text, info.exchange!)
      }

      // 这里有点坑爹，OC 的 JSON 转换会把 null 转成 NSNull，NSNull 在 JS 中是一个对象
      const vars = {
        word: text,
        phonetic: isOCNull(info.phonetic) ? "" : info.phonetic,
        tag: isOCNull(info.tag) ? "" : this.getTag(info.tag),
        collins: isOCNull(info.collins)
          ? ""
          : this.getCollinsStar(Number(info.collins)),
        en: isOCNull(info.definition) ? "" : info.definition,
        zh: isOCNull(info.translation) ? "" : this.getPureZH(info.translation!)
      }
      if (profile.autocomplete.customComplete) {
        let fill = reverseEscape(profile.autocomplete.customComplete)
        Object.entries(vars).forEach(([key, value]) => {
          const reg = new RegExp(`{{${key}}}`, "g")
          fill = fill.replace(reg, <string>value)
        })
        text = autostandardize.standardizeText(fill)
      }
      return {
        title,
        text
      }
    } catch (error) {
      log(error, "autocomplete")
      switch (error) {
        case "请求超时。":
          showHUD("请求超时，请检查网络连接！")
      }
      return false
    }
  }
}

const action: IActionMethod = {
  // 如果有标题，摘录为空，或者摘录与标题相同时，才会起作用
  async completeSelected({ nodes, option }) {
    for (const note of nodes) {
      const title = note?.noteTitle
      if (!title) continue
      const result = await util.checkGetWord(title.split(/\s*[;；]\s*/)[0])
      if (!result) continue
      undoGrouping(() => {
        note.noteTitle = result.title
        if (option == CompleteSelected.AlsoFillWordInfo)
          note.excerptText = result.text
      })
    }
    RefreshAfterDBChange()
  }
}

export { config, util, action }
