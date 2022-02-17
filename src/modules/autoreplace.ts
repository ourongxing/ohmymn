import { excerptNotes } from "utils/note"
import { string2ReplaceParam } from "utils/input"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"

const { intro, link, label, help, option } = lang.module.autoreplace
export const enum AutoReplacePreset {
  Custom
}

const config: IConfig = {
  name: "AutoReplace",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: lang.module.more.auto
    },
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
      bind: [["preset", 0]],
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
    const { preset } = self.profile.autoreplace
    for (const set of preset) {
      switch (set) {
        case AutoReplacePreset.Custom:
          const { customReplace: params } = self.profileTemp.replaceParam
          if (!params) continue
          text = params.reduce(
            (acc, param) => acc.replace(param.regexp, param.newSubStr),
            text
          )
      }
    }
    return text
  }
}

const enum ReplaceSelected {
  UseAutoReplace
}

const action: IActionMethod = {
  replaceSelected({ content, nodes, option }) {
    if (option == ReplaceSelected.UseAutoReplace) {
      nodes.forEach(node => {
        excerptNotes(node).forEach(note => {
          const text = note.excerptText
          if (text) note.excerptText = util.replaceText(text)
        })
      })
    } else if (content) {
      const params = string2ReplaceParam(content)
      nodes.forEach(node => {
        excerptNotes(node).forEach(note => {
          const text = note.excerptText
          if (text)
            note.excerptText = params.reduce(
              (acc, params) => acc.replace(params.regexp, params.newSubStr),
              text
            )
        })
      })
    }
  }
}

export { config, util, action }
