import * as anotherautotitle from "modules/anotherautotitle"
import * as autocomplete from "modules/autocomplete"
import * as autolist from "modules/autolist"
import * as autoreplace from "modules/autoreplace"
import * as autostandardize from "modules/autostandardize"
import * as magicaction4card from "modules/magicaction4card"
import * as magicaction4text from "modules/magicaction4text"
import * as anotherautodef from "modules/anotherautodef"
import * as autotag from "modules/autotag"
import * as autostyle from "modules/autostyle"
import * as ohmymn from "modules/ohmymn"
import * as gesture from "modules/gesture"
import * as copysearch from "modules/copysearch"
import type {
  IActionMethod4Text,
  IConfig,
  IRow,
  IRowButton,
  ISection,
  Methods
} from "typings"
import { SerialCode } from "utils/text"
import { cellViewType } from "typings/enum"
import lang from "lang"

// ohmymn, magicaction 默认前两个，不用包含在内
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
  key: "more",
  rows: [
    {
      type: cellViewType.plainText,
      label: lang.more.donate,
      link: "https://cdn.jsdelivr.net/gh/mnaddon/ohmymn/assets/donate.gif"
    },
    {
      type: cellViewType.plainText,
      label: lang.more.mn5,
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
    key: config.name.replace(/\x20/g, "").toLowerCase(),
    rows
  }
}

export const actionKey4Card: {
  key: string
  option?: number
  module?: string
}[] = [{ key: "none" }, { key: "open_panel" }]
export const actionKey4Text: typeof actionKey4Card = [
  { key: "none" },
  { key: "open_panel" }
]
export const moduleList: string[] = []

export const genDataSource = (
  configs: IConfig[],
  magicaction4card: IConfig,
  magicaction4text: IConfig
): ISection[] => {
  const dataSource: ISection[] = []

  const actions4card = magicaction4card.actions4card ?? []
  const actions4text = magicaction4text.actions4text ?? []
  configs.forEach(config => {
    dataSource.push(genSection(config))
    if (config.actions4card?.length)
      actions4card.push(
        ...config.actions4card.map(k => {
          k.module = config.name
          if (k.help) k.help += "\n"
          else k.help = ""
          k.help += lang.magicaction_from_which_module(config.name)
          return k
        })
      )
    if (config.actions4text?.length) {
      actions4text.push(
        ...config.actions4text.map(k => {
          k.module = config.name
          if (k.help) k.help += "\n"
          else k.help = ""
          k.help += lang.magicaction_from_which_module(config.name)
          return k
        })
      )
    }
  })
  magicaction4card.settings.push(...actions4card)
  magicaction4text.settings.push(...actions4text)
  dataSource.forEach((sec, index) => {
    index && moduleList.push(sec.header)
  })
  dataSource.splice(1, 0, genSection(magicaction4card))
  dataSource.splice(2, 0, genSection(magicaction4text))

  // 更新 quickSwitch 为 moduleList
  const [
    section_OhMyMN,
    section_Action4Card,
    section_Action4Text,
    section_Gesture
  ] = dataSource
  for (const row of section_OhMyMN.rows) {
    if (row.type == cellViewType.muiltSelect && row.key == "quickSwitch")
      row.option = moduleList.map(
        (value, index) => SerialCode.hollow_circle_number[index] + " " + value
      )
  }

  // 同步 gesture 的 option 为 magicaction 列表
  const { gestureOption: gestureOption4Card, actionKeys: _actionKey4Card } =
    getActionKeyGetureOption(section_Action4Card)
  const { gestureOption: gestureOption4Text, actionKeys: _actionKey4Text } =
    getActionKeyGetureOption(section_Action4Text)

  actionKey4Card.push(..._actionKey4Card)
  actionKey4Text.push(..._actionKey4Text)
  section_Gesture.rows = section_Gesture.rows.map(row => {
    if (row.type == cellViewType.select) {
      if (row.key.includes("selectionBar"))
        row.option = [
          lang.implement_datasource_method.none,
          ...gestureOption4Text
        ]
      else
        row.option = [
          lang.implement_datasource_method.none,
          ...gestureOption4Card
        ]
    }
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
    const name = section.key
    dataSourceIndex[name] = {}
    section.rows.forEach((row, rowIndex) => {
      if (row.type != cellViewType.plainText)
        dataSourceIndex[name][row.key] = [secIndex, rowIndex]
    })
  })
  return dataSourceIndex
}

const getActionKeyGetureOption = (section: ISection) => {
  const gestureOption = [lang.implement_datasource_method.open_panel]
  const actionKeys = []
  for (const _row of section.rows) {
    if (
      _row.type !== cellViewType.button &&
      _row.type !== cellViewType.buttonWithInput
    )
      continue
    const row = _row as IRowButton
    gestureOption.push(row.label)
    actionKeys.push({
      key: row.key,
      module: row.module
    })
    if (row.option?.length) {
      if (row.type == cellViewType.button || row.key == "mergeText") {
        row.option.forEach((option, index) => {
          gestureOption.push("——" + option)
          actionKeys.push({
            key: row.key,
            option: index,
            module: row.module
          })
        })
      } else if (row.option[0].includes("Auto")) {
        gestureOption.push("——" + row.option[0])
        actionKeys.push({
          key: row.key,
          option: 0,
          module: row.module
        })
      }
    }
  }
  return { actionKeys, gestureOption }
}

const mergeActions4Card = () => {
  const actions = { ...magicaction4card.actions4card }
  modules.forEach(module => {
    if ("actions4card" in module) Object.assign(actions, module.actions4card)
  })
  return actions
}

const mergeActions4Text = () => {
  const actions = {} as Methods<IActionMethod4Text>
  modules.forEach(module => {
    if ("actions4text" in module) Object.assign(actions, module.actions4text)
  })
  return actions
}

export const actions4card = mergeActions4Card()
export const actions4text = mergeActions4Text()
export const dataSourcePreset = genDataSource(
  [ohmymn, ...modules].map(module => module.configs),
  magicaction4card.configs,
  magicaction4text.configs
)
export const dataSourceIndex = genDataSourceIndex(dataSourcePreset)
