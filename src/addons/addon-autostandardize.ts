import { excerptNotes } from "utils/notebook"
import pangu from "utils/pangu"
import { isHalfWidth } from "utils/public"
const config: IConfig = {
  name: "AutoStandardize",
  intro: "优化摘录和标题的中英文排版\nPowerd by Pangu.js",
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: "摘录时自动执行"
    },
  ],
  actions: [
    {
      key: "standardizeSelected",
      type: cellViewType.button,
      label: "优化摘录和标题排版"
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
    // 去掉重复符号，及空格
    text = this.removeRepeat(text)
    // pangu 主要是加空格，以及换成全角字符
    text = pangu.spacing(text)
    return text
  },
}

const action: IActionMethod = {
  standardizeSelected({ nodes }) {
    for (const node of nodes) {
      const title = node.noteTitle
      if (title) {
        node.noteTitle = util.standardizeText(title)
      }
      const notes = excerptNotes(node)
      for (const note of notes) {
        const text = note.excerptText
        if (text) {
          note.excerptText = util.standardizeText(text)
        }
      }
    }
  }
}

export default { config, util, action }