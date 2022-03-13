import { getExcerptNotes } from "utils/note"
import { string2ReplaceParam } from "utils/input"
import type { Methods, IConfig, IActionMethod4Card } from "typings"
import { cellViewType } from "typings/enum"
import { lang } from "./lang"
const { intro, link, label, option, help } = lang

export const enum AutoReplacePreset {
  Custom
}

const configs: IConfig = {
  name: "AutoReplace",
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
      key: "customReplace",
      type: cellViewType.input,
      help: help.custom_replace,
      bind: [["preset", 0]],
      link
    }
  ],
  actions4card: [
    {
      type: cellViewType.buttonWithInput,
      label: label.replace_selected,
      key: "replaceSelected",
      option: option.replace_selected
    }
  ]
}

const utils = {
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

enum ReplaceSelected {
  UseAutoReplace
}

const actions4card: Methods<IActionMethod4Card> = {
  replaceSelected({ content, nodes, option }) {
    if (option == ReplaceSelected.UseAutoReplace) {
      nodes.forEach(node => {
        getExcerptNotes(node).forEach(note => {
          const text = note.excerptText
          if (text) note.excerptText = utils.replaceText(text)
        })
      })
    } else if (content) {
      const params = string2ReplaceParam(content)
      nodes.forEach(node => {
        getExcerptNotes(node).forEach(note => {
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

export { configs, utils, actions4card }
