import { excerptNotes } from "utils/note"
import pangu from "utils/pangu"
import { isHalfWidth } from "utils/text"
const config: IConfig = {
  name: "AutoStandardize",
  intro: "优化摘录和标题的中英文排版\nPowerd by Pangu.js",
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: "摘录时自动执行"
    }
  ],
  actions: [
    {
      key: "standardizeSelected",
      type: cellViewType.button,
      label: "优化摘录和标题排版",
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
  standardizeSelected({ nodes, content }) {
    // option: ["都优化", "仅优化标题", "仅优化摘录"]
    const option = Number(content)
    for (const node of nodes) {
      const title = node.noteTitle
      if (title && option != 2) {
        node.noteTitle = util.standardizeText(title)
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
