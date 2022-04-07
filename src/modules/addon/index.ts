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
      key: "showDocInfo",
      type: CellViewType.Switch,
      label: "显示 / 隐藏文档信息"
    },
    {
      key: "author",
      type: CellViewType.InlineInput,
      label: "作者",
      bind: [["showDocInfo", 1]]
    },
    {
      key: "type",
      type: CellViewType.InlineInput,
      label: "类型",
      bind: [["showDocInfo", 1]]
    },
    {
      key: "publisher",
      type: CellViewType.InlineInput,
      label: "出版社",
      bind: [["showDocInfo", 1]]
    },
    {
      key: "publicationDate",
      type: CellViewType.InlineInput,
      label: "出版时间",
      bind: [["showDocInfo", 1]]
    },
    {
      key: "publicationPlace",
      type: CellViewType.InlineInput,
      label: "出版地",
      bind: [["showDocInfo", 1]]
    },
    {
      key: "pageOffset",
      type: CellViewType.InlineInput,
      label: label.page_offset,
      bind: [["showDocInfo", 1]]
    },
    {
      key: "otherInfo",
      type: CellViewType.Input,
      help: "其他信息",
      bind: [["showDocInfo", 1]]
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
