import { CellViewType } from "~/enum"
import { checkReplaceParamFromMNLink } from "~/utils"
import { defineConfig } from "~/profile"
import { getExcerptNotes, modifyNodeTitle } from "~/sdk"
import { lang } from "./lang"
import { Format } from "./typings"
import { formatText, titleCase } from "./utils"

export default defineConfig({
  name: "AutoFormat",
  key: "autoformat",
  intro: lang.intro,
  link: lang.link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
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
      option: lang.preset.$option6,
      label: lang.preset.label
    },
    {
      key: "customFormat",
      type: CellViewType.Input,
      help: lang.custom_format,
      bind: ["preset", 0],
      link: lang.link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    },
    {
      key: "formatTitle",
      type: CellViewType.Switch,
      label: lang.format_title.label,
      help: lang.format_title.help,
      link: lang.link
    }
  ],
  actions4card: [
    {
      key: "formatSelected",
      type: CellViewType.Button,
      label: lang.format_selected.label,
      option: lang.format_selected.$option3,
      method: ({ nodes, option }) => {
        nodes.forEach(node => {
          const title = node.noteTitle
          if (
            title &&
            (option === Format.Title || option === Format.TitlenExcerpt)
          ) {
            let newTitle = formatText(title)
            if (self.globalProfile.autoformat.formatTitle)
              newTitle = titleCase(newTitle.split(/\s*[;；]\s*/)).join("; ")
            modifyNodeTitle(node, newTitle)
          }
          if (option === Format.Excerpt || option === Format.TitlenExcerpt) {
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
