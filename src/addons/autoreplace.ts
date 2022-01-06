import { profile, profileTemp } from "profile"
import { excerptNotes } from "utils/note"
import { string2ReplaceParam } from "utils/input"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"
import { log } from "utils/common"

const { intro, link, label, help, option } = lang.addon.autoreplace
export const enum AutoReplacePreset {
  Custom
}

const enum ReplaceSelected {
  AsAutoReplace
}

const config: IConfig = {
  name: "AutoReplace",
  intro,
  settings: [
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: option.preset,
      label: label.preset
    },
    {
      key: "customReplace",
      type: cellViewType.input,
      label: label.custom_replace,
      link
    }
  ],
  actions: [
    {
      type: cellViewType.buttonWithInput,
      label: label.replace_selected,
      key: "replaceSelected",
      help: help.replace_selected,
      option: option.replace_selected
    }
  ]
}

const util = {
  replaceText(text: string) {
    const { preset } = profile.autoreplace
    for (const set of preset) {
      switch (set) {
        case AutoReplacePreset.Custom:
          const { customReplace: params } = profileTemp.replaceParam
          if (!params) continue
          let _text = text
          params.forEach(param => {
            _text = _text.replace(param.regexp, param.newSubStr)
          })
          if (text != _text) text = _text
      }
    }
    return text
  }
}

const action: IActionMethod = {
  replaceSelected({ content, nodes, option }) {
    if (option !== ReplaceSelected.AsAutoReplace && !content) return
    const params =
      option === ReplaceSelected.AsAutoReplace
        ? []
        : string2ReplaceParam(content)
    for (const node of nodes) {
      const notes = excerptNotes(node)
      for (const note of notes) {
        const text = note.excerptText
        if (!text) continue
        let _text = text
        if (option === ReplaceSelected.AsAutoReplace)
          _text = util.replaceText(text)
        else
          params.forEach(param => {
            _text = _text.replace(param.regexp, param.newSubStr)
          })
        if (text !== _text) note.excerptText = _text
      }
    }
  }
}

export { config, util, action }
