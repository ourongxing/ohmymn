import { CellViewType } from "@/typings/enum"
import { checkReplaceParamFromMNLink } from "@/utils/checkInput"
import { defineConfig } from "@/utils/common"
import { getExcerptNotes } from "@/utils/note"
import { lang } from "./lang"
import { StandardizeSelected } from "./typings"
import { standrardizeText, titleCase } from "./utils"

const { help, intro, option, label, link } = lang
export default defineConfig({
  name: "AutoStandardize",
  key: "autostandardize",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      auto: {
        modifyExcerptText: {
          index: -1,
          method({ text }) {
            return standrardizeText(text)
          }
        },
        modifyTitles({ titles }) {
          return titleCase(titles)
        }
      }
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
      bind: ["preset", 0],
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
            let newTitle = standrardizeText(title)
            if (self.globalProfile.autostandardize.standardizeTitle)
              newTitle = titleCase(newTitle.split(/\s*[;；]\s*/)).join("\n")
            node.noteTitle = newTitle
          }
          if (option != StandardizeSelected.OnlyTitle) {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) note.excerptText = standrardizeText(text)
            })
          }
        })
      }
    }
  ]
})
