import { MN } from "~/sdk"

const zh = {
  link: "https://ohmymn.marginnote.cn",
  intro: "当前版本：",
  option: {
    profile: ["配置 1", "配置 2", "配置 3", "配置 4", "初始化"],
    has_title_then: ["不转为标题", "合并标题", "覆盖标题"],
    panel_position: ["自动", "靠左", "居中", "靠右"],
    panel_height: ["高点", "标准", "矮点"],
    remove_excerpt: ["立即删除", "等会删除", "不删除"],
    panle_control: [
      "双击图标打开面板",
      "双击面板关闭面板",
      "动作执行完关闭面板"
    ]
  },
  label: {
    has_title_then: "如果标题存在",
    quick_switch: "模块快捷开关",
    profile: "选择全局配置",
    remove_excerpt: "转为标题后, 摘录将",
    panel_position: "面板显示位置",
    panel_height: "面板显示高度",
    panle_control: "面板开关控制",
    screen_always_on: "保持屏幕常亮",
    lock_excerpt: "锁定摘录文字",
    auto_backup: "自动备份配置"
  },
  help: {
    profile: "【当前笔记本】不同场景，不同配置",
    auto_backup:
      "MagicAction for Card -> 配置管理 -> 写入配置，写入后才能自动备份。",
    has_title_then:
      "【AutoTitle、AutoDef、AutoComplete】 \n卡片已有标题，此时拖拽文字合并进该卡片，如果会产生新标题，则"
  }
}

const en: typeof zh = {
  link: "https://www.notion.so/huangkewei/ohmymn-wiki-faea66243fb54149b9e7067f61142a9d",
  intro: "Current Version: ",
  option: {
    profile: ["Profile 1", "Profile 2", "Profile 3", "Profile 4", "Initialize"],
    remove_excerpt: ["Remove Now", "Remove Later", "Not Remove"],
    has_title_then: ["Keep Intact", "Merge", "Override"],
    panel_position: ["Auto", "Left", "Center", "Right"],
    panel_height: ["Higher", "Standard", "Lower"],
    panle_control: [
      "Double Click Logo to Open",
      "Double Click Panel to Close",
      "Close Panel After Action"
    ]
  },
  label: {
    has_title_then: "If Title Exists",
    quick_switch: "Quick Switch",
    profile: "Choose Profile",
    remove_excerpt: "After Merge, Excerpt",
    panel_position: "Panel Position",
    panel_height: "Panel Height",
    panle_control: "Panel Open and Close",
    screen_always_on: "Keep Screen Always On",
    lock_excerpt: "Lock Excerpt Text",
    auto_backup: "Auto Backup Profile"
  },
  help: {
    profile: "[Current Notebook] Different scenes, different profile",
    auto_backup:
      "First you need to do, MagicAction for Card —> Manage Profile -> Write Profile",
    has_title_then:
      "Drag and drop the selection to merge into the card, and if a new title will be created by ohmymn, then"
  }
}

export const lang = MN.isZH ? zh : en
