import { renderTemplateOfNodeProperties } from "~/jsExtension/nodeProperties"
import { MbBookNote } from "~/marginnote/api"
import { CellViewType } from "~/typings"
import { defineConfig } from "~/profile"
import {
  checkReplaceParamFromMNLink,
  checkReplaceParam,
  escapeDoubleQuote,
  extractArray,
  string2ReplaceParam
} from "~/utils"
import { getAllText, addTags } from "~/marginnote/sdk"
import { lang } from "./lang"
import { AddTag, AutoTagPreset } from "./typings"

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
  intro: lang.intro,
  link: lang.link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        generateTags({ note, text }) {
          return generateTags(note, text)
        }
      }
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: lang.preset.$option1,
      label: lang.preset.label
    },
    {
      key: "customTag",
      type: CellViewType.Input,
      help: lang.custom_tag.help,
      bind: ["preset", 0],
      link: lang.custom_tag.link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: lang.add_tag.label,
      key: "addTag",
      option: lang.add_tag.$option2,
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
