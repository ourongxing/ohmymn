import { MN } from "const"

const zh = {
  intro: "自定义手势触发动作",
  link: "https://busiyi.notion.site/Gesture-468bbb3eca424c3bb85842e0b26138b8",
  singleBar: "单选工具栏",
  muiltBar: "多选工具栏",
  selectionBar: "文本选择工具栏"
}

const en: typeof zh = {
  intro: "Custom Gestures to Trigger Actions",
  link: "https://www.notion.so/huangkewei/Gesture-2d43552645f3433da3c9beece0990f73",
  singleBar: "Single-select Toolbar",
  muiltBar: "Multi-select Toolbar",
  selectionBar: "Text-select Toolbar"
}

export const lang = MN.isZH ? zh : en
