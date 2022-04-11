import lang from "lang"
import { ISection, IConfig, IRow, IRowButton } from "typings"
import { CellViewType } from "typings/enum"
import { SerialCode } from "utils/text"
import { constModules, ModuleKeyType, modules } from "synthesizer"

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

const more: ISection = {
  header: "More",
  key: "more",
  rows: [
    {
      type: CellViewType.PlainText,
      label: "\n\n\n\n\n\n\n\n\n\n",
      link: ""
    }
  ]
}

const genSection = (
  config: IConfig<Record<string, string>, Record<string, string>>
): ISection => {
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
    key: (config.key ??
      config.name.replace(/\x20/g, "").toLowerCase()) as ModuleKeyType,
    rows
  }
}

const genDataSource = (
  configs: IConfig<Record<string, string>, Record<string, string>>[],
  magicaction4card: IConfig<Record<string, string>, Record<string, string>>,
  magicaction4text: IConfig<Record<string, string>, Record<string, string>>
): ISection[] => {
  const dataSource: ISection[] = []
  const moduleNameList: string[] = []
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
          module: (config.key ??
            config.name.replace(/\x20/g, "").toLowerCase()) as ModuleKeyType,
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
    index && moduleNameList.push(sec.header)
  })

  const section_Action4Card = genSection(magicaction4card)
  section_Action4Card.rows.push(...actions4card)
  const section_Action4Text = genSection(magicaction4text)
  section_Action4Text.rows.push(...actions4text)

  // 更新 quickSwitch 为 moduleList
  const [section_Addon, section_Gesture] = dataSource
  for (const row of section_Addon.rows) {
    if (row.type == CellViewType.MuiltSelect && row.key == "quickSwitch")
      row.option = moduleNameList.map(
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
    if (row.type == CellViewType.Select) {
      if (row.key.includes("selectionBar"))
        row.option = [lang.none, ...gestureOption4Text]
      else row.option = [lang.none, ...gestureOption4Card]
    }
    return row
  })

  dataSource.splice(1, 0, section_Action4Card)
  dataSource.splice(2, 0, section_Action4Text)
  dataSource.push(more)
  return dataSource
}

const genDataSourceIndex = (dataSource: ISection[]) => {
  // @ts-ignore
  const dataSourceIndex: Record<
    ModuleKeyType,
    Record<string, [number, number]>
  > = {}
  dataSource.forEach((section, secIndex) => {
    const name = section.key
    dataSourceIndex[name] = {}
    section.rows.forEach((row, rowIndex) => {
      if (row.type != CellViewType.PlainText)
        dataSourceIndex[name][row.key] = [secIndex, rowIndex]
    })
  })
  return dataSourceIndex
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
        moduleName: row.moduleName
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

export const dataSourcePreset = genDataSource(
  //@ts-ignore
  [addon, ...Object.values(modules)].map(module => module.configs),
  magicaction4card.configs,
  magicaction4text.configs
)
export const dataSourceIndex = genDataSourceIndex(dataSourcePreset)
