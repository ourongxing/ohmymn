import { excerptNotes } from "utils/note"
import pangu from "utils/pangu"
import { toTitleCase } from "utils/toTitleCase"
import { isHalfWidth } from "utils/text"
import { profile } from "profile"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
const option = {
  preset: ["半角转全角", "中英文加空格", "去除重复空格", "英文标题规范化"],
  standardizeSelected: ["都优化", "仅优化标题", "仅优化摘录"]
}

export const enum AutoStandardizePreset {
  HalfToFull,
  AddSpace,
  RemoveExtraSpace,
  StandardizeTitle
}

const enum StandardizeSelected {
  All,
  OnlyTitle,
  OnlyExcerptText
}

const config: IConfig = {
  name: "AutoStandardize",
  intro: "优化摘录和标题的排版与格式\nPowerd by Pangu.js",
  settings: [
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: option.preset,
      label: "选择需要的预设"
    }
  ],
  actions: [
    {
      key: "standardizeSelected",
      type: cellViewType.button,
      label: "优化排版和格式",
      option: option.standardizeSelected
    }
  ]
}

const util = {
  toTitleCase(text: string) {
    if (
      !profile.autostandardize.preset.includes(
        AutoStandardizePreset.StandardizeTitle
      )
    )
      return text
    return text
      .split(/\s*[；;]\s*/)
      .map(title => (isHalfWidth(title) ? toTitleCase(title) : title))
      .join("; ")
  },
  standardizeText(text: string): string {
    if (isHalfWidth(text)) return text
    const preset = profile.autostandardize.preset
    text = text
      .replace(/\*\*([\b-']*?)\*\*/g, "placeholder$1placeholder")
      .replace(/\*\*/g, "占位符")
    for (const set of preset) {
      switch (set) {
        case AutoStandardizePreset.HalfToFull:
          text = pangu.toFullwidth(text)
          break
        case AutoStandardizePreset.AddSpace:
          text = pangu.spacing(text)
        case AutoStandardizePreset.RemoveExtraSpace:
          text = text.replace(/\x20{2,}/g, "\x20").replace(/\x20*\n\x20/, "\n")
          break
      }
    }
    return text.replace(/占位符/g, "**").replace(/placeholder/g, "**")
  }
}

const action: IActionMethod = {
  standardizeSelected({ nodes, option }) {
    for (const node of nodes) {
      const title = node.noteTitle
      if (title && option != StandardizeSelected.OnlyExcerptText) {
        const newTitle = util.standardizeText(title)
        node.noteTitle = util.toTitleCase(newTitle)
        if (option == StandardizeSelected.OnlyTitle) continue
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
