import { MN } from "@/const"

const zh = {
  intro: "优化摘录和标题的排版与格式",
  link: "https://busiyi.notion.site/AutoStandrize-b5e0d381d4814139a1b73d305ebc12d1",
  option: {
    preset: [
      "自定义",
      "去除全部空格",
      "半角转全角",
      "中英文加空格",
      "去除中文间空格",
      "去除重复空格"
    ],
    format_selected: ["标题和摘录", "仅标题", "仅摘录"]
  },
  help: {
    custom_format: "自定义，点击查看具体格式",
    format_title: "涉及到首字母大写，点击查看具体规范"
  },
  label: {
    on: "摘录时自动执行",
    format_selected: "优化排版格式",
    format_title: "英文标题规范化",
    preset: "选择需要的预设"
  }
}

const en: typeof zh = {
  intro: "Optimize the typography and formatting of excerpts & titles",
  link: "https://www.notion.so/huangkewei/AutoStandrize-ec4986eff67744d4b2a045a283267b99",
  option: {
    preset: [
      "Custom",
      "Delete All Spaces",
      "Half Width To Double Width",
      "Add Space Between Chinese&English", // Todo: 是否需要修改
      "Remove Multiple Spaces"
    ],
    format_selected: [
      "Optimize All",
      "Only Optimize Title",
      "Only Optimize Excerption"
    ]
  },
  help: {
    custom_format: "Customize. Click for specific formats",
    format_title: "Click for  specific specifications"
  },
  label: {
    on: "Auto Executed",
    format_selected: "Optimize Typography",
    format_title: " Normalize English Title",
    preset: "Select Presets"
  }
}
export const lang = MN.isZH ? zh : en
