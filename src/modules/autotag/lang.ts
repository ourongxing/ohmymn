import { MN } from "@/const"

const zh = {
  intro: "自动添加标签",
  link: "https://busiyi.notion.site/AutoTag-3a7fc5e0b84e47d18366d4cb60c4943d",
  option: {
    preset: ["自定义"],
    add_tag: ["使用 AutoTag 的配置", "确定"]
  },
  help: {
    custom_tag: "自定义，点击查看具体格式"
  },
  label: {
    on: "摘录时自动执行",
    preset: "选择需要的预设",
    add_tag: "添加标签"
  }
}

const en: typeof zh = {
  intro: "Auto Add Tags",
  link: "https://www.notion.so/huangkewei/AutoTag-9e0bb2106d984ded8c29e781b53a1c23",
  option: {
    preset: ["Custom"],
    add_tag: ["Use AutoTag Settings", "Confirm"]
  },
  help: {
    custom_tag: "Customize. Click for specific formats"
  },
  label: {
    on: "Auto Executed",
    preset: "Select Presets",
    add_tag: "Add Tags"
  }
}

export const lang = MN.isZH ? zh : en
