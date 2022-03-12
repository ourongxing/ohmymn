import { MN } from "const"

const zh = {
  link: "https://busiyi.notion.site/Gesture-468bbb3eca424c3bb85842e0b26138b8",
  option: {
    profile: "配置",
    has_title_then: ["保持原样", "标题链接", "覆盖标题"],
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
    panle_control: "面板开启关闭",
    screen_always_on: "保持屏幕常亮",
    lock_excerpt: "锁定摘录文字",
    auto_correct: "开启自动在线矫正了吗"
  },
  help: {
    profile: "【当前文档生效】不同情景，不同配置",
    has_title_then: "拖拽选区合并进卡片，如果会产生新标题，则",
    auto_correct: "【当前文档生效】务必和 MN 保持相同状态"
  }
}

const en: typeof zh = {
  link: "https://www.notion.so/huangkewei/ohmymn-wiki-faea66243fb54149b9e7067f61142a9d",
  option: {
    profile: "Profile",
    has_title_then: ["Keep Intact", "As Title Link Style", "Override"],
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
    auto_correct: "Is Auto-Correct Enabled?"
  },
  help: {
    profile:
      "[Current Document Takes Effect]\nDifferent scenes, different profile",
    has_title_then:
      "Drag and drop the selection to merge into the card, and if a new title will be created by ohmymn, then",
    auto_correct:
      "[Current Document Takes Effect]\nBe sure to keep the same status as MN"
  }
}

export const lang = MN.isZH ? zh : en
