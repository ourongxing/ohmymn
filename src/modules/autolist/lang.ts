import { MN } from "~/addon"

const zh = {
  intro:
    "针对有序号的摘录，自动添加换行。所有预设均必须满足两个及以上，包括自定义",
  link: "https://ohmymn.vercel.app/guide/modules/autolist.html",
  option: {
    preset: ["自定义", "ABCD...", "一二三四...", "1234..."],
    list_selected: ["使用 AutoList 的配置", "确定"]
  },
  help: {
    custom_list: "自定义，点击查看具体格式"
  },
  label: {
    on: "摘录时自动执行",
    preset: "选择需要的预设",
    list_selected: "序列摘录换行"
  }
}

const en: typeof zh = {
  intro:
    "For text with serial number, auto add line breaks. All presets need to meet a minimum of two serial numbers",
  link: "https://ohmymn.vercel.app/guide/modules/autolist.html",
  option: {
    preset: ["Custom", "ABCD...", "一二三四...", "1234..."],
    list_selected: ["Use AutoList Settings", "Confirm"]
  },
  help: {
    custom_list: "Customize. Click for specific formats"
  },
  label: {
    on: "Auto Executed",
    preset: "Select Presets",
    list_selected: "Add Line Breaks"
  }
}
export const lang = MN.isZH ? zh : en
