import { MbBookNote } from "~/typings"
import { CellViewType } from "~/typings/enum"
import { checkPlainText } from "~/utils/checkInput"
import { showHUD } from "~/utils/common"
import { defineConfig } from "~/profile"
import { modifyNodeTitle, undoGroupingWithRefresh } from "~/utils/note"
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
      label: "柯林斯星级筛选",
      help: "星越多代表越常用，但也越简单"
    },
    {
      key: "dataSource",
      type: CellViewType.Select,
      option: ["在线 API", "本地数据库"],
      label: "数据来源",
      help: "本地数据库体积较大，但更快，质量更高"
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
      help: "使用 AutoTranslate, 请先将其设置好",
      bind: ["autoContext", true]
    }
  ],
  actions4card: [
    {
      key: "completeWord",
      type: CellViewType.Button,
      label: "英文单词制卡",
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
