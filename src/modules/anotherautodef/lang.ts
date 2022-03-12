import { MN } from "const"

const zh = {
  intro:
    "提取被定义项或任意内容为标题或标题链接\n定义 = 被定义项 + 定义联项 + 定义项",
  link: "https://busiyi.notion.site/AnotherAutoDef-13910b3b225743dcb72b29eabcc81e22",
  label: {
    on: "摘录时自动执行",
    only_desc: "摘录仅保留定义项",
    to_title_link: "别名转为标题链接",
    preset: "选择需要的预设",
    title_link_split: "选择别名分词",
    custom_title_split: "自定义别名分词，点击查看具体格式",
    custom_def_link: "自定义定义联项，点击查看具体格式",
    custom_extract_title: "自定义提取标题，点击查看具体格式",
    extract_title: "从摘录提取标题"
  },
  option: {
    title_link_split: ["自定义", "默认", "标点符号"],
    preset: [
      "自定义提取标题",
      "自定义定义联项",
      "xxx : yyy",
      "xxx —— yyy",
      "xxx ，是(指) yyy",
      "xxx 是(指)，yyy",
      "xxx 是指 yyy",
      "yyy，___称(之)为 xxx",
      "yyy(被)称(之)为 xxx"
    ],
    extract_title: ["使用 AutoDef 中的配置", "确定"]
  }
}

const en: typeof zh = {
  intro:
    "Extract the defined terms and any other content as title or title link\nDefinition = Defined Term + Connective of Definition + Definiens\n", //Question:有待商议
  link: "https://huangkewei.notion.site/AnotherAutoDef-1852d4876891455681a90864ea35c828", //Todo:修改英文版Notion
  label: {
    on: "Auto Executed",
    only_desc: "Only Keep Definiens",
    to_title_link: "Convert Alias To Title Link",
    custom_title_split:
      "Customize alias participle, click for  specific format",
    title_link_split: "Select Alias Participle",
    preset: "Select Presets",
    custom_def_link:
      "Customize connective of definition, click for  the specific format",
    custom_extract_title: "Customize extract title, click for  specific format",
    extract_title: "Extract Title From Excerpt"
  },
  option: {
    title_link_split: ["Custom", "Default", "Punctuation"],
    preset: [
      "Custom Extract Title",
      "Custom Connective of Definition",
      "xxx : yyy",
      "xxx —— yyy",
      "xxx ，是(指) yyy",
      "xxx 是(指)，yyy",
      "xxx 是指 yyy",
      "yyy，___称(之)为 xxx",
      "yyy(被)称(之)为 xxx"
    ],
    extract_title: ["Use AutoDef Configuration", "Confirm"]
  }
}
export const lang = MN.isZH ? zh : en
