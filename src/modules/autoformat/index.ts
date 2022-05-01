import { CellViewType } from "@/typings/enum"
import { checkReplaceParamFromMNLink } from "@/utils/checkInput"
import { defineConfig } from "@/utils"
import { getExcerptNotes } from "@/utils/note"
import { lang } from "./lang"
import { Format } from "./typings"
import { formatText, titleCase } from "./utils"

const { help, intro, option, label, link } = lang
export default defineConfig({
  name: "AutoFormat",
  key: "autoformat",
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
            return formatText(text)
          }
        },
        modifyTitles({ titles }) {
          const { formatTitle } = self.globalProfile.autoformat
          if (!formatTitle) return titles
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
      key: "customFormat",
      type: CellViewType.Input,
      help: help.custom_format,
      bind: ["preset", 0],
      link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    },
    {
      key: "formatTitle",
      type: CellViewType.Switch,
      label: label.format_title,
      help: help.format_title,
      link
    }
  ],
  actions4card: [
    {
      key: "formatSelected",
      type: CellViewType.Button,
      label: label.format_selected,
      option: option.format_selected,
      method: ({ nodes, option }) => {
        nodes.forEach(node => {
          const title = node.noteTitle
          if (option != Format.Excerpt && title) {
            let newTitle = formatText(title)
            if (self.globalProfile.autoformat.formatTitle)
              newTitle = titleCase(newTitle.split(/\s*[;；]\s*/)).join("\n")
            node.noteTitle = newTitle
          }
          if (option != Format.Title) {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) note.excerptText = formatText(text)
            })
          }
        })
      }
    }
  ]
})
