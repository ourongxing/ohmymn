import { MN } from "marginnote"
import { doc } from "~/utils"

const zh = {
  intro: "自动替换摘录中的某些错误",
  on: "摘录时自动执行",
  preset: {
    label: "选择需要的预设",
    $option1: ["自定义"] as StringTuple<1>
  },
  replace_selected: {
    label: "替换摘录文字",
    $option2: ["使用 AutoReplace 的设置", "确定"] as StringTuple<2>
  },
  custom_replace: {
    link: doc("autoreplace"),
    help: "自定义，点击查看具体格式"
  }
}

const en: typeof zh = {
  intro: "Automatically replace errors in excerpts",
  on: "Auto Executed",
  preset: {
    label: "Select Presets",
    $option1: ["Custom"]
  },
  replace_selected: {
    $option2: ["Use AutoReplace Settings", "Confirm"],
    label: "Replace Excerpt Text"
  },
  custom_replace: {
    link: doc("autoreplace"),
    help: "Customize. Click for specific formats"
  }
}

export const lang = MN.isZH ? zh : en
