import type { IActionMethod4Card, IConfig, Methods } from "typings"
import { lang } from "./lang"
import { cellViewType } from "typings/enum"
import { addTags, getAllText } from "utils/note"
import { escapeDoubleQuote, string2ReplaceParam } from "utils/input"
import { extractArray } from "utils/custom"

const { intro, option, label, link } = lang

const configs: IConfig = {
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
      label: label.custom_tag,
      bind: [["preset", 0]],
      link
    }
  ],
  actions4card: [
    {
      type: cellViewType.buttonWithInput,
      label: label.tag_selected,
      key: "tagSelected",
      option: option.tag_selected
    }
  ]
}

export const enum AutoTagPreset {
  Custom
}

const utils = {
  getTag(text: string) {
    const { customTag: params } = self.profileTemp.replaceParam
    const { preset } = self.profile.autotag
    if (preset.includes(AutoTagPreset.Custom) && params)
      return extractArray(text, params)
    else return []
  }
}

enum TagSelected {
  UseAutoTag
}

const actions4card: Methods<IActionMethod4Card> = {
  tagSelected({ nodes, option, content }) {
    if (option == TagSelected.UseAutoTag) {
      nodes.forEach(node => {
        const text = getAllText(node)
        if (text) {
          const tags = utils.getTag(text)
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

export { configs, utils, actions4card }
