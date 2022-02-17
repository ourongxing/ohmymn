import { excerptNotes } from "utils/note"
import pangu from "utils/third party/pangu"
import { toTitleCase } from "utils/third party/toTitleCase"
import { CJK, isHalfWidth } from "utils/text"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"

const { help, intro, option, label, link } = lang.module.autostandardize

const config: IConfig = {
  name: "AutoStandardize",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: lang.module.more.auto
    },
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: option.preset,
      label: label.preset
    },
    {
      key: "customStandardize",
      type: cellViewType.input,
      label: label.custom_standardize,
      bind: [["preset", 0]],
      link
    },
    {
      key: "standardizeTitle",
      type: cellViewType.switch,
      label: label.standardize_title,
      help: help.standardize_title,
      link
    }
  ],
  actions: [
    {
      key: "standardizeSelected",
      type: cellViewType.button,
      label: label.standardize_selected,
      option: option.standardize_selected
    }
  ]
}

export const enum AutoStandardizePreset {
  Custom,
  RemoveAllSpace,
  HalfToFull,
  AddSpace,
  RemoveCHSpace,
  RemoveRepeatSpace
}

const util = {
  toTitleCase(text: string) {
    const { standardizeTitle } = self.profile.autostandardize
    if (!standardizeTitle) return text
    return text
      .split(/\s*[；;]\s*/)
      .map(title => (isHalfWidth(title) ? toTitleCase(title) : title))
      .join("; ")
  },
  standardizeText(text: string): string {
    if (isHalfWidth(text)) return text
    const { preset } = self.profile.autostandardize
    text = text
      .replace(/\*\*([\b-']*?)\*\*/g, "placeholder$1placeholder")
      .replace(/\*\*/g, "占位符")
    for (const set of preset) {
      switch (set) {
        case AutoStandardizePreset.Custom:
          const { customStandardize: params } = self.profileTemp.replaceParam
          if (!params) continue
          params.forEach(param => {
            text = text.replace(param.regexp, param.newSubStr)
          })
          break
        case AutoStandardizePreset.RemoveAllSpace:
          text = text.replace(/\x20/g, "")
          break
        case AutoStandardizePreset.HalfToFull:
          text = pangu.toFullwidth(text)
          break
        case AutoStandardizePreset.AddSpace:
          text = pangu.spacing(text)
          break
        case AutoStandardizePreset.RemoveCHSpace:
          text = text.replace(
            new RegExp(`([${CJK}])\x20+([${CJK}])`, "g"),
            "$1$2"
          )
          break
        case AutoStandardizePreset.RemoveRepeatSpace:
          text = text.replace(/\x20{2,}/g, "\x20")
          break
      }
    }
    return text.replace(/占位符/g, "**").replace(/placeholder/g, "**")
  }
}

const enum StandardizeSelected {
  All,
  OnlyTitle,
  OnlyExcerptText
}

const action: IActionMethod = {
  standardizeSelected({ nodes, option }) {
    nodes.forEach(node => {
      const title = node.noteTitle
      if (option != StandardizeSelected.OnlyExcerptText && title) {
        let newTitle = util.standardizeText(title)
        if (self.profile.autostandardize.standardizeTitle)
          newTitle = util.toTitleCase(newTitle)
        node.noteTitle = newTitle
      }
      if (option != StandardizeSelected.OnlyTitle) {
        excerptNotes(node).forEach(note => {
          const text = note.excerptText
          if (text) note.excerptText = util.standardizeText(text)
        })
      }
    })
  }
}

export { config, util, action }
