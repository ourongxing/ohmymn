import { Addon } from "const"
import lang from "lang"
import type { IConfig } from "typings"
import { cellViewType } from "typings/enum"

export const enum PanelPosition {
  Auto,
  Left,
  Center,
  Right
}

export const enum PanelHeight {
  Higher,
  Standard,
  Lower
}

export const enum PanelControl {
  DoubleClickOpen,
  DoubleClickClose,
  CompleteClose
}

export const enum HasTitleThen {
  NoChange,
  TitleLink,
  OverrideTitle
}

const { link, label, help, option } = lang.module.ohmymn
const config: IConfig = {
  name: Addon.title,
  intro: `version: ${Addon.version}\nmade by ${Addon.author} with ❤️`,
  link,
  settings: [
    {
      help: help.profile,
      key: "profile",
      type: cellViewType.select,
      option: Array(5)
        .fill(option.profile)
        .map((_, index) => _ + " " + (index + 1)),
      label: label.profile
    },
    {
      label: label.quick_switch,
      key: "quickSwitch",
      type: cellViewType.muiltSelect,
      option: []
    },
    {
      key: "panelPosition",
      type: cellViewType.select,
      option: option.panel_position,
      label: label.panel_position
    },
    {
      key: "panelHeight",
      type: cellViewType.select,
      option: option.panel_height,
      label: label.panel_height
    },
    {
      key: "panelControl",
      type: cellViewType.muiltSelect,
      option: option.panle_control,
      label: label.panle_control
    },
    {
      key: "screenAlwaysOn",
      type: cellViewType.switch,
      label: label.screen_always_on
    },
    {
      key: "lockExcerpt",
      type: cellViewType.switch,
      label: label.lock_excerpt
    },
    {
      key: "hasTitleThen",
      type: cellViewType.select,
      label: label.has_title_then,
      help: help.has_title_then,
      option: option.has_title_then
    },
    {
      help: help.auto_correct,
      key: "autoCorrect",
      type: cellViewType.switch,
      label: label.auto_correct
    }
  ]
}

export { config }
