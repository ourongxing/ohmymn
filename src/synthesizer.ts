import * as anotherautotitle from "modules/anotherautotitle"
import * as autocomplete from "modules/autocomplete"
import * as autolist from "modules/autolist"
import * as autoreplace from "modules/autoreplace"
import * as autostandardize from "modules/autostandardize"
import * as magicaction from "modules/magicaction"
import * as anotherautodef from "modules/anotherautodef"
import * as autotag from "modules/autotag"
import * as autostyle from "modules/autostyle"
import * as ohmymn from "modules/ohmymn"
import * as gesture from "modules/gesture"
import { cellViewType, IConfig, IRow, ISection } from "types/Addon"
import lang from "lang"
import { SerialNumber } from "utils/text"

// magicaction, ohmymn 默认前两个，不用包含在内
const modules = [
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
      label: lang.module.more.donate,
      link: "https://cdn.jsdelivr.net/gh/mnaddon/ohmymn/assets/donate.gif"
    },
    {
      type: cellViewType.plainText,
      label: lang.module.more.mn5,
      link: ""
    },
    {
      type: cellViewType.plainText,
      label: "\n\n\n\n\n\n\n\n",
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

export const moduleList: string[] = []

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
    if (index > 1) moduleList.push(sec.header)
  })

  // 更新 quickSwitch 为 moduleList
  for (const row of dataSource[1].rows) {
    if (row.type == cellViewType.muiltSelect && row.key == "quickSwitch")
      row.option = moduleList.map(
        (value, index) => SerialNumber.hollow_circle_number[index] + " " + value
      )
  }

  // 同步 gesture 的 option 为 magicaction 列表
  const gestureOption = [lang.implement_datasource_method.open_panel]
  for (const row of dataSource[0].rows) {
    if (row.type == cellViewType.plainText) continue
    gestureOption.push(row.label)
    actionKey.push({
      key: row.key
    })
    if (
      (row.type == cellViewType.button && row.option?.length) ||
      (row.type == cellViewType.buttonWithInput &&
        row.option?.length &&
        row.key == "mergeText")
    ) {
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
  modules.forEach(module => Object.assign(actions, module.action))
  return actions
}

export const actions = mergeActions()
export const dataSourcePreset = genDataSource(
  [ohmymn, ...modules].map(module => module.config),
  magicaction.config
)
export const dataSourceIndex = genDataSourceIndex(dataSourcePreset)
