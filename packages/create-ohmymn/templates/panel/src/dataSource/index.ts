import { requiredModules } from "../modules"
import type { AllModuleKeyUnion } from "../coreModule"
import type { ISection, IConfig, IRow } from "~/typings"
import { CellViewType } from "~/typings"
import lang from "./lang"
import { more } from "./more"

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
  return {
    header: config.name,
    key: config.key as AllModuleKeyUnion,
    rows
  }
}

function genDataSource(
  configs: IConfig<AllModuleKeyUnion>[],
  magicaction: IConfig<"magicaction">
) {
  const dataSource: ISection[] = []
  const moduleNameList: { key: string[]; name: string[] } = {
    key: [],
    name: []
  }
  const actions =
    magicaction.actions?.map(k => ({
      ...k,
      module: "magicaction4card" as AllModuleKeyUnion,
      moduleName: "MagicAction For Card"
    })) ?? []
  configs.forEach(config => {
    dataSource.push(genSection(config))
    if (config.actions?.length) {
      actions.push(
        ...config.actions.map(k => ({
          ...k,
          moduleName: config.name,
          module: config.key as AllModuleKeyUnion,
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
    magicaction as IConfig<AllModuleKeyUnion>
  )
  Action4CardSection.rows.push(...actions)
  dataSource.splice(1, 0, Action4CardSection)
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

export const { dataSource: defaultDataSource, moduleNameList } = genDataSource(
  Object.values(requiredModules).filter(
    k => k.key !== "magicaction"
  ) as IConfig<AllModuleKeyUnion>[],
  requiredModules.magicaction
)

export const dataSourceIndex = genDataSourceIndex(defaultDataSource)
