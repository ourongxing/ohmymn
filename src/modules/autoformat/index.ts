import { CellViewType } from "~/typings"
import { checkReplaceParamFromMNLink, doc } from "~/utils"
import { defineConfig } from "~/profile"
import { getExcerptNotes, modifyNodeTitle } from "marginnote"
import lang from "./lang"
import { Format } from "./typings"
import { formatText, titleCase } from "./utils"

export default defineConfig({
  name: "AutoFormat",
  key: "autoformat",
  intro: lang.intro,
  link: doc("autoformat"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        modifyExcerptText: {
          index: 1,
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
      option: lang.preset.$option5,
      label: lang.preset.label
    },
    {
      key: "customFormat",
      type: CellViewType.Input,
      help: lang.custom_format.help,
      bind: ["preset", 0],
      link: lang.custom_format.link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    },
    {
      key: "removeSpace",
      type: CellViewType.Switch,
      label: lang.remove_space.label,
      help: lang.remove_space.help
    },
    {
      key: "formatTitle",
      type: CellViewType.Switch,
      label: lang.format_title.label,
      help: lang.format_title.help,
      link: lang.format_title.link
    }
  ],
  actions4card: [
    {
      key: "formatCard",
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
