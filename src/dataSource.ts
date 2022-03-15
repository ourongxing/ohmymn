import lang from "lang"
import { ISection, IConfig, IRow, IRowButton } from "typings"
import { cellViewType } from "typings/enum"
import { SerialCode } from "utils/text"
import { constModules, ModuleKeyType, modules } from "synthesizer"
import { Addon } from "const"

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

const genSection = (
  config: IConfig<AnyProperty<string>, AnyProperty<string>>
): ISection => {
  const rows: IRow[] = [
    {
      type: cellViewType.plainText,
      label: config.intro,
      link: config.link
    }
  ]
  for (const setting of config.settings) {
    //@ts-ignore magic hack
    rows.push(setting)
    if (setting.help) {
      switch (setting.type) {
        case cellViewType.muiltSelect:
        case cellViewType.select:
        case cellViewType.switch:
          rows.push({
            type: cellViewType.plainText,
            label: "↑ " + setting.help,
            link: setting.link
          })
          break
        case cellViewType.inlineInput:
        case cellViewType.input:
          rows.push({
            type: cellViewType.plainText,
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
  configs: IConfig<AnyProperty<string>, AnyProperty<string>>[],
  magicaction4card: IConfig<AnyProperty<string>, AnyProperty<string>>,
  magicaction4text: IConfig<AnyProperty<string>, AnyProperty<string>>
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
            (k.help ? k.help + "\n" : "") +
            lang.magicaction_from_which_module(config.name)
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
            (k.help ? k.help + "\n" : "") +
            lang.magicaction_from_which_module(config.name)
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
  const [section_OhMyMN, section_Gesture] = dataSource
  for (const row of section_OhMyMN.rows) {
    if (row.type == cellViewType.muiltSelect && row.key == "quickSwitch")
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

  dataSource.splice(1, 0, section_Action4Card)
  dataSource.splice(2, 0, section_Action4Text)
  dataSource.push(more)
  return dataSource
}

const genDataSourceIndex = (dataSource: ISection[]) => {
  const dataSourceIndex: AnyProperty<{ [k: string]: [number, number] }> = {}
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
      module: row.module,
      moduleName: row.moduleName
    })
    if (row.option?.length) {
      if (row.type == cellViewType.button || row.key == "mergeText") {
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
  [addon, ...Object.values(modules)].map(module => module.configs),
  magicaction4card.configs,
  magicaction4text.configs
)
export const dataSourceIndex = genDataSourceIndex(dataSourcePreset)
