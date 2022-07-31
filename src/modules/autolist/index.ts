import { CellViewType } from "~/typings/enum"
import {
  checkReplaceParamFromMNLink,
  checkReplaceParam
} from "~/utils/checkInput"
import { defineConfig } from "~/profile"
import { string2ReplaceParam } from "~/utils/input"
import { getExcerptNotes } from "~/utils/note"
import { lang } from "./lang"
import { ListSelected } from "./typings"
import { addLineBreak, addNumber } from "./utils"

const { intro, option, label, link, help } = lang
export default defineConfig({
  name: "AutoList",
  key: "autolist",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      auto: {
        modifyExcerptText({ text }) {
          return addLineBreak(text)
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
      key: "customList",
      type: CellViewType.Input,
      help: help.custom_list,
      bind: ["preset", 0],
      link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: label.list_selected,
      key: "listSelected",
      option: option.list_selected,
      method({ nodes, content, option }) {
        if (option == ListSelected.UseAutoList) {
          nodes.forEach(node => {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) note.excerptText = addLineBreak(text)
            })
          })
        } else if (content) {
          const params = string2ReplaceParam(content)
          const { regexp, fnKey, newSubStr } = params[0]
          nodes.forEach(node => {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text)
                note.excerptText = addNumber(
                  text
                    .replace(regexp, newSubStr)
                    .replace(/\n{2,}/g, "\n")
                    .trim(),
                  fnKey
                )
            })
          })
        }
      },
      check({ input }) {
        checkReplaceParam(input)
      }
    }
  ]
})
