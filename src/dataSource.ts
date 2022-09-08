import lang from "./lang"
import { more } from "./modules"
import { constModules, modules } from "./modules"
import { ModuleKeyType } from "./mergeMethod"
import { ISection, IConfig, IRow, IRowButton } from "./typings"
import { CellViewType } from "./enum"
import { serialSymbols } from "./utils"

const { addon, magicaction4card, magicaction4text } = constModules

export const actionKey4Card: {
  key: string
  option?: number
  module?: ModuleKeyType
  moduleName?: string
}[] = [{ key: "none" }, { key: "open_panel" }]
export const actionKey4Text: typeof actionKey4Card = [
  { key: "none" },
  { key: "open_panel" }
]

const genSection = (config: IConfig): ISection => {
  const rows: IRow[] = [
    {
      type: CellViewType.PlainText,
      label: config.intro,
      link: config.link
    }
  ]
  for (const setting of config.settings) {
    //@ts-ignore magic hack
    rows.push(setting)
    if (setting.help) {
      switch (setting.type) {
        case CellViewType.MuiltSelect:
        case CellViewType.Select:
        case CellViewType.Switch:
          rows.push({
            type: CellViewType.PlainText,
            label: "↑ " + setting.help,
            link: setting.link,
            bind: setting.bind
          })
          break
        case CellViewType.InlineInput:
        case CellViewType.Input:
          rows.push({
            type: CellViewType.PlainText,
            label: "↑ " + setting.help,
            link: setting.link,
            bind: setting.bind
          })
      }
    }
  }
  return {
    header: config.name,
    key: config.key as ModuleKeyType,
    rows
  }
}

const genDataSource = (
  configs: IConfig[],
  magicaction4card: IConfig,
  magicaction4text: IConfig
) => {
  const dataSource: ISection[] = []
  const moduleNameList: { key: string[]; name: string[] } = {
    key: [],
    name: []
  }
  const actions4card =
    magicaction4card.actions4card?.map(k => ({
      ...k,
      module: "magicaction4card" as ModuleKeyType,
      moduleName: "MagicAction For Card"
    })) ?? []
  const actions4text =
    magicaction4text.actions4text?.map(k => ({
      ...k,
      module: "magicaction4text" as ModuleKeyType,
      moduleName: "MagicAction For Text"
    })) ?? []
  configs.forEach(config => {
    dataSource.push(genSection(config))
    if (config.actions4card?.length)
      actions4card.push(
        ...config.actions4card.map(k => ({
          ...k,
          moduleName: config.name,
          module: config.key as ModuleKeyType,
          help:
            lang.magicaction_from_which_module(config.name) +
            (k.help ? "\n" + k.help : "")
        }))
      )
    if (config.actions4text?.length) {
      actions4text.push(
        ...config.actions4text.map(k => ({
          ...k,
          moduleName: config.name,
          module: (config.key ??
            config.name.replace(/\x20/g, "").toLowerCase()) as ModuleKeyType,
          help:
            lang.magicaction_from_which_module(config.name) +
            (k.help ? "\n" + k.help : "")
        }))
      )
    }
  })
  dataSource.forEach((sec, index) => {
    if (index) {
      moduleNameList.key.push(sec.key)
      moduleNameList.name.push(sec.header)
    }
  })

  const Action4CardSection = genSection(magicaction4card)
  Action4CardSection.rows.push(...actions4card)
  const Action4TextSection = genSection(magicaction4text)
  Action4TextSection.rows.push(...actions4text)

  // 更新 quickSwitch 为 moduleList
  const [AddonSection, GestureSection] = dataSource
  for (const row of AddonSection.rows) {
    if (row.type == CellViewType.MuiltSelect && row.key == "quickSwitch")
      row.option = moduleNameList.name.map(
        (value, index) =>
          serialSymbols.hollow_circle_number[index] + " " + value
      )
  }

  // 同步 gesture 的 option 为 magicaction 列表
  const { gestureOption: gestureOption4Card, actionKeys: _actionKey4Card } =
    getActionKeyGetureOption(Action4CardSection)
  const { gestureOption: gestureOption4Text, actionKeys: _actionKey4Text } =
    getActionKeyGetureOption(Action4TextSection)

  actionKey4Card.push(..._actionKey4Card)
  actionKey4Text.push(..._actionKey4Text)
  GestureSection.rows = GestureSection.rows.map(row => {
    if (row.type == CellViewType.Select) {
      if (row.key.includes("selectionBar"))
        row.option = [lang.none, ...gestureOption4Text]
      else row.option = [lang.none, ...gestureOption4Card]
    }
    return row
  })

  dataSource.splice(1, 0, Action4CardSection)
  dataSource.splice(2, 0, Action4TextSection)
  dataSource.push(more)
  return {
    dataSource,
    moduleNameList
  }
}

function genDataSourceIndex(dataSource: ISection[]) {
  return dataSource.reduce((acc, sec, secIndex) => {
    acc[sec.key] = sec.rows.reduce((acc, row, rowIndex) => {
      if (row.type != CellViewType.PlainText) {
        acc[row.key] = [secIndex, rowIndex]
      }
      return acc
    }, {} as Record<string, [number, number]>)
    return acc
  }, {} as Record<ModuleKeyType, Record<string, [number, number]>>)
}

const getActionKeyGetureOption = (section: ISection) => {
  const gestureOption = [lang.open_panel]
  const actionKeys = []
  for (const _row of section.rows) {
    if (
      _row.type !== CellViewType.Button &&
      _row.type !== CellViewType.ButtonWithInput
    )
      continue
    const row = _row as IRowButton
    gestureOption.push(row.label)
    if (!row.option?.length)
      actionKeys.push({
        key: row.key,
        module: row.module,
        moduleName: row.moduleName,
        option: row.type === CellViewType.ButtonWithInput ? undefined : 0
      })
    else {
      actionKeys.push({
        key: row.key,
        module: row.module,
        moduleName: row.moduleName
      })
      if (row.type == CellViewType.Button) {
        row.option.forEach((option, index) => {
          gestureOption.push("——" + option)
          actionKeys.push({
            key: row.key,
            option: index,
            module: row.module,
            moduleName: row.moduleName
          })
        })
      } else if (row.option[0].includes("Auto")) {
        gestureOption.push("——" + row.option[0])
        actionKeys.push({
          key: row.key,
          option: 0,
          module: row.module,
          moduleName: row.moduleName
        })
      }
    }
  }
  return { actionKeys, gestureOption }
}

export const { dataSource: dataSourcePreset, moduleNameList } = genDataSource(
  // @ts-ignore
  [addon, ...Object.values(modules)],
  magicaction4card,
  magicaction4text
)
export const dataSourceIndex = genDataSourceIndex(dataSourcePreset)
