import { MN } from "~/sdk"

const zh = {
  intro: "自动添加标签",
  link: "https://ohmymn.marginnote.cn/guide/modules/autotag.html",
  on: "摘录时自动执行",
  preset: {
    label: "选择需要的预设",
    $option1: ["自定义"]
  },
  add_tag: {
    label: "添加标签",
    $option2: ["使用 AutoTag 的设置", "确定"]
  },
  custom_tag: {
    link: "",
    help: "自定义，点击查看具体格式"
  }
}

const en: typeof zh = {
  intro: "Auto Add Tags",
  link: "https://ohmymn.marginnote.cn/guide/modules/autotag.html",
  on: "Auto Executed",
  preset: {
    label: "Select Presets",
    $option1: ["Custom"]
  },
  add_tag: {
    label: "Add Tags",
    $option2: ["Use AutoTag Settings", "Confirm"]
  },
  custom_tag: {
    link: "",
    help: "Customize. Click for specific formats"
  }
}

export const lang = MN.isZH ? zh : en
