import type { IConfig, MbBookNote } from "typings"
import { lang } from "./lang"
import { CellViewType } from "typings/enum"
import { addTags, getAllText } from "utils/note"
import {
  escapeDoubleQuote,
  extractArray,
  string2ReplaceParam
} from "utils/input"
import { AutoTagPreset, AddTag } from "./typings"
import {
  checkReplaceParam,
  checkReplaceParamFromMNLink
} from "utils/checkInput"
import { renderTemplateOfNodeProperties } from "jsExtension/nodeProperties"

const { intro, option, label, link, help } = lang

const configs: IConfig<"autotag"> = {
  name: "AutoTag",
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
      key: "customTag",
      type: CellViewType.Input,
      help: help.custom_tag,
      bind: [["preset", 0]],
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
            const tags = utils.main(node, text)
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
}

const utils = {
  main(note: MbBookNote, text: string) {
    const { customTag: params } = self.profileTemp.replaceParam
    const { preset } = self.profile.autotag
    if (preset.includes(AutoTagPreset.Custom) && params)
      return extractArray(
        text,
        params.map(k => ({
          ...k,
          newSubStr: renderTemplateOfNodeProperties(note, k.newSubStr)
        }))
      )
  }
}

export default {
  configs,
  utils
}
