import { NodeNote, undoGroupingWithRefresh } from "marginnote"
import { renderTemplateOfNodeProperties } from "~/jsExtension/fetchNodeProperties"
import { defineConfig } from "~/profile"
import { CellViewType } from "~/typings"
import {
  checkPlainText,
  checkReplaceParam,
  checkReplaceParamFromMNLink,
  escapeDoubleQuote,
  extractArray,
  reverseEscape,
  string2ReplaceParam
} from "~/utils"
import lang from "./lang"
import { AddTag, AutoTagPreset } from "./typings"

/**
 * Remove # and other punctuations will be replaced by _
 */
export function clearTags(...tags: string[]) {
  return tags
    .map(k =>
      k
        .replace(/#/g, " ")
        .replace(/\p{P}+/gu, "_")
        .split(/\s+/)
    )
    .flat()
    .filter(k => k)
}

function generateTags(node: NodeNote, text: string) {
  if (!text) return
  const { customTag: params } = self.tempProfile.replaceParam
  const { preset } = self.globalProfile.autotag
  if (preset.includes(AutoTagPreset.Custom) && params)
    return clearTags(
      ...extractArray(
        text,
        params.map(k => ({
          ...k,
          newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
        }))
      )
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
        generateTags({ node, text }) {
          return generateTags(node, text)
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
        undoGroupingWithRefresh(() => {
          if (option == AddTag.UseAutoTag) {
            nodes.forEach(node => {
              let text = node.excerptsText.join("\n")
              if (node.note.excerptPic?.paint && node.isOCR === false)
                text = "@picture"
              const tags = generateTags(node, text)
              if (tags?.length) node.appendTags(...tags)
            })
          } else if (content) {
            if (/^\(.+\)$/.test(content)) {
              const params = string2ReplaceParam(content)
              nodes.forEach(node => {
                let text = node.excerptsText.join("\n")
                if (node.note.excerptPic?.paint && node.isOCR === false)
                  text = "@picture"
                const tags = extractArray(
                  text,
                  params.map(k => ({
                    ...k,
                    newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
                  }))
                )
                node.appendTags(...clearTags(...tags))
              })
            } else {
              nodes.forEach(node => {
                node.appendTags(
                  ...clearTags(
                    renderTemplateOfNodeProperties(
                      node,
                      reverseEscape(`${escapeDoubleQuote(content)}`, true)
                    )
                  )
                )
              })
            }
          }
        })
      },
      check({ input }) {
        if (/^\(.+\)$/.test(input)) checkReplaceParam(input)
        else checkPlainText(input)
      }
    }
  ]
})
