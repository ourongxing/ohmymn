import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"
import { addTags, getAllText } from "utils/note"
import { escapeDoubleQuote, string2ReplaceParam } from "utils/input"

const { intro, option, label, link } = lang.addon.autotag

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
      return params
        .filter(param => param.regexp.test(text))
        .map(param => param.newSubStr)
  }
}

const enum TagSelected {
  AsAutoTag
}

const action: IActionMethod = {
  tagSelected({ nodes, option, content }) {
    if (option != TagSelected.AsAutoTag && !content) return
    content = /^\(.*\)$/.test(content)
      ? content
      : `(/./, "${escapeDoubleQuote(content)}")`
    let params = string2ReplaceParam(content)
    const { customTag } = self.profileTemp.replaceParam
    if (option == TagSelected.AsAutoTag) {
      if (!customTag) return
      params = customTag
    }

    nodes.forEach(node => {
      const allText = getAllText(node)
      const tags = params
        .filter(param => param.regexp.test(allText))
        .map(param => param.newSubStr)
      addTags(node, tags)
    })
  }
}

export { config, util, action }
