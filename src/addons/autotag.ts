import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"

const { intro, option, label, link } = lang.addon.autotag

export const enum AutoTagPreset {
  Custom
}

const config: IConfig = {
  name: "AutoTag",
  intro,
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

const util = {}
const action: IActionMethod = {}

export { config, util, action }
