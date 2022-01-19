import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"
import { addTags, getAllText } from "utils/note"
import { escapeDoubleQuote, string2ReplaceParam } from "utils/input"
import { extractArray } from "utils/custom"

const { intro, option, label, link } = lang.module.autotag

const config: IConfig = {
  name: "AutoTag",
  intro,
  link,
  settings: [
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
      bind: ["preset", 0],
      link
    }
  ],
  actions: [
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

const util = {
  getTag(text: string) {
    const { customTag: params } = self.profileTemp.replaceParam
    const { preset } = self.profile.autotag
    if (preset.includes(AutoTagPreset.Custom) && params)
      return extractArray(text, params)
  }
}

const enum TagSelected {
  UseAutoTag
}

const action: IActionMethod = {
  tagSelected({ nodes, option, content }) {
    if (option == TagSelected.UseAutoTag) {
      nodes.forEach(node => {
        const text = getAllText(node)
        if (text) {
          const tags = util.getTag(text)
          if (tags?.length) addTags(node, tags)
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

export { config, util, action }
