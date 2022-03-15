import type { IConfig } from "typings"
import { lang } from "./lang"
import { cellViewType } from "typings/enum"
import { addTags, getAllText } from "utils/note"
import {
  escapeDoubleQuote,
  ReplaceParam,
  string2ReplaceParam
} from "utils/input"
import { extractArray } from "utils/custom"
import { ActionKey, AutoTagPreset, TagSelected } from "./enum"
import { profilePreset } from "profile"

const { intro, option, label, link, help } = lang

const profileTemp = {
  ...profilePreset.autotag
}

const configs: IConfig<typeof profileTemp, typeof ActionKey> = {
  name: "AutoTag",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: label.on
    },
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: option.preset,
      label: label.preset
    },
    {
      key: "customTag",
      type: cellViewType.input,
      help: help.custom_tag,
      bind: [["preset", 0]],
      link
    }
  ],
  actions4card: [
    {
      type: cellViewType.buttonWithInput,
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
            : `(/./, "${escapeDoubleQuote(content)}")`
          const params = string2ReplaceParam(content)
          nodes.forEach(node => {
            const text = getAllText(node)
            if (text) {
              const allTags = extractArray(text, params)
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
      return extractArray(text, params)
    else return []
  }
}

const autotag = {
  configs,
  utils
}
export default autotag
