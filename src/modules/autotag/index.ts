import { addTags, getExcerptText, MbBookNote } from "marginnote"
import { renderTemplateOfNodeProperties } from "~/JSExtension/fetchNodeProperties"
import { defineConfig } from "~/profile"
import { CellViewType } from "~/typings"
import {
  checkPlainText,
  checkReplaceParam,
  checkReplaceParamFromMNLink,
  extractArray,
  string2ReplaceParam
} from "~/utils"
import lang from "./lang"
import { AddTag, AutoTagPreset } from "./typings"

function generateTags(note: MbBookNote, text: string) {
  if (!text) return
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
            let text = getExcerptText(node).text.join("\n")
            if (!text && node.excerptText) text = "@picture"
            const tags = generateTags(node, text)
            if (tags?.length) addTags(node, tags)
          })
        } else if (content) {
          if (/^\(.+\)$/.test(content)) {
            const params = string2ReplaceParam(content)
            nodes.forEach(node => {
              let text = getExcerptText(node).text.join("\n")
              if (!text && node.excerptText) text = "@picture"
              const tags = extractArray(
                text,
                params.map(k => ({
                  ...k,
                  newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
                }))
              )
              addTags(node, tags)
            })
          } else {
            nodes.forEach(node => {
              addTags(node, [renderTemplateOfNodeProperties(node, content)])
            })
          }
        }
      },
      check({ input }) {
        if (/^\(.+\)$/.test(input)) checkReplaceParam(input)
        else checkPlainText(input)
      }
    }
  ]
})
