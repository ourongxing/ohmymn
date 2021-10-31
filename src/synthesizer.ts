import * as anotherautotitle from "addons/anotherautotitle"
import * as autocomplete from "addons/autocomplete"
import * as autolist from "addons/autolist"
import * as autoreplace from "addons/autoreplace"
import * as autostandardize from "addons/autostandardize"
import * as magicaction from "addons/magicaction"
import * as anotherautodef from "addons/anotherautodef"
import * as ohmymn from "addons/ohmymn"

// 不要包含 magication，顺序为显示的顺序，magiction 始终为第1个
const addons = [
  ohmymn,
  anotherautotitle,
  anotherautodef,
  autostandardize,
  autocomplete,
  autoreplace,
  autolist
]

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
        const val1 = a.label.length
        const val2 = b.label.length
        return val1 - val2
      }
    )
  }
  dataSource.unshift(genSection(magicaction))
  const about: ISection = {
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
          "欢迎加入飞书话题群，一起交流 ohmymn 使用\n技巧，我不定期为大家解决疑问。",
        link: "https://applink.feishu.cn/client/chat/chatter/add_by_link?link_token=f82q9d4d-fbe2-4487-95ec-86b4a5374750"
      },
      {
        type: cellViewType.plainText,
        label: "祝考研的各位同学成功上岸，本次更新后在考研\n结束前将不再更新。",
        link: ""
      },
      {
        type: cellViewType.plainText,
        label: "考研倒计时：",
        link: ""
      },
      {
        type: cellViewType.plainText,
        label: "\n\n\n\n\n",
        link: ""
      }
    ]
  }
  dataSource.push(about)
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
    if (name != "magicaction") {
      dataSourceIndex[name] = {}
      section.rows.forEach((row, rowIndex) => {
        switch (row.type) {
          case cellViewType.input:
          case cellViewType.switch:
          case cellViewType.select:
          case cellViewType.inlineInput:
          case cellViewType.muiltSelect:
            dataSourceIndex[name][row.key] = [secIndex, rowIndex]
        }
      })
    }
  })
  return dataSourceIndex
}

const genActionsUtils = () => {
  const actions = { ...magicaction.action }
  for (const addon of addons) {
    Object.assign(actions, addon.action)
  }
  return actions
}

export const actions = genActionsUtils()
export const dataSource = genDataSource(
  addons.map(addon => addon.config),
  magicaction.config
)
export const dataSourceIndex = genDataSourceIndex(dataSource)
