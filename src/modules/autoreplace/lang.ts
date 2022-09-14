import { MN } from "~/sdk"

const zh = {
  intro: "自动替换摘录中的某些错误",
  link: "https://ohmymn.marginnote.cn/guide/modules/autoreplace.html",
  on: "摘录时自动执行",
  preset: {
    label: "选择需要的预设",
    $option1: ["自定义"] as TupleString<1>
  },
  replace_selected: {
    label: "替换摘录文字",
    $option2: ["使用 AutoReplace 的设置", "确定"] as TupleString<2>
  },
  custom_replace: {
    link: "",
    help: "自定义，点击查看具体格式"
  }
}

const en: typeof zh = {
  intro: "Automatically replace errors in excerpts",
  link: "https://ohmymn.marginnote.cn/guide/modules/autoreplace.html",
  on: "Auto Executed",
  preset: {
    label: "Select Presets",
    $option1: ["Custom"]
  },
  replace_selected: {
    $option2: ["Use AutoReplace Settings", "Confirm"],
    label: "Replace Excerptions"
  },
  custom_replace: {
    link: "",
    help: "Customize. Click for specific formats"
  }
}

export const lang = MN.isZH ? zh : en
