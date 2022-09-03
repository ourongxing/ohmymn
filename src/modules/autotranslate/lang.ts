import { MN } from "~/sdk"

const zh = {
  intro: "自动替换摘录中的某些错误",
  link: "https://ohmymn.vercel.app/guide/modules/autotranslate.html",
  option: {
    preset: ["自定义"],
    replace_selected: ["使用 AutoReplace 的配置", "确定"]
  },
  help: {
    custom_replace: "自定义，点击查看具体格式"
  },
  label: {
    on: "摘录时自动执行",
    preset: "选择需要的预设",
    replace_selected: "替换摘录文字"
  }
}

const en: typeof zh = {
  intro: "Automatically replace errors in excerpts",
  link: "https://www.notion.so/huangkewei/AutoReplace-1cf1399ed90e4fc7a3e16843d37f2a56", //Todo:修改英文版Notion
  option: {
    preset: ["Custom"],
    replace_selected: ["Use AutoReplace Settings", "Confirm"]
  },
  help: {
    custom_replace: "Customize. Click for specific formats"
  },
  label: {
    on: "Auto Executed",
    preset: "Select Presets",
    replace_selected: "Replace Excerptions"
  }
}
export const lang = MN.isZH ? zh : en
