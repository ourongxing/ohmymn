import { getExcerptNotes } from "utils/note"
import { string2ReplaceParam } from "utils/input"
import type { IConfig } from "typings"
import { CellViewType } from "typings/enum"
import { lang } from "./lang"
import { ActionKey, AutoReplacePreset, ReplaceSelected } from "./enum"
import { profilePreset } from "profile"
const { intro, link, label, option, help } = lang

const profileTemp = {
  ...profilePreset.autoreplace
}

const configs: IConfig<typeof profileTemp, typeof ActionKey> = {
  name: "AutoReplace",
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
      key: "customReplace",
      type: CellViewType.Input,
      help: help.custom_replace,
      bind: [["preset", 0]],
      link
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: label.replace_selected,
      key: "replaceSelected",
      option: option.replace_selected,
      method: ({ content, nodes, option }) => {
        if (option == ReplaceSelected.UseAutoReplace) {
          nodes.forEach(node => {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) note.excerptText = utils.main(text)
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
  ]
}

const utils = {
  main(text: string) {
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

const autoreplace = { configs, utils }
export default autoreplace
