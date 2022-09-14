import { Addon } from "~/addon"
import { MN } from "~/sdk"

const zh = {
  link: "https://ohmymn.marginnote.cn",
  intro: `当前版本：${Addon.version}`,
  profile: {
    $option5: [
      "配置 1",
      "配置 2",
      "配置 3",
      "配置 4",
      "初始化"
    ] as TupleString<5>,
    label: "选择全局配置",
    help: "【当前笔记本】不同场景，不同配置"
  },
  quick_switch: {
    label: "模块快捷开关"
  },
  panel_position: {
    $option6: [
      "文档侧",
      "文档脑图中间",
      "脑图侧",
      "靠左",
      "居中",
      "靠右"
    ] as TupleString<6>,
    label: "面板显示位置"
  },
  panel_height: {
    $option3: ["高点", "标准", "矮点"] as TupleString<3>,
    label: "面板显示高度"
  },
  panle_control: {
    $option3: [
      "双击图标打开面板",
      "双击面板关闭面板",
      "动作执行完关闭面板"
    ] as TupleString<3>,
    label: "面板显示控制"
  },
  has_title_then: {
    $option3: ["不转为标题", "合并标题", "覆盖标题"] as TupleString<3>,
    label: "如果标题存在",
    help: "【AutoTitle、AutoDef、AutoComplete】 \n卡片已有标题，此时拖拽文字合并进该卡片，如果会产生新标题，则"
  },
  remove_excerpt: {
    $option3: ["立即删除", "等会删除", "不删除"] as TupleString<3>,
    label: "转为标题后, 摘录将",
    help: "接上文"
  },
  lock_excerpt: {
    label: "锁定摘录文字"
  },
  auto_backup: {
    label: "自动备份配置",
    help: "MagicAction for Card -> 配置管理 -> 写入配置，写入后才能自动备份。"
  },
  backup_ID: {
    help: "输入备份卡片链接，请确保该卡片有子卡片，否则无法写入。子卡片越多越好。",
    not_link: "不是卡片链接",
    not_exit: "卡片不存在",
    no_child: "卡片没有子卡片"
  }
}

const en: typeof zh = {
  link: "https://www.notion.so/huangkewei/ohmymn-wiki-faea66243fb54149b9e7067f61142a9d",
  intro: `Current Version: ${Addon.version}`,
  profile: {
    $option5: [
      "Profile 1",
      "Profile 2",
      "Profile 3",
      "Profile 4",
      "Initialize"
    ],
    label: "Select Global Profile",
    help: "[Current Notebook] Different scenes, different profile"
  },
  quick_switch: {
    label: "Module Quick Switch"
  },
  panel_position: {
    $option6: [
      "Document Side",
      "Document Mind Map Center",
      "Mind Map Side",
      "Left",
      "Center",
      "Right"
    ],
    label: "Panel Position"
  },
  panel_height: {
    $option3: ["Tall", "Standard", "Short"],
    label: "Panel Height"
  },
  panle_control: {
    $option3: [
      "Double Click Icon to Open Panel",
      "Double Click Panel to Close Panel",
      "Close Panel After Action"
    ],
    label: "Panel Control"
  },
  has_title_then: {
    $option3: ["Not Convert to Title", "Merge Title", "Override Title"],
    label: "If Card Has Title",
    help: "[AutoTitle、AutoDef、AutoComplete] \nIf the card already has a title, drag the text to merge into the card. If a new title will be generated, then"
  },
  remove_excerpt: {
    $option3: ["Remove Immediately", "Remove Later", "Not Remove"],
    help: "Follow above",
    label: "After Convert to Title, Excerpt Will"
  },
  lock_excerpt: {
    label: "Lock Excerpt Text"
  },
  auto_backup: {
    label: "Auto Backup Profile",
    help: "MagicAction for Card -> Config Management -> Write Config, write it first to enable auto backup."
  },
  backup_ID: {
    help: "Enter the backup card link, please make sure that the card has subcards, otherwise it cannot be written. The more subcards, the better.",
    not_link: "Not a card url",
    not_exit: "Card does not exist",
    no_child: "Card has no subcards"
  }
}

export const lang = MN.isZH ? zh : en
