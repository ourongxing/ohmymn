import type { NodeNote } from "marginnote"
import { HUDController, undoGroupingWithRefresh } from "marginnote"
import { defineConfig } from "~/profile"
import { CellViewType } from "~/typings"
import { checkPlainText, doc } from "~/utils"
import lang from "./lang"
import { completeWord } from "./utils"

export default defineConfig({
  name: "AutoComplete",
  key: "autocomplete",
  intro: lang.intro,
  link: doc("autocomplete"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        generateTitles: {
          index: -999,
          method({ text, note }) {
            return completeWord(text, note, true)
          }
        }
      }
    },
    {
      key: "collins",
      type: CellViewType.MuiltSelect,
      option: lang.collins.$option6,
      label: lang.collins.label,
      help: lang.collins.help
    },
    // {
    //   key: "dataSource",
    //   type: CellViewType.Select,
    //   option: lang.data_source.$option2,
    //   label: lang.data_source.label,
    //   help: lang.data_source.help
    // },
    {
      key: "fillWordInfo",
      type: CellViewType.Select,
      option: lang.fill_word_info.$option3,
      label: lang.fill_word_info.label
    },
    {
      key: "customFillFront",
      type: CellViewType.Input,
      help: lang.custom_fill_front.help,
      bind: ["fillWordInfo", 1],
      link: lang.custom_fill_front.link,
      check({ input }) {
        checkPlainText(input)
        if (/{{\s*(?:zh|en)\s*}}/.test(input))
          throw lang.custom_fill_front.error
      }
    },
    {
      key: "customFill",
      type: CellViewType.Input,
      help: lang.custom_fill,
      bind: ["fillWordInfo", 1],
      check({ input }) {
        checkPlainText(input)
      }
    },
    {
      key: "selectMeanings",
      type: CellViewType.MuiltSelect,
      option: lang.select_meaning.$option2,
      label: lang.select_meaning.label,
      bind: [
        [
          ["fillWordInfo", 1],
          ["fillWordInfo", 2]
        ]
      ]
    },
    {
      key: "selectLemma",
      type: CellViewType.Switch,
      label: lang.select_lemma
    },
    {
      key: "autoContext",
      type: CellViewType.Switch,
      label: lang.auto_context.label,
      help: lang.auto_context.help
    }
  ],
  actions4card: [
    {
      key: "completeWord",
      type: CellViewType.Button,
      label: lang.complete_word.label,
      method: async ({ nodes, option }) => {
        if (option === -1) return
        const getCompletedWord = (node: NodeNote) => {
          try {
            const text = node.titles[0]
            return text ? completeWord(text, node.note) : undefined
          } catch {
            return undefined
          }
        }

        const res = await Promise.all(nodes.map(node => getCompletedWord(node)))
        undoGroupingWithRefresh(() => {
          nodes.forEach((node, index) => {
            const info = res?.[index]
            if (info?.title.length) {
              node.titles = info.title
            }
          })
        })
        HUDController.hidden()
      }
    },
    {
      key: "genWordCard",
      type: CellViewType.Button,
      label: lang.gen_word_card.label,
      option: lang.gen_word_card.$option2,
      method: async ({ nodes, option }) => {
        if (option === -1) return

        const getCompletedWord = (node: NodeNote) => {
          try {
            const text = node.titles[0]
            return text ? completeWord(text, node.note, true) : undefined
          } catch {
            return undefined
          }
        }

        const allInfo = await (async () => {
          const { selectLemma } = self.globalProfile.autocomplete
          const selectMeanings = [
            ...self.globalProfile.autocomplete.selectMeanings
          ]
          if (nodes.length > 1) {
            self.globalProfile.autocomplete.selectLemma = false
            self.globalProfile.autocomplete.selectMeanings = []
          }
          if (
            self.globalProfile.autocomplete.selectLemma === false &&
            self.globalProfile.autocomplete.selectMeanings.length === 0
          ) {
            HUDController.show(lang.loading)
          }
          const res = await Promise.all(
            nodes.map(node => getCompletedWord(node))
          )
          if (nodes.length > 1) {
            self.globalProfile.autocomplete.selectLemma = selectLemma
            self.globalProfile.autocomplete.selectMeanings = selectMeanings
          }
          return res
        })()

        undoGroupingWithRefresh(() => {
          nodes.forEach((node, index) => {
            const info = allInfo?.[index]
            if (info) {
              const { title, comments, text } = info
              if (text) node.mainExcerptText = text
              node.removeCommentButLinkTag(
                k =>
                  k.type === "PaintNote" ||
                  option !== 1 ||
                  k.type === "HtmlNote",
                n => {
                  if (self.globalProfile.addon.useMarkdown)
                    n.appendMarkdownComments(...comments)
                  else n.appendTextComments(...comments)
                }
              )
            }
          })
        })
        HUDController.hidden()
      }
    }
  ]
})
