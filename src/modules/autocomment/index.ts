import type { ICheckMethod, IConfig, MbBookNote } from "typings"
import { lang } from "./lang"
import { CellViewType } from "typings/enum"
import { getAllText } from "utils/note"
import {
  escapeDoubleQuote,
  extractArray,
  regFlag,
  ReplaceParam,
  string2ReplaceParam
} from "utils/input"
import { ActionKey, AddComment, AutoCommentPreset } from "./enum"
import { IProfile } from "profile"
import {
  checkReplaceParam,
  checkReplaceParamFromMNLink
} from "utils/checkInput"
import { renderTemplateOfNodeProperties } from "jsExtension/nodeProperties"
import { unique } from "utils"

const { intro, option, label, link, help } = lang

const configs: IConfig<IProfile["autocomment"], typeof ActionKey> = {
  name: "AutoComment",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on
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
      bind: [["preset", 0]],
      link
    },
    {
      key: "citation",
      type: CellViewType.Input,
      help: "引用格式",
      bind: [["preset", 2]],
      link
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: label.add_comment,
      key: "addComment",
      option: option.add_comment,
      method: ({ nodes, option, content }) => {
        if (option == AddComment.UseAutoComment) {
          nodes.forEach(node => {
            const text = getAllText(node)
            const comments = utils.main(node, text)
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
      }
    }
  ]
}

const utils = {
  main(note: MbBookNote, text: string) {
    const { customComment } = self.profileTemp.replaceParam
    const { preset, citation } = self.profile.autocomment
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
                k.replace(
                  regexp,
                  renderTemplateOfNodeProperties(note, newSubStr)
                )
              )
          )
        }
        return acc
      }, [] as string[])
    )
  }
}

const checker: ICheckMethod<
  PickByValue<IProfile["autocomment"], string> & typeof ActionKey
> = (input, key) => {
  switch (key) {
    case "addComment":
      input = /^\(.*\)$/.test(input)
        ? input
        : `(/^.*$/gs, "${escapeDoubleQuote(input)}")`
      checkReplaceParam(input)
      break
    case "customComment":
      checkReplaceParamFromMNLink(input)
    default:
      return false
  }
}

const autocomment = {
  configs,
  utils,
  checker
}

export default autocomment
