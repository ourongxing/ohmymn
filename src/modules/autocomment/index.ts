import { renderTemplateOfNodeProperties } from "~/jsExtension/nodeProperties"
import { MbBookNote } from "~/typings"
import { CellViewType } from "~/enum"
import { defineConfig } from "~/profile"
import {
  unique,
  checkReplaceParamFromMNLink,
  checkReplaceParam,
  escapeDoubleQuote,
  string2ReplaceParam,
  extractArray,
  regFlag,
  ReplaceParam,
  doc
} from "~/utils"
import { appendTextComment, getAllText } from "~/sdk"
import { lang } from "./lang"
import { AddComment, AutoCommentPreset } from "./typings"

function generateComments(note: MbBookNote, text: string) {
  const { customComment } = self.tempProfile.replaceParam
  const { preset } = self.globalProfile.autocomment
  const params = preset.reduce((acc, k) => {
    if (k === AutoCommentPreset.Custom && customComment) {
      acc.push(...customComment)
    }
    if (k === AutoCommentPreset.Time) {
      acc.push({
        fnKey: 1,
        regexp: /^.*$/gs,
        newSubStr: renderTemplateOfNodeProperties(note, "{{time.now}}")
      })
    }
    return acc
  }, [] as ReplaceParam[])
  const isComment = note.groupNoteId && note.groupNoteId !== note.noteId
  return unique(
    params.reduce((acc, cur) => {
      const { newSubStr, fnKey } = cur
      if (fnKey === 1 && isComment) return acc
      let { regexp } = cur
      regexp = regFlag.add(regexp, "g")
      if (regexp.test(text)) {
        acc.push(
          ...text
            .match(regexp)!
            .map(k =>
              k.replace(regexp, renderTemplateOfNodeProperties(note, newSubStr))
            )
        )
      }
      return acc
    }, [] as string[])
  )
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
            const text = getAllText(node)
            const comments = generateComments(node, text)
            appendTextComment(node, ...comments)
          })
        } else if (content) {
          content = /^\(.*\)$/.test(content)
            ? content
            : `(/^.*$/gs, "${escapeDoubleQuote(content)}")`
          const params = string2ReplaceParam(content)
          nodes.forEach(node => {
            const text = getAllText(node)
            const comments = extractArray(
              text,
              params.map(k => ({
                ...k,
                newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
              }))
            )
            appendTextComment(node, ...comments)
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
