import { MN } from "~/marginnote/sdk"

const zh = {
  intro:
    "【仅 iPad 可用】使用手势来触发 MagicAction 中的动作。该功能完全由 OhMyMN 提供，与 MN 无关。点击查看手势监测区域及注意事项。",
  singleBar: "卡片单选工具栏",
  muiltBar: "卡片多选工具栏",
  selectionBar: "文字选择工具栏",
  action_not_work: "模块未启用，该动作无法执行"
}

const en: typeof zh = {
  intro:
    "【iPad only】Trigger MagicAction by gesture. This feature is provided by OhMyMN, not MarginNote. Click to view the gesture detection area and precautions.",
  singleBar: "Single Select Toolbar",
  muiltBar: "Multi Select Toolbar",
  selectionBar: "Text Select Toolbar",
  action_not_work: "Module is not enabled, the action cannot be executed"
}

export const lang = MN.isZH ? zh : en
