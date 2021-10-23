import { excerptNotes } from "utils/note"
import pangu from "utils/pangu"
import { toTitleCase } from "utils/toTitleCase"
import { isHalfWidth } from "utils/text"
import { profile } from "profile"
const config: IConfig = {
  name: "AutoStandardize",
  intro: "优化摘录和标题的排版与格式\nPowerd by Pangu.js",
  settings: [
    {
      key: "toTitleCase",
      type: cellViewType.switch,
      label: "英文标题规范化"
    }
  ],
  actions: [
    {
      key: "standardizeSelected",
      type: cellViewType.button,
      label: "优化排版和格式",
      option: ["都优化", "仅优化标题", "仅优化摘录"]
    }
  ]
}

const util = {
  removeRepeat(text: string): string {
    for (const char of `！!。，, `) {
      const reg = new RegExp(`${char}{2,}`, "g")
      text = text.replace(reg, char)
    }
    return text
  },
  toTitleCase(text: string) {
    return toTitleCase(text)
  },
  standardizeText(text: string): string {
    // 英文环境下全为半角，不处理
    if (isHalfWidth(text)) return text
    text = this.removeRepeat(text)
    // pangu 主要是加空格，以及换成全角字符
    text = pangu.spacing(text.replace(/\*\*/g, "😎"))
    // 划重点会产生 **包裹文字**
    return text.replace(/\x20?😎\x20?/g, "**")
  }
}

const action: IActionMethod = {
  standardizeSelected({ nodes, option }) {
    // option: ["都优化", "仅优化标题", "仅优化摘录"]
    for (const node of nodes) {
      const title = node.noteTitle
      if (title && option != 2) {
        const newTitle = util.standardizeText(title)
        node.noteTitle = profile.autostandardize.toTitleCase
          ? util.toTitleCase(newTitle)
          : newTitle
        if (option == 1) continue
      }
      const notes = excerptNotes(node)
      for (const note of notes) {
        const text = note.excerptText
        if (text) note.excerptText = util.standardizeText(text)
      }
    }
  }
}

export { config, util, action }
