import { CellViewType } from "~/typings"
import { defineConfig } from "~/profile"
import {
  checkReplaceParamFromMNLink,
  checkRegArrayFromMNLink,
  checkReplaceParam,
  string2ReplaceParam,
  doc,
  ReplaceParam,
  string2RegArray
} from "~/utils"
import { getExcerptNotes, modifyNodeTitle } from "marginnote"
import { lang } from "./lang"
import { ExtractTitle, SplitExcerpt } from "./typings"
import { extractTitle, splitExcerptTitles } from "./utils"

export default defineConfig({
  name: "Another AutoDef",
  key: "anotherautodef",
  intro: lang.intro,
  link: doc("anotherautotitle"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        generateTitles({ note, text }) {
          const r = extractTitle(note, text)
          if (r?.title.length) return r
          const e = splitExcerptTitles(text)
          if (e?.title.length) return e
        }
      }
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: lang.preset.$option9,
      label: lang.preset.label
    },
    {
      key: "customExtractTitle",
      type: CellViewType.Input,
      help: lang.custom_extract_title.help,
      link: lang.custom_extract_title.link,
      bind: ["preset", 0],
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    },
    {
      key: "customDefLink",
      type: CellViewType.Input,
      help: lang.custom_def_link.help,
      link: lang.custom_def_link.link,
      bind: ["preset", 1],
      check({ input }) {
        checkRegArrayFromMNLink(input)
      }
    },
    {
      key: "toTitleLink",
      type: CellViewType.Switch,
      label: lang.to_title_link,
      bind: ["preset", [1, 2, 3, 4, 5, 6, 7, 8]]
    },
    {
      type: CellViewType.MuiltSelect,
      key: "titleLinkSplit",
      label: lang.title_link_split.label,
      option: lang.title_link_split.$option3,
      bind: [
        ["toTitleLink", true],
        ["preset", [1, 2, 3, 4, 5, 6, 7, 8]]
      ]
    },
    {
      key: "customTitleSplit",
      type: CellViewType.Input,
      help: lang.custom_title_split.help,
      link: lang.custom_title_split.link,
      bind: [
        ["toTitleLink", true],
        ["titleLinkSplit", 0],
        ["preset", [1, 2, 3, 4, 5, 6, 7, 8]]
      ],
      check({ input }) {
        checkRegArrayFromMNLink(input)
      }
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: lang.extract_title.label,
      option: lang.extract_title.$option2,
      key: "extractTitle",
      method: ({ nodes, content, option }) => {
        let params: ReplaceParam[] | undefined = undefined
        if (option == ExtractTitle.UseAutoDef) {
        } else if (content) {
          params = string2ReplaceParam(content)
        } else return
        nodes.forEach(node => {
          if (!node.excerptPic || (node.excerptPic && node.textFirst)) {
            const allTitles = [] as string[]
            getExcerptNotes(node).forEach(k => {
              const text = k.excerptText
              if (text) {
                const ret = extractTitle(node, text, params)
                ret?.title.length && allTitles.push(...ret.title)
              }
            })
            if (allTitles.length) modifyNodeTitle(node, allTitles, true)
          }
        })
      },
      check({ input }) {
        checkReplaceParam(input)
      }
    },
    {
      type: CellViewType.ButtonWithInput,
      label: lang.split_excerpt.label,
      key: "splitExcerpt",
      option: lang.split_excerpt.$option2,
      help: lang.split_excerpt.help,
      method: ({ nodes, content, option }) => {
        let regGloups: RegExp[][] | undefined = undefined
        if (option == SplitExcerpt.UseAutoDef) {
        } else if (content) {
          regGloups = string2RegArray(content)
        } else return
        nodes.forEach(node => {
          if (!node.excerptPic || (node.excerptPic && node.textFirst)) {
            const allTitles = [] as string[]
            getExcerptNotes(node).forEach(k => {
              const text = k.excerptText
              if (text) {
                const ret = splitExcerptTitles(text, regGloups)
                if (ret?.title.length) {
                  allTitles.push(...ret.title)
                  node.excerptText = ret.text
                }
              }
            })
            if (allTitles.length) modifyNodeTitle(node, allTitles, true)
          }
        })
      }
    }
  ]
})
