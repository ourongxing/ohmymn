import { undoGroupingWithRefresh } from "marginnote"
import { defineConfig } from "~/profile"
import { CellViewType } from "~/typings"
import {
  checkReplaceParam,
  checkReplaceParamFromMNLink,
  doc,
  string2ReplaceParam
} from "~/utils"
import lang from "./lang"
import { ListCard } from "./typings"
import { addLineBreak, addNumber } from "./utils"

export default defineConfig({
  name: "AutoList",
  key: "autolist",
  intro: lang.intro,
  link: doc("autolist"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        modifyExcerptText: {
          index: 2,
          method({ text }) {
            return addLineBreak(text)
          }
        }
      }
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: lang.preset.$option4,
      label: lang.preset.label
    },
    {
      key: "customList",
      type: CellViewType.Input,
      help: lang.custom_list.help,
      bind: ["preset", 0],
      link: lang.custom_list.link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: lang.list_selected.label,
      key: "listCard",
      option: lang.list_selected.$option2,
      method({ nodes, content, option }) {
        undoGroupingWithRefresh(() => {
          if (option == ListCard.UseAutoList) {
            nodes.forEach(node => {
              node.notes.forEach(note => {
                const text = note.excerptText
                if (text) note.excerptText = addLineBreak(text)
              })
            })
          } else if (content) {
            const params = string2ReplaceParam(content)
            const { regexp, fnKey, newSubStr } = params[0]
            nodes.forEach(node => {
              node.notes.forEach(note => {
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
        })
      },
      check({ input }) {
        checkReplaceParam(input)
      }
    }
  ]
})
