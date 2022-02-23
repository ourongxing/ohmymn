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
import * as copysearch from "modules/copysearch"
import { cellViewType, IConfig, IRow, IRowButton, ISection } from "types/Addon"
import lang from "lang"
import { SerialCode } from "utils/text"

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
  autostyle,
  copysearch
]

// 插件总开关，与上面顺序一致，新插件只能加在最后，因为配置文件只记录索引
export enum QuickSwitch {
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

export type AutoModuleKey = Exclude<
  keyof typeof QuickSwitch,
  "gesture" | "copysearch"
>

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
        cellViewType.muiltSelect,
        cellViewType.select,
        cellViewType.switch
      ].includes(setting.type)
    )
      rows.push({
        type: cellViewType.plainText,
        label: "↑ " + setting.help,
        link: setting.link ?? ""
      })
    if (setting.label && setting.type == cellViewType.input)
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

export const actionKey: { key: string; option?: number; module?: string }[] = [
  { key: "none" },
  { key: "open_panel" }
]

export const moduleList: string[] = []
export const genDataSource = (
  configs: IConfig[],
  magicaction: IConfig
): ISection[] => {
  const dataSource: ISection[] = []
  configs.forEach(config => {
    dataSource.push(genSection(config))
    config.actions.length &&
      magicaction.actions.push(
        ...config.actions.map(k => {
          k.module = config.name
          if (k.help) k.help += "\n"
          else k.help = ""
          k.help += lang.module.magicaction.help.from_which_module(config.name)
          return k
        })
      )
  })
  magicaction.settings.push(...magicaction.actions)
  dataSource.splice(1, 0, genSection(magicaction))

  dataSource.forEach((sec, index) => {
    index > 1 && moduleList.push(sec.header)
  })

  // 更新 quickSwitch 为 moduleList
  for (const row of dataSource[0].rows) {
    if (row.type == cellViewType.muiltSelect && row.key == "quickSwitch")
      row.option = moduleList.map(
        (value, index) => SerialCode.hollow_circle_number[index] + " " + value
      )
  }

  // 同步 gesture 的 option 为 magicaction 列表
  const gestureOption = [lang.implement_datasource_method.open_panel]
  for (const _row of dataSource[1].rows) {
    if (_row.type == cellViewType.plainText) continue
    const row = _row as IRowButton
    gestureOption.push(row.label)
    actionKey.push({
      key: row.key,
      module: row.module
    })
    if (row.option?.length) {
      if (row.type == cellViewType.button || row.key == "mergeText") {
        row.option.forEach((option, index) => {
          gestureOption.push("——" + option)
          actionKey.push({
            key: row.key,
            option: index,
            module: row.module
          })
        })
      } else if (row.option[0].includes("Auto")) {
        gestureOption.push("——" + row.option[0])
        actionKey.push({
          key: row.key,
          option: 0,
          module: row.module
        })
      }
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
