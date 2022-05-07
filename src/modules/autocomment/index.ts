import { renderTemplateOfNodeProperties } from "@/jsExtension/nodeProperties"
import { MbBookNote } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { unique } from "@/utils"
import {
  checkReplaceParamFromMNLink,
  checkReplaceParam
} from "@/utils/checkInput"
import { defineConfig } from "@/utils"
import {
  escapeDoubleQuote,
  string2ReplaceParam,
  extractArray,
  regFlag,
  ReplaceParam
} from "@/utils/input"
import { getAllText } from "@/utils/note"
import { lang } from "./lang"
import { AddComment, AutoCommentPreset } from "./typings"
const { intro, option, label, link, help } = lang

function generateComments(note: MbBookNote, text: string) {
  const { customComment } = self.tempProfile.replaceParam
  const { preset, citation } = self.globalProfile.autocomment
  const params = preset.reduce((acc, k) => {
    if (k === AutoCommentPreset.Custom && customComment) {
      acc.push(...customComment)
    }
    if (k === AutoCommentPreset.Citation && citation) {
      const params = string2ReplaceParam(
        renderTemplateOfNodeProperties(note, citation)
      )
      params.length && acc.push(...params)
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
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      auto: {
        generateComments({ note, text }) {
          return generateComments(note, text)
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
      key: "customComment",
      type: CellViewType.Input,
      help: help.custom_comment,
      bind: ["preset", 0],
      link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    },
    {
      key: "citation",
      type: CellViewType.Input,
      help: help.citaion_style,
      bind: ["preset", 1],
      link
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: label.add_comment,
      key: "addComment",
      option: option.add_comment,
      method({ nodes, option, content }) {
        if (option == AddComment.UseAutoComment) {
          nodes.forEach(node => {
            const text = getAllText(node)
            const comments = generateComments(node, text)
            if (comments?.length)
              comments.forEach(k => {
                node.appendTextComment(k)
              })
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
            if (comments?.length)
              comments.forEach(k => {
                node.appendTextComment(k)
              })
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
