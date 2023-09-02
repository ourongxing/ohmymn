import { type NodeNote, undoGroupingWithRefresh } from "marginnote"
import { renderTemplateOfNodeProperties } from "~/jsExtension/fetchNodeProperties"
import { defineConfig } from "~/profile"
import { CellViewType } from "~/typings"
import {
  checkPlainText,
  checkReplaceParam,
  checkReplaceParamFromMNLink,
  doc,
  escapeDoubleQuote,
  extractArray,
  regFlag,
  reverseEscape,
  string2ReplaceParam
} from "~/utils"
import lang from "./lang"
import { AddComment, AutoCommentPreset } from "./typings"

function generateComments(node: NodeNote, text: string) {
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
              k.replace(regexp, renderTemplateOfNodeProperties(node, newSubStr))
            )
        )
      }
    })
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
        generateComments({ node, text }) {
          return generateComments(node, text)
        }
      }
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: lang.preset.$option,
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
        undoGroupingWithRefresh(() => {
          if (option == AddComment.UseAutoComment) {
            nodes.forEach(node => {
              let text = node.excerptsText.join("\n")
              if (node.note.excerptPic?.paint && node.isOCR === false)
                text = "@picture"
              const comments = generateComments(node, text)
              if (comments?.length) {
                if (self.globalProfile.addon.useMarkdown) {
                  node.appendMarkdownComments(...comments)
                } else node.appendTextComments(...comments)
              }
            })
          } else if (content) {
            if (/^\(.+\)$/.test(content)) {
              const params = string2ReplaceParam(content)
              nodes.forEach(node => {
                let text = node.excerptsText.join("\n")
                if (node.note.excerptPic?.paint && node.isOCR === false)
                  text = "@picture"
                const comments = extractArray(
                  text,
                  params.map(k => ({
                    ...k,
                    newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
                  }))
                )
                if (self.globalProfile.addon.useMarkdown) {
                  node.appendMarkdownComments(...comments)
                } else node.appendTextComments(...comments)
              })
            } else {
              nodes.forEach(node => {
                if (self.globalProfile.addon.useMarkdown) {
                  node.appendMarkdownComments(
                    renderTemplateOfNodeProperties(
                      node,
                      reverseEscape(`${escapeDoubleQuote(content)}`, true)
                    )
                  )
                } else
                  node.appendTextComments(
                    renderTemplateOfNodeProperties(
                      node,
                      reverseEscape(`${escapeDoubleQuote(content)}`, true)
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
