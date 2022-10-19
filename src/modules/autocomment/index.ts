import { appendTextComment, getExcerptText, MbBookNote } from "marginnote"
import { renderTemplateOfNodeProperties } from "~/JSExtension/fetchNodeProperties"
import { defineConfig } from "~/profile"
import { CellViewType } from "~/typings"
import {
  checkPlainText,
  checkReplaceParam,
  checkReplaceParamFromMNLink,
  doc,
  extractArray,
  regFlag,
  string2ReplaceParam
} from "~/utils"
import lang from "./lang"
import { AddComment, AutoCommentPreset } from "./typings"

function generateComments(note: MbBookNote, text: string) {
  if (!text) return
  const { preset } = self.globalProfile.autocomment
  const { customComment: params } = self.tempProfile.replaceParam
  const comments = [] as string[]
  if (preset.includes(AutoCommentPreset.Custom) && params?.length) {
    params.forEach(({ newSubStr, regexp }) => {
      regexp = regFlag.add(regexp, "g")
      if (regexp.test(text)) {
        comments.push(
          ...text
            .match(regexp)!
            .map(k =>
              k.replace(regexp, renderTemplateOfNodeProperties(note, newSubStr))
            )
        )
      }
    })
  }
  if (preset.includes(AutoCommentPreset.Time)) {
    comments.push(renderTemplateOfNodeProperties(note, "{{time.now}}"))
  }
  return comments
}

export default defineConfig({
  name: "AutoComment",
  key: "autocomment",
  intro: lang.intro,
  link: doc("autocomment"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        generateComments({ note, text }) {
          return generateComments(note, text)
        }
      }
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: lang.preset.$option2,
      label: lang.preset.label
    },
    {
      key: "customComment",
      type: CellViewType.Input,
      help: lang.custom_comment.help,
      bind: ["preset", 0],
      link: lang.custom_comment.link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: lang.add_comment.label,
      key: "addComment",
      option: lang.add_comment.$option2,
      method({ nodes, option, content }) {
        if (option == AddComment.UseAutoComment) {
          nodes.forEach(node => {
            let text = getExcerptText(node).text.join("\n")
            if (!text && node.excerptText) text = "@picture"
            const comments = generateComments(node, text)
            if (comments?.length) appendTextComment(node, ...comments)
          })
        } else if (content) {
          if (/^\(.+\)$/.test(content)) {
            const params = string2ReplaceParam(content)
            nodes.forEach(node => {
              let text = getExcerptText(node).text.join("\n")
              if (!text && node.excerptText) text = "@picture"
              const comments = extractArray(
                text,
                params.map(k => ({
                  ...k,
                  newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
                }))
              )
              appendTextComment(node, ...comments)
            })
          } else {
            nodes.forEach(node => {
              appendTextComment(
                node,
                renderTemplateOfNodeProperties(node, content)
              )
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
