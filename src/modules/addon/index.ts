import { Addon } from "const"
import { lang } from "./lang"
import type { ICheckMethod, IConfig } from "typings"
import { CellViewType } from "typings/enum"
import { IDocProfile, IProfile } from "profile"
import { checkInteger } from "utils/checkInput"

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
      option: [
        ...Array(4)
          .fill(option.profile)
          .map((_, index) => _ + " " + (index + 1)),
        option.initialize
      ],
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
    },
    {
      key: "autoBackup",
      type: CellViewType.Switch,
      label: label.auto_backup,
      help: help.auto_backup
    },
    {
      key: "pageOffset",
      type: CellViewType.InlineInput,
      label: label.page_offset,
      help: help.page_offset
    }
  ]
}

const checker: ICheckMethod<IDocProfile["addon"]> = (input, key) => {
  switch (key) {
    case "pageOffset":
      checkInteger(Number(input))
    default:
      return false
  }
}

const addon = {
  configs,
  checker
}

export default addon
