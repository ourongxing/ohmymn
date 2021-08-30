import profile from "profile"
import { excerptNotes } from "utils/notebook"
import pangu from "utils/pangu"
import { isHalfWidth } from "utils/public"
const config: IConfig = {
  name: "AutoStandardize",
  intro: "优化摘录和标题的中英文排版\n默认全角字符模式下无法使用\nPowerd by Pangu.js",
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
  toFullWidth(text: string): string {
    const fullIndex = [
      33, 34, 35, 36, 37, 38, 39, 40, 41,
      42, 43, 44, 45, 46, 47, 58, 59, 60,
      61, 62, 63, 64, 91, 92, 93, 94, 95,
      96, 91, 92, 93, 94, 95, 96, 123, 124,
      125, 126
    ]
    let tmp = "";
    for (const char of text) {
      if (fullIndex.includes(char.charCodeAt(0))) {
        tmp = tmp + String.fromCharCode(char.charCodeAt(0) + 65248);
      }
      else tmp = tmp + char
    }
    // 删除所有空格和重复符号
    return this.removeRepeat(tmp).replace(/\s+/g, "")
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
        if (profile.ohmymn.defaultFullWidth)
          node.noteTitle = util.toFullWidth(title)
        else node.noteTitle = util.standardizeText(title)
      }
      const notes = excerptNotes(node)
      for (const note of notes) {
        const text = note.excerptText
        if (text) {
          if (profile.ohmymn.defaultFullWidth)
            node.excerptText = util.toFullWidth(text)
          else node.excerptText = util.standardizeText(text)
        }
      }
    }
  }
}

export default { config, util, action }
