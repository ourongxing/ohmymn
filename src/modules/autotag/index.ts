import type { ICheckMethod, IConfig } from "typings"
import { lang } from "./lang"
import { CellViewType } from "typings/enum"
import { addTags, getAllText } from "utils/note"
import {
  escapeDoubleQuote,
  extractArray,
  string2ReplaceParam
} from "utils/input"
import { ActionKey, AutoTagPreset, TagSelected } from "./enum"
import { IProfile } from "profile"
import {
  checkReplaceParam,
  checkReplaceParamFromMNLink
} from "utils/checkInput"
import {
  renderTemplateOfNodeProperties,
  renderTemplateOfNodePropertiesWhenExcerpt
} from "jsExtension/nodeProperties"

const { intro, option, label, link, help } = lang

const configs: IConfig<IProfile["autotag"], typeof ActionKey> = {
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
      link
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: label.tag_selected,
      key: "tagSelected",
      option: option.tag_selected,
      method: ({ nodes, option, content }) => {
        if (option == TagSelected.UseAutoTag) {
          nodes.forEach(node => {
            const text = getAllText(node)
            if (text) {
              const tags = utils.main(text)
              if (tags.length) addTags(node, tags)
            }
          })
        } else if (content) {
          content = /^\(.*\)$/.test(content)
            ? content
            : `(/^.*$/, "${escapeDoubleQuote(content)}")`
          const params = string2ReplaceParam(content)
          nodes.forEach(node => {
            const text = getAllText(node)
            if (text) {
              const allTags = extractArray(
                text,
                params.map(k => ({
                  ...k,
                  newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
                }))
              )
              if (allTags.length) addTags(node, allTags)
            }
          })
        }
      }
    }
  ]
}

const utils = {
  main(text: string) {
    const { customTag: params } = self.profileTemp.replaceParam
    const { preset } = self.profile.autotag
    if (preset.includes(AutoTagPreset.Custom) && params)
      return extractArray(
        text,
        params.map(k => ({
          ...k,
          newSubStr: renderTemplateOfNodePropertiesWhenExcerpt(k.newSubStr)
        }))
      )
    else return []
  }
}

const checker: ICheckMethod<
  PickByValue<IProfile["autotag"], string> & typeof ActionKey
> = (input, key) => {
  switch (key) {
    case "tagSelected":
      input = /^\(.*\)$/.test(input)
        ? input
        : `(/^.*$/, "${escapeDoubleQuote(input)}")`
      checkReplaceParam(input)
      break
    case "customTag":
      checkReplaceParamFromMNLink(input)
    default:
      return false
  }
}

const autotag = {
  configs,
  utils,
  checker
}

export default autotag
