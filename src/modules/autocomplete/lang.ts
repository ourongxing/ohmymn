import { MN } from "~/const"

const zh = {
  intro: "补全单词词形，只支持动词和名词",
  link: "https://ohmymn.vercel.app/guide/modules/autocomplete.html",
  label: {
    on: "摘录时自动执行",
    fill_word_info: "填充单词信息",
    collins: "柯林斯星级筛选",
    data_source: "数据来源",
    translate_context: "翻译上下文",
    complete_selected: "补全单词词形",
    auto_context: "自动摘录上下文",
    select_meaning: "动态选择释义",
    complete_word: "英文单词制卡"
  },
  help: {
    custom_fill: "自定义单词填充信息（二）",
    custom_fill_front:
      "自定义单词填充信息（一），点击查看支持变量，当前输入栏不允许使用 {{zh}} 和 {{en}}。",
    data_source:
      "本地数据库体积较大，但更快，质量更高，需要下载本地数据库版本。",
    auto_context: "目前不支持 OCR Pro",
    translate_context: "请设置好 AutoTranslate 的翻译 API Key。",
    collinns: "星越多代表越常用，但也越简单，没有选中的星级单词会被排除。"
  },
  option: {
    fill_word_info: ["不填充", "自定义", "中文释义"],
    data_source: ["在线 API", "本地数据库"]
  },
  error: {
    not_find_word: "查询不到该单词",
    forbid:
      "为减小服务器压力，禁止同时处理超过 5 张卡片。如果需要大量制卡，请使用本地数据库。"
  },
  choose_meaning: "选择在文中的释义"
}

const en: typeof zh = {
  intro: "Complete word form. Only support verbs and nouns",
  link: "https://ohmymn.vercel.app/guide/modules/autocomplete.html",
  label: {
    on: "Auto Executed",
    fill_word_info: "Fill Word Info",
    complete_selected: "Complete Word Form",
    select_meaning: "Dynamic Select Meaning",
    collins: "Collins Star",
    data_source: "Data Source",
    translate_context: "Translate Context",
    auto_context: "Auto Excert Context",
    complete_word: "Make Word Cards"
  },
  help: {
    custom_fill:
      "Custom excerption filling template, click for support variables",
    custom_fill_front:
      "Custom excerption filling template, click for support variables",
    data_source: "Local databases are larger, but faster and of higher quality",
    auto_context: "OCR Pro is not currently supported",
    translate_context: "Set it up first with AutoTranslate",
    collinns: "The more stars, the more useful, but the simpler it is"
  },
  option: {
    fill_word_info: ["Not Fill", "Customize", "Chinese Meaning"],
    data_source: ["Online API", "Local Database"]
  },
  error: {
    not_find_word: "No matching words found",
    forbid:
      "To reduce server pressure, it is forbidden to process more than 5 cards at the same time. If you need to make a lot of word cards, please use the local database."
  },
  choose_meaning: "Select the meanings in the text."
}
export const lang = MN.isZH ? zh : en
