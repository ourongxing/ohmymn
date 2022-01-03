import * as anotherautotitle from "addons/anotherautotitle"
import * as autocomplete from "addons/autocomplete"
import * as autolist from "addons/autolist"
import * as autoreplace from "addons/autoreplace"
import * as autostandardize from "addons/autostandardize"
import * as magicaction from "addons/magicaction"
import * as anotherautodef from "addons/anotherautodef"
import * as ohmymn from "addons/ohmymn"
import * as gesture from "addons/gesture"
import { cellViewType, IConfig, IRow, ISection, ISetting } from "types/Addon"
import { log } from "utils/common"

// magicaction, ohmymn, gesture 默认前三个，不用包含在内
const addons = [
  anotherautotitle,
  anotherautodef,
  autostandardize,
  autocomplete,
  autoreplace,
  autolist
]

// 插件总开关，按显示的顺序
export const enum QuickSwitch {
  AnotherAutoTitle,
  AnotherAutoDef,
  AutoStandardize,
  AutoComplete,
  AutoReplace,
  AutoList
}

const more: ISection = {
  header: "More",
  rows: [
    {
      type: cellViewType.plainText,
      label: "如果 ohmymn 对你有所帮助，欢迎赞赏，点击\n即可直达二维码。",
      link: "https://cdn.jsdelivr.net/gh/ourongxing/ohmymn/assets/donate.gif"
    },
    {
      type: cellViewType.plainText,
      label:
        "ohmymn 完全开源，容易扩展，欢迎参与开发。\n点击直达 Github 查看源码，欢迎 star 和 fork。",
      link: "https://github.com/ourongxing/ohmymn"
    },
    {
      type: cellViewType.plainText,
      label:
        "点击加入飞书话题群，一起交流 ohmymn 使用\n技巧，我会不定期为大家解决疑问。",
      link: "https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=f82q9d4d-fbe2-4487-95ec-86b4a5374750"
    },
    {
      type: cellViewType.plainText,
      label: "\n\n\n\n\n",
      link: ""
    }
  ]
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
    //@ts-ignore
    rows.push(setting)
    if (
      setting.help &&
      setting.type != cellViewType.buttonWithInput &&
      setting.type != cellViewType.button
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
        link: setting.link ?? ""
      })
  }
  return {
    header: config.name,
    rows
  }
}

export const actionKey: string[] = []
export const addonList: string[] = []

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
    magicaction.settings = magicaction.actions
  }
  dataSource.unshift(genSection(magicaction))
  dataSource.forEach((sec, index) => {
    if (index > 2) addonList.push(sec.header)
  })

  // 更新 quickSwitch 为 addonList
  for (const row of dataSource[1].rows) {
    if (row.type == cellViewType.muiltSelect && row.key == "quickSwitch")
      row.option = addonList.map(
        (value, index) => "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"[index] + " " + value
      )
  }

  // 同步 gesture 的 option 为 magicaction 列表
  const gestureOption = dataSource[0].rows.map((row, index) =>
    row.type != cellViewType.plainText
      ? "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"[index - 1] + " " + row.label
      : "无"
  )
  dataSource[2].rows = dataSource[2].rows.map(row => {
    if (row.type == cellViewType.select) row.option = gestureOption
    return row
  })
  dataSource[0].rows.forEach(row =>
    actionKey.push(row.type != cellViewType.plainText ? row.key : "none")
  )

  dataSource.push(more)
  return dataSource
}

const genDataSourceIndex = (dataSource: Array<ISection>) => {
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
  for (const addon of addons) {
    Object.assign(actions, addon.action)
  }
  return actions
}

export const actions = mergeActions()
export const dataSource = genDataSource(
  [ohmymn, gesture, ...addons].map(addon => addon.config),
  magicaction.config
)
export const dataSourceIndex = genDataSourceIndex(dataSource)
