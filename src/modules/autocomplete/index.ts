import { MbBookNote } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { checkPlainText } from "@/utils/checkInput"
import { defineConfig, showHUD } from "@/utils/common"
import { undoGroupingWithRefresh } from "@/utils/note"
import { lang } from "./lang"
import { CompleteSelected } from "./typings"
import { completeWords } from "./utils"

const { intro, link, option, label, help } = lang

export default defineConfig({
  name: "AutoComplete",
  key: "autocomplete",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      auto: {
        generateTitles: {
          index: -999,
          method({ text, note }) {
            return completeWords(text, note)
          }
        }
      }
    },
    {
      key: "fillWordInfo",
      type: CellViewType.Select,
      option: option.fill_word_info,
      label: label.fill_word_info
    },
    {
      key: "customFill",
      type: CellViewType.Input,
      help: help.custom_fill,
      bind: ["fillWordInfo", 1],
      link,
      check({ input }) {
        checkPlainText(input)
      }
    },
    {
      key: "selectMeaning",
      type: CellViewType.Switch,
      label: label.select_meaning
    },
    {
      key: "autoContext",
      type: CellViewType.Switch,
      label: "自动摘录上下文"
    },
    {
      key: "translateContext",
      type: CellViewType.Switch,
      label: "翻译上下文",
      help: "使用 AutoTranslate, 请设置好改模块.",
      bind: ["autoContext", 1]
    }
  ],
  actions4card: [
    {
      key: "completeSelected",
      type: CellViewType.Button,
      label: label.complete_selected,
      option: option.complete_selected,
      method: async ({ nodes, option }) => {
        if (nodes.length > 5) {
          showHUD(lang.error.forbid, 2)
          return
        }
        const getCompletedWord = (node: MbBookNote) => {
          const title = node?.noteTitle
          return title
            ? completeWords(title.split(/\s*[;；]\s*/)[0], node)
            : undefined
        }
        const allInfo = await Promise.all(
          nodes.map(node => getCompletedWord(node))
        )
        undoGroupingWithRefresh(() => {
          nodes.forEach((node, index) => {
            const info = allInfo?.[index]
            if (info) {
              node.noteTitle = info.title.join("; ")
              if (option == CompleteSelected.AlsoFillWordInfo)
                node.appendTextComment(info.text)
            }
          })
        })
      }
    }
  ]
})
