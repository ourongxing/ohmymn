import * as anotherautotitle from "addons/anotherautotitle"
import * as autocomplete from "addons/autocomplete"
import * as autolist from "addons/autolist"
import * as autoreplace from "addons/autoreplace"
import * as autostandardize from "addons/autostandardize"
import * as magicaction from "addons/magicaction"
import * as anotherautodef from "addons/anotherautodef"
import * as autotag from "addons/autotag"
import * as autostyle from "addons/autostyle"
import * as ohmymn from "addons/ohmymn"
import * as gesture from "addons/gesture"
import { cellViewType, IConfig, IRow, ISection } from "types/Addon"
import lang from "lang"
import { SerialNumber } from "utils/text"

// magicaction, ohmymn 默认前两个，不用包含在内
const addons = [
  gesture,
  anotherautotitle,
  anotherautodef,
  autostandardize,
  autocomplete,
  autoreplace,
  autolist,
  autotag,
  autostyle
]

// 插件总开关，与上面顺序一致，新插件只能加在最后，因为配置文件只记录索引
export const enum QuickSwitch {
  gesture,
  anotherautotitle,
  anotherautodef,
  autostandardize,
  autocomplete,
  autoreplace,
  autolist,
  autotag,
  autostyle
}

const more: ISection = {
  header: "More",
  rows: [
    {
      type: cellViewType.plainText,
      label: lang.addon.more.donate,
      link: "https://cdn.jsdelivr.net/gh/mnaddon/ohmymn/assets/donate.gif"
    },
    {
      type: cellViewType.plainText,
      label: lang.addon.more.github,
      link: "https://github.com/mnaddon/ohmymn"
    },
    {
      type: cellViewType.plainText,
      label: lang.addon.more.feishu,
      link: "https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=b48nfc45-22ff-4a3f-a1e3-f0f84c50db53"
    },
    {
      type: cellViewType.plainText,
      label: "\n\n\n\n\n",
      link: ""
    }
  ]
}

const genSection = (config: IConfig): ISection => {
  const rows: IRow[] = [
    {
      type: cellViewType.plainText,
      label: config.intro,
      link: config.link ?? ""
    }
  ]
  for (const setting of config.settings) {
    //@ts-ignore
    rows.push(setting)
    if (
      setting.help &&
      [
        cellViewType.select,
        cellViewType.muiltSelect,
        cellViewType.switch
      ].includes(setting.type)
    )
      rows.push({
        type: cellViewType.plainText,
        label: "↑ " + setting.help,
        link: setting.link ?? ""
      })
    else if (setting.label && setting.type == cellViewType.input)
      rows.push({
        type: cellViewType.plainText,
        label: "↑ " + setting.label,
        link: setting.link ?? "",
        bind: setting.bind
      })
    else if (setting.help && setting.type == cellViewType.inlineInput) {
      rows.push({
        type: cellViewType.plainText,
        label: "↑ " + setting.help,
        link: setting.link ?? "",
        bind: setting.bind
      })
    }
  }
  return {
    header: config.name,
    rows
  }
}

export const actionKey: { key: string; option?: number }[] = [
  { key: "none" },
  { key: "open_panel" }
]

export const addonList: string[] = []

export const genDataSource = (
  configs: IConfig[],
  magicaction: IConfig
): ISection[] => {
  const dataSource: ISection[] = []
  for (let config of configs) {
    dataSource.push(genSection(config))
    if (config.actions.length) {
      for (let action of config.actions) magicaction.actions.push(action)
    }
    magicaction.settings = magicaction.actions
  }
  dataSource.unshift(genSection(magicaction))
  dataSource.forEach((sec, index) => {
    if (index > 1) addonList.push(sec.header)
  })

  // 更新 quickSwitch 为 addonList
  for (const row of dataSource[1].rows) {
    if (row.type == cellViewType.muiltSelect && row.key == "quickSwitch")
      row.option = addonList.map(
        (value, index) => SerialNumber.hollow_circle_number[index] + " " + value
      )
  }

  // 同步 gesture 的 option 为 magicaction 列表
  const gestureOption = [lang.implement_datasource_method.open_panel]
  dataSource[0].rows.forEach(row => {
    if (row.type != cellViewType.plainText) {
      gestureOption.push(row.label)
      actionKey.push({
        key: row.key
      })
      if (row.type == cellViewType.button && row.option) {
        row.option.forEach((option, index) => {
          gestureOption.push("——" + option)
          actionKey.push({
            key: row.key,
            option: index
          })
        })
      } else if (
        row.type == cellViewType.buttonWithInput &&
        row.option?.length &&
        row.option[0].includes("Auto")
      ) {
        gestureOption.push("——" + row.option[0])
        actionKey.push({
          key: row.key,
          option: 0
        })
      }
    }
  })
  dataSource[2].rows = dataSource[2].rows.map(row => {
    if (row.type == cellViewType.select)
      row.option = [lang.implement_datasource_method.none, ...gestureOption]
    return row
  })

  dataSource.push(more)
  return dataSource
}

const genDataSourceIndex = (dataSource: ISection[]) => {
  const dataSourceIndex: {
    [k: string]: {
      [k: string]: [number, number]
    }
  } = {}
  dataSource.forEach((section, secIndex) => {
    const name = section.header.toLowerCase()
    dataSourceIndex[name] = {}
    section.rows.forEach((row, rowIndex) => {
      if (row.type != cellViewType.plainText)
        dataSourceIndex[name][row.key] = [secIndex, rowIndex]
    })
  })
  return dataSourceIndex
}

const mergeActions = () => {
  const actions = { ...magicaction.action }
  addons.forEach(addon => Object.assign(actions, addon.action))
  return actions
}

export const actions = mergeActions()
export const dataSourcePreset = genDataSource(
  [ohmymn, ...addons].map(addon => addon.config),
  magicaction.config
)
export const dataSourceIndex = genDataSourceIndex(dataSourcePreset)
