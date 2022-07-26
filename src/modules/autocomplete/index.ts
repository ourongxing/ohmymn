import { MbBookNote } from "~/typings"
import { CellViewType } from "~/typings/enum"
import {
  showHUD,
  checkPlainText,
  modifyNodeTitle,
  undoGroupingWithRefresh
} from "~/utils"
import { defineConfig } from "~/profile"
import { lang } from "./lang"
import { completeWord } from "./utils"

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
            return completeWord(text, note)
          }
        }
      }
    },
    {
      key: "collins",
      type: CellViewType.MuiltSelect,
      option: ["零", "一", "二", "三", "四", "五"],
      label: label.collins,
      help: help.collinns
    },
    {
      key: "dataSource",
      type: CellViewType.Select,
      option: option.data_source,
      label: label.data_source,
      help: help.data_source
    },
    {
      key: "fillWordInfo",
      type: CellViewType.Select,
      option: option.fill_word_info,
      label: label.fill_word_info
    },
    {
      key: "customFillFront",
      type: CellViewType.Input,
      help: help.custom_fill_front,
      bind: ["fillWordInfo", 1],
      link,
      check({ input }) {
        checkPlainText(input)
        if (/{{\s*(?:zh|en)\s*}}/.test(input))
          throw "当前输入栏不允许使用 {{zh}} 或 {{en}}"
      }
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
      key: "selectMeanings",
      type: CellViewType.MuiltSelect,
      option: ["中文", "英文"],
      label: label.select_meaning,
      bind: [
        [
          ["fillWordInfo", 1],
          ["fillWordInfo", 2]
        ]
      ]
    },
    {
      key: "autoContext",
      type: CellViewType.Switch,
      label: label.auto_context,
      help: help.auto_context
    },
    {
      key: "translateContext",
      type: CellViewType.Switch,
      label: label.translate_context,
      help: help.translate_context,
      bind: ["autoContext", true]
    }
  ],
  actions4card: [
    {
      key: "completeWord",
      type: CellViewType.Button,
      label: label.complete_word,
      option: ["追加", "替换"],
      method: async ({ nodes, option }) => {
        if (option === -1) return
        const { dataSource } = self.globalProfile.autocomplete
        if (dataSource[0] === 0) {
          if (nodes.length > 5) {
            showHUD(lang.error.forbid, 2)
            nodes = nodes.slice(0, 5)
          }
        }
        const getCompletedWord = (node: MbBookNote) => {
          const text = node?.noteTitle?.split(/\s*[;；]\s*/)[0]
          return text ? completeWord(text, node) : undefined
        }

        const allInfo = await Promise.all(
          nodes.map(node => getCompletedWord(node))
        )
        undoGroupingWithRefresh(() => {
          nodes.forEach((node, index) => {
            const info = allInfo?.[index]
            if (info) {
              const { title, comments } = info
              modifyNodeTitle(node, title)
              if (option === 1)
                while (node.comments.length) {
                  node.removeCommentByIndex(0)
                }
              comments.forEach(k => {
                k && node.appendTextComment(k)
              })
            }
          })
        })
      }
    }
  ]
})
