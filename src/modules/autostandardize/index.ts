import { IConfig, MbBookNote } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { checkReplaceParamFromMNLink } from "@/utils/checkInput"
import { getExcerptNotes } from "@/utils/note"
import { isHalfWidth, CJK } from "@/utils/text"
import pangu from "@/utils/third party/pangu"
import { toTitleCase } from "@/utils/third party/toTitleCase"
import { lang } from "./lang"
import { StandardizeSelected, AutoStandardizePreset } from "./typings"

const { help, intro, option, label, link } = lang
const configs: IConfig<"autostandardize"> = {
  name: "AutoStandardize",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: option.preset,
      label: label.preset
    },
    {
      key: "customStandardize",
      type: CellViewType.Input,
      help: help.custom_standardize,
      bind: [["preset", 0]],
      link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    },
    {
      key: "standardizeTitle",
      type: CellViewType.Switch,
      label: label.standardize_title,
      help: help.standardize_title,
      link
    }
  ],
  actions4card: [
    {
      key: "standardizeSelected",
      type: CellViewType.Button,
      label: label.standardize_selected,
      option: option.standardize_selected,
      method: ({ nodes, option }) => {
        nodes.forEach(node => {
          const title = node.noteTitle
          if (option != StandardizeSelected.OnlyExcerptText && title) {
            let newTitle = utils.main(node, title)
            if (self.globalProfile.autostandardize.standardizeTitle)
              newTitle = utils.toTitleCase(newTitle)
            node.noteTitle = newTitle
          }
          if (option != StandardizeSelected.OnlyTitle) {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) note.excerptText = utils.main(node, text)
            })
          }
        })
      }
    }
  ]
}

const utils = {
  toTitleCase(text: string) {
    const { standardizeTitle } = self.globalProfile.autostandardize
    if (!standardizeTitle) return text
    return text
      .split(/\s*[；;]\s*/)
      .map(title => (isHalfWidth(title) ? toTitleCase(title) : title))
      .join("; ")
  },
  main(note: MbBookNote, text: string): string {
    if (isHalfWidth(text)) return text
    const { preset } = self.globalProfile.autostandardize
    text = text.replace(/\*\*(.+?)\*\*/g, (_, match) =>
      isHalfWidth(match)
        ? `placeholder${match}placeholder`
        : `占位符${match}占位符`
    )
    for (const set of preset) {
      switch (set) {
        case AutoStandardizePreset.Custom:
          const { customStandardize: params } = self.tempProfile.replaceParam
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

export default { configs, utils }
