import { renderTemplateOfNodeProperties } from "~/jsExtension/nodeProperties"
import { MbBookNote } from "~/typings"
import { CellViewType } from "~/typings/enum"
import { defineConfig } from "~/defaultProfile"
import {
  checkReplaceParamFromMNLink,
  checkReplaceParam,
  escapeDoubleQuote,
  extractArray,
  string2ReplaceParam
} from "~/utils"
import { getAllText, addTags } from "~/sdk"
import { lang } from "./lang"
import { AddTag, AutoTagPreset } from "./typings"

const { intro, option, label, link, help } = lang

function generateTags(note: MbBookNote, text: string) {
  const { customTag: params } = self.tempProfile.replaceParam
  const { preset } = self.globalProfile.autotag
  if (preset.includes(AutoTagPreset.Custom) && params)
    return extractArray(
      text,
      params.map(k => ({
        ...k,
        newSubStr: renderTemplateOfNodeProperties(note, k.newSubStr)
      }))
    )
}

export default defineConfig({
  name: "AutoTag",
  key: "autotag",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      auto: {
        generateTags({ note, text }) {
          return generateTags(note, text)
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
      key: "customTag",
      type: CellViewType.Input,
      help: help.custom_tag,
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
      label: label.add_tag,
      key: "addTag",
      option: option.add_tag,
      method({ nodes, option, content }) {
        if (option == AddTag.UseAutoTag) {
          nodes.forEach(node => {
            const text = getAllText(node)
            const tags = generateTags(node, text)
            if (tags?.length) addTags(node, tags)
          })
        } else if (content) {
          content = /^\(.*\)$/.test(content)
            ? content
            : `(/^.*$/gs, "${escapeDoubleQuote(content)}")`
          const params = string2ReplaceParam(content)
          nodes.forEach(node => {
            const text = getAllText(node)
            const allTags = extractArray(
              text,
              params.map(k => ({
                ...k,
                newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
              }))
            )
            if (allTags.length) addTags(node, allTags)
          })
        }
      },
      check({ input }) {
        input = /^\(.*\)$/.test(input)
          ? input
          : `(/^.*$/gs, "${escapeDoubleQuote(input)}")`
        checkReplaceParam(input)
      }
    }
  ]
})
