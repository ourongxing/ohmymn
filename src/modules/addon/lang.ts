import { MN } from "@/const"

const zh = {
  link: "https://busiyi.notion.site/Gesture-468bbb3eca424c3bb85842e0b26138b8",
  option: {
    profile: "配置",
    initialize: "初始化",
    has_title_then: ["保持原样", "合并标题", "覆盖标题"],
    panel_position: ["自动", "靠左", "居中", "靠右"],
    panel_height: ["高点", "标准", "矮点"],
    panle_control: [
      "双击图标打开面板",
      "双击面板关闭面板",
      "动作执行完关闭面板"
    ]
  },
  label: {
    has_title_then: "如果标题存在",
    quick_switch: "模块快捷开关",
    profile: "选择配置文件",
    panel_position: "面板显示位置",
    panel_height: "面板显示高度",
    panle_control: "面板开关控制",
    screen_always_on: "保持屏幕常亮",
    lock_excerpt: "锁定摘录文字",
    auto_backup: "自动备份配置",
    page_offset: "页码偏移量"
  },
  help: {
    page_offset: "【当前文档生效】",
    profile: "【当前文档生效】不同场景，不同配置。",
    auto_backup: "首先你需要，MagicAction for Card -> 配置管理 -> 写入配置",
    has_title_then: "拖拽选区合并进卡片，如果会产生新标题，则"
  }
}

const en: typeof zh = {
  link: "https://www.notion.so/huangkewei/ohmymn-wiki-faea66243fb54149b9e7067f61142a9d",
  option: {
    profile: "Profile",
    initialize: "Initialize",
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
    panel_position: "Panel Position",
    panel_height: "Panel Height",
    panle_control: "Panel Open and Close",
    screen_always_on: "Keep Screen Always On",
    lock_excerpt: "Lock Excerpt Text",
    auto_backup: "Auto Backup Profile",
    page_offset: "Page Offset"
  },
  help: {
    page_offset: "[Current Doc Takes Effect]",
    profile: "[Current Doc Takes Effect] Different scenes, different profile",
    auto_backup:
      "First you need to do, MagicAction for Card —> Manage Profile -> Write Profile",
    has_title_then:
      "Drag and drop the selection to merge into the card, and if a new title will be created by ohmymn, then"
  }
}

export const lang = MN.isZH ? zh : en
