import { requiredModules, optionalModules } from "../modules"
import type { AllModuleKeyUnion, OptionalModuleKeyUnion } from "../coreModule"
import type { ISection, IConfig, IRow, IRowButton } from "~/typings"
import { CellViewType } from "~/typings"
import { more } from "./more"
import lang from "./lang"

function genSection(config: IConfig<AllModuleKeyUnion>): ISection {
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
    if (setting.type !== CellViewType.Expland) {
      if (setting.help) {
        switch (setting.type) {
          case CellViewType.MuiltSelect:
          case CellViewType.Select:
          case CellViewType.Switch:
          case CellViewType.InlineInput:
          case CellViewType.Input: {
            rows.push({
              type: CellViewType.PlainText,
              label: setting.help,
              link: setting.link,
              bind: setting.bind
            })
          }
        }
      }
    }
  }
  if (config.key === "addon") {
    rows.splice(4, 0, {
      type: CellViewType.PlainText,
      label: lang.expand
    })
  } else {
    rows.splice(1, 0, {
      type: CellViewType.PlainText,
      label: lang.expand
    })
  }
  return {
    header: config.name,
    key: config.key as AllModuleKeyUnion,
    rows
  }
}

function genDataSource(
  configs: IConfig<AllModuleKeyUnion>[],
  magicaction4card: IConfig<"magicaction4card">,
  magicaction4text: IConfig<"magicaction4text">
) {
  const dataSource: ISection[] = []
  const moduleNameList: { key: string[]; name: string[] } = {
    key: [],
    name: []
  }
  const actions4card =
    magicaction4card.actions4card?.map(k => ({
      ...k,
      module: "magicaction4card" as AllModuleKeyUnion,
      moduleName: "MagicAction For Card"
    })) ?? []
  const actions4text =
    magicaction4text.actions4text?.map(k => ({
      ...k,
      module: "magicaction4text" as AllModuleKeyUnion,
      moduleName: "MagicAction For Text"
    })) ?? []
  configs.forEach(config => {
    dataSource.push(genSection(config))
    if (config.actions4card?.length) {
      actions4card.push(
        ...config.actions4card.map(k => ({
          ...k,
          moduleName: config.name,
          module: config.key as AllModuleKeyUnion,
          help:
            lang.magicaction_from_which_module(config.name) +
            (k.help ? k.help : "")
        }))
      )
    }
    if (config.actions4text?.length) {
      actions4text.push(
        ...config.actions4text.map(k => ({
          ...k,
          moduleName: config.name,
          module: (config.key ??
            config.name
              .replace(/\x20/g, "")
              .toLowerCase()) as AllModuleKeyUnion,
          help:
            lang.magicaction_from_which_module(config.name) +
            (k.help ? k.help : "")
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

  const Action4CardSection = genSection(
    magicaction4card as IConfig<AllModuleKeyUnion>
  )
  Action4CardSection.rows.push(...actions4card)
  const Action4TextSection = genSection(
    magicaction4text as IConfig<AllModuleKeyUnion>
  )
  Action4TextSection.rows.push(...actions4text)

  // 更新 quickSwitch 为 moduleList
  const [AddonSection, ShortcutSection, GestureSection, ToolbarSection] =
    dataSource
  for (const row of AddonSection.rows) {
    if (row.type == CellViewType.MuiltSelect && row.key == "quickSwitch")
      row.option = moduleNameList.name
  }

  // 同步 gesture 的 option 为 magicaction 列表
  const { options: option4Card, actionKeys: _actionKey4Card } =
    getActionKeyOption(Action4CardSection)
  const { options: option4Text, actionKeys: _actionKey4Text } =
    getActionKeyOption(Action4TextSection)

  actionKey4Card.push(..._actionKey4Card)
  actionKey4Text.push(..._actionKey4Text)
  GestureSection.rows = GestureSection.rows.map(row => {
    if (row.type == CellViewType.Select) {
      if (row.key.includes("selectionBar"))
        row.option = [lang.none, ...option4Text]
      else row.option = [lang.none, ...option4Card]
    }
    return row
  })
  ShortcutSection.rows = ShortcutSection.rows.map(row => {
    if (row.type == CellViewType.Select) {
      if (row.key.includes("text")) row.option = [lang.none, ...option4Text]
      else row.option = [lang.none, ...option4Card]
    }
    return row
  })
  ToolbarSection.rows = ToolbarSection.rows.map(row => {
    if (row.type == CellViewType.Select) {
      if (row.key.includes("text")) row.option = [lang.none, ...option4Text]
      else row.option = [lang.none, ...option4Card]
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
  }, {} as Record<AllModuleKeyUnion, Record<string, [number, number]>>)
}

function getActionKeyOption(section: ISection) {
  const options = [lang.custom_shortcut, lang.open_panel]
  const actionKeys = []
  for (const _row of section.rows) {
    if (
      _row.type !== CellViewType.Button &&
      _row.type !== CellViewType.ButtonWithInput
    )
      continue
    const row = _row as IRowButton
    options.push(row.label)
    if (!row.option?.length) {
      if (
        row.key.includes("aiActionPrompts") ||
        row.type === CellViewType.ButtonWithInput
      ) {
        actionKeys.push({
          key: row.key,
          module: row.module as OptionalModuleKeyUnion,
          moduleName: row.moduleName,
          option: undefined
        })
      } else {
        actionKeys.push({
          key: row.key,
          module: row.module as OptionalModuleKeyUnion,
          moduleName: row.moduleName,
          option: 0
        })
      }
    } else {
      actionKeys.push({
        key: row.key,
        module: row.module as OptionalModuleKeyUnion,
        moduleName: row.moduleName
      })
      if (row.type == CellViewType.Button) {
        row.option.forEach((option, index) => {
          options.push("——" + option)
          actionKeys.push({
            key: row.key,
            option: index,
            module: row.module as OptionalModuleKeyUnion,
            moduleName: row.moduleName
          })
        })
      } else if (row.option[0].includes("Auto")) {
        options.push("——" + row.option[0])
        actionKeys.push({
          key: row.key,
          option: 0,
          module: row.module as OptionalModuleKeyUnion,
          moduleName: row.moduleName
        })
      }
    }
  }
  return { actionKeys, options }
}

export const actionKey4Card: {
  key: string
  option?: number
  module?: OptionalModuleKeyUnion
  moduleName?: string
}[] = [{ key: "none" }, { key: "customShortcut" }, { key: "switchPanel" }]

export const actionKey4Text: typeof actionKey4Card = [
  { key: "none" },
  { key: "customShortcut" },
  { key: "switchPanel" }
]

const { addon, magicaction4card, magicaction4text } = requiredModules

export const { dataSource: defaultDataSource, moduleNameList } = genDataSource(
  [addon, ...Object.values(optionalModules)] as IConfig<AllModuleKeyUnion>[],
  magicaction4card,
  magicaction4text
)

export const dataSourceIndex = genDataSourceIndex(defaultDataSource)
