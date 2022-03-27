import { Addon } from "const"
import { lang } from "./lang"
import type { IConfig } from "typings"
import { CellViewType } from "typings/enum"
import { IDocProfile, IProfile } from "profile"

const { link, label, help, option } = lang
const configs: IConfig<
  (IProfile & IDocProfile)["addon"],
  Record<string, string>
> = {
  name: Addon.title,
  key: "addon",
  intro: `version: ${Addon.version}`,
  link,
  settings: [
    {
      help: help.profile,
      key: "profile",
      type: CellViewType.Select,
      option: Array(5)
        .fill(option.profile)
        .map((_, index) => _ + " " + (index + 1)),
      label: label.profile
    },
    {
      label: label.quick_switch,
      key: "quickSwitch",
      type: CellViewType.MuiltSelect,
      option: []
    },
    {
      key: "panelPosition",
      type: CellViewType.Select,
      option: option.panel_position,
      label: label.panel_position
    },
    {
      key: "panelHeight",
      type: CellViewType.Select,
      option: option.panel_height,
      label: label.panel_height
    },
    {
      key: "panelControl",
      type: CellViewType.MuiltSelect,
      option: option.panle_control,
      label: label.panle_control
    },
    {
      key: "hasTitleThen",
      type: CellViewType.Select,
      label: label.has_title_then,
      help: help.has_title_then,
      option: option.has_title_then
    },
    {
      key: "screenAlwaysOn",
      type: CellViewType.Switch,
      label: label.screen_always_on
    },
    {
      key: "lockExcerpt",
      type: CellViewType.Switch,
      label: label.lock_excerpt
    }
  ]
}

const addon = {
  configs
}

export default addon
