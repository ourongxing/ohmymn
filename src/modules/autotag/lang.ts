import { MN } from "const"

const zh = {
  intro: "自动加标签",
  link: "https://busiyi.notion.site/AutoTag-3a7fc5e0b84e47d18366d4cb60c4943d",
  option: {
    preset: ["自定义"],
    tag_selected: ["使用 AutoTag 的配置", "确定"]
  },
  label: {
    on: "摘录时自动执行",
    preset: "选择需要的预设",
    custom_tag: "自定义，点击查看具体格式",
    tag_selected: "给卡片加标签"
  }
}

const en: typeof zh = {
  intro: "Auto Add Tags",
  link: "https://www.notion.so/huangkewei/AutoTag-9e0bb2106d984ded8c29e781b53a1c23",
  option: {
    preset: ["Custom"],
    tag_selected: ["Use AutoTag Configuration", "Confirm"]
  },
  label: {
    on: "Auto Executed",
    preset: "Select Presets",
    custom_tag: "Customize. Click for specific formats",
    tag_selected: "Tag Cards"
  }
}

export const lang = MN.isZH ? zh : en
