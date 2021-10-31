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
      key: "preset",
      type: cellViewType.muiltSelect,
      option: [
        "英文标题规范化",
        "去除重复符号",
        "半全角符号转换",
        "中英文加空格"
      ],
      label: "选择需要的预设"
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
    return profile.autostandardize.preset.includes(0) && isHalfWidth(text)
      ? toTitleCase(text)
      : text
  },
  standardizeText(text: string): string {
    if (isHalfWidth(text)) return text
    const preset = profile.autostandardize.preset
    text = text.replace(/\*\*/g, "占位符")
    for (const set of preset) {
      switch (set) {
        case 1:
          text = this.removeRepeat(text)
          break
        case 2:
          text = pangu.toFullwidth(text)
          break
        case 3:
          text = pangu.spacing(text)
      }
    }
    // 划重点会产生 **包裹文字**
    return text.replace(/占位符/g, "**")
  }
}

const action: IActionMethod = {
  standardizeSelected({ nodes, option }) {
    // option: ["都优化", "仅优化标题", "仅优化摘录"]
    for (const node of nodes) {
      const title = node.noteTitle
      if (title && option != 2) {
        const newTitle = util.standardizeText(title)
        node.noteTitle = util.toTitleCase(newTitle)
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
