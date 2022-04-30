import { MN } from "@/const"

const zh = {
  intro: "补全单词词形，只支持动词和名词",
  link: "https://busiyi.notion.site/AutoComplete-1eab78ee6d7648339e088c593326b5ca",
  label: {
    on: "摘录时自动执行",
    fill_word_info: "填充单词信息",
    complete_selected: "补全单词词形",
    select_meaning: "动态选择含义"
  },
  help: {
    custom_fill: "自定义单词填充信息，点击查看支持变量"
  },
  option: {
    fill_word_info: ["不填充", "自定义", "中文含义"]
  },
  error: {
    not_find_word: "查询不到该单词",
    forbid: "为减小服务器压力，禁止同时处理超过 5 张卡片"
  },
  choose_meaning: "选择在文中的含义"
}

const en: typeof zh = {
  intro: "Complete word form. Only support verbs and nouns",
  link: "https://www.notion.so/huangkewei/AutoComplete-3b9b27baef8f414cb86c454a6128b608", //Todo:修改英文版Notion
  label: {
    on: "Auto Executed",
    fill_word_info: "Fill Word Info",
    complete_selected: "Complete Word Form",
    select_meaning: "Dynamic Select Meaning"
  },
  help: {
    custom_fill:
      "Custom excerption filling template, click for  support variables"
  },
  option: {
    fill_word_info: ["None", "Custom", "Chinese"]
  },
  error: {
    not_find_word: "No matching words found",
    forbid:
      "To reduce server pressure, it is forbidden to process more than 5 cards at the same time"
  },
  choose_meaning: "Select the meaning in the text."
}
export const lang = MN.isZH ? zh : en
