import anotherautotitle from "addons/anotherautotitle"
import autocomplete from "addons/autocomplete"
import autolist from "addons/autolist"
import autoreplace from "addons/autoreplace"
import autostandardize from "addons/autostandardize"
import magicaction from "addons/magicaction"
import ohmymn from "addons/ohmymn"
import { log } from "utils/common"

interface IAddon {
  config: IConfig
  util: {}
  action: {}
}

// 不要包含 magication，不存在，顺序为显示的顺序，magiction 始终为第1个
const addons: IAddon[] = [
  ohmymn,
  anotherautotitle,
  autostandardize,
  autocomplete,
  autoreplace,
  autolist
]

const genActionsUtils = () => {
  // 为了避免循环引用，配置文件还是自己写比较好
  const utils: any = {}
  const actions: any = { ...magicaction.action }
  for (const addon of addons) {
    const name = addon.config.name.toLowerCase()
    utils[name] = addon.util
    Object.assign(actions, addon.action)
  }
  return { actions, utils }
}

const genSection = (config: IConfig): ISection => {
  const rows: Array<IRow> = [
    {
      type: cellViewType.plainText,
      label: config.intro,
      link: config.link ?? ""
    }
  ]
  for (const setting of config.settings) {
    if (
      setting.help &&
      setting.type != cellViewType.buttonWithInput &&
      setting.type != cellViewType.button
    )
      rows.push({
        type: cellViewType.plainText,
        label: setting.help,
        link: setting.link ?? ""
      })
    else if (setting.label && setting.type == cellViewType.input)
      rows.push({
        type: cellViewType.plainText,
        label: setting.label,
        link: setting.link ?? ""
      })
    //@ts-ignore
    rows.push(setting)
  }
  return {
    header: config.name,
    rows
  }
}

export const genDataSource = (
  configs: Array<IConfig>,
  magicaction: IConfig
): Array<ISection> => {
  const dataSource: Array<ISection> = []
  for (let config of configs) {
    dataSource.push(genSection(config))
    if (config.actions.length) {
      for (let action of config.actions) magicaction.actions.push(action)
    }
    magicaction.settings = magicaction.actions.sort(
      (a: ISetting, b: ISetting) => {
        const val1 = a.label!.length
        const val2 = b.label!.length
        return val1 - val2
      }
    )
  }
  dataSource.splice(0, 0, genSection(magicaction))
  // 最后加块空白，防止被键盘遮挡，按理说输入框会自动上移的，但现在不知道为啥不行了
  dataSource[dataSource.length - 1].rows.push({
    type: cellViewType.button,
    key: "space",
    label: ""
  })
  return dataSource
}

const genDataSourceIndex = (dataSource: Array<ISection>) => {
  const dataSourceIndex: any = {}
  dataSource.forEach((section, secIndex) => {
    const name = section.header.toLowerCase()
    if (name != "magicaction") {
      dataSourceIndex[name] = {}
      section.rows.forEach((row, rowIndex) => {
        switch (row.type) {
          case cellViewType.inlineInput:
          case cellViewType.input:
          case cellViewType.switch:
          case cellViewType.select:
          case cellViewType.muiltSelect:
            dataSourceIndex[name][row.key] = [secIndex, rowIndex]
        }
      })
    }
  })
  return dataSourceIndex
}

export const { actions, utils } = genActionsUtils()
export const dataSource: Array<ISection> = genDataSource(
  addons.map(addon => addon.config),
  magicaction.config
)
export const dataSourceIndex = genDataSourceIndex(dataSource)
