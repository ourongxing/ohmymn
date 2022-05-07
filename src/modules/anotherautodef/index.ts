import { renderTemplateOfNodeProperties } from "@/jsExtension/nodeProperties"
import { CellViewType } from "@/typings/enum"
import { unique } from "@/utils"
import {
  checkReplaceParamFromMNLink,
  checkRegArrayFromMNLink,
  checkReplaceParam
} from "@/utils/checkInput"
import { defineConfig } from "@/utils"
import { string2ReplaceParam, extractArray } from "@/utils/input"
import { getAllText, removeHighlight } from "@/utils/note"
import { lang } from "./lang"
import { ExtractTitle } from "./typings"
import { splitExtractTitles } from "./utils"

const { label, option, intro, link, help } = lang

export default defineConfig({
  name: "Another AutoDef",
  key: "anotherautodef",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      auto: {
        generateTitles({ note, text }) {
          return splitExtractTitles(note, text)
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
      key: "customExtractTitle",
      type: CellViewType.Input,
      bind: ["preset", 0],
      help: help.custom_extract_title,
      link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    },
    {
      key: "customDefLink",
      type: CellViewType.Input,
      bind: ["preset", 1],
      help: help.custom_def_link,
      link,
      check({ input }) {
        checkRegArrayFromMNLink(input)
      }
    },
    {
      key: "onlyDesc",
      type: CellViewType.Switch,
      label: label.only_desc
    },
    {
      key: "toTitleLink",
      type: CellViewType.Switch,
      label: label.to_title_link
    },
    {
      type: CellViewType.MuiltSelect,
      key: "titleLinkSplit",
      label: label.title_link_split,
      option: option.title_link_split,
      bind: ["toTitleLink", true]
    },
    {
      key: "customTitleSplit",
      type: CellViewType.Input,
      help: help.custom_title_split,
      bind: [
        ["toTitleLink", true],
        ["titleLinkSplit", 0]
      ],
      link,
      check({ input }) {
        checkRegArrayFromMNLink(input)
      }
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: label.extract_title,
      option: option.extract_title,
      key: "extractTitle",
      method: ({ nodes, content, option }) => {
        if (option == ExtractTitle.UseAutoDef) {
          const { customExtractTitle } = self.globalProfile.anotherautodef
          const params = customExtractTitle
            ? string2ReplaceParam(customExtractTitle)
            : false
          nodes.forEach(node => {
            const allTitles: string[] = []
            const res = splitExtractTitles(node, node.excerptText ?? "")
            if (res) {
              const { text, title } = res
              allTitles.push(...title)
              node.excerptText = text
            }
            if (params) {
              const text = getAllText(node)
              allTitles.push(
                ...extractArray(
                  text,
                  params.map(k => ({
                    ...k,
                    newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
                  }))
                )
              )
            }
            if (allTitles.length)
              node.noteTitle = removeHighlight(unique(allTitles).join("; "))
          })
        } else if (content) {
          const params = string2ReplaceParam(content)
          nodes.forEach(node => {
            const text = getAllText(node)
            const allTitles = extractArray(
              text,
              params.map(k => ({
                ...k,
                newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
              }))
            )
            if (allTitles.length)
              node.noteTitle = removeHighlight(allTitles.join("; "))
          })
        }
      },
      check({ input }) {
        checkReplaceParam(input)
      }
    }
  ]
})
