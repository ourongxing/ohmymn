import { MN } from "~/sdk"
import { doc } from "~/utils"

const zh = {
  intro: "补全单词词形，只支持动词和名词",
  on: "摘录时自动执行",
  complete_selected: "补全单词词形",
  select_meaning: {
    label: "动态选择释义",
    $option2: ["中文", "英文"] as StringTuple<2>
  },
  select_lemma: "动态选择单词原形",
  complete_word: {
    label: "英文单词制卡",
    $option2: ["追加", "替换"] as StringTuple<2>
  },
  custom_fill: "自定义单词填充信息（二）",
  custom_fill_front: {
    help: "自定义单词填充信息（一），点击查看支持变量，当前输入栏不允许使用 {{zh}} 和 {{en}}。",
    link: doc("autocomplete"),
    error: "当前输入栏不允许使用 {{zh}} 或 {{en}}"
  },
  auto_context: {
    help: "目前不支持 OCR Pro",
    label: "自动摘录上下文"
  },
  translate_context: {
    label: "翻译上下文",
    help: "请设置好 AutoTranslate 的翻译 API Key。"
  },
  collins: {
    label: "柯林斯星级筛选",
    $option6: ["零", "一", "二", "三", "四", "五"],
    help: "星越多代表越常用，但也越简单，没有选中的星级单词会被排除。"
  },
  fill_word_info: {
    label: "填充单词信息",
    $option3: ["不填充", "自定义", "中文释义"] as StringTuple<3>
  },
  data_source: {
    label: "数据来源",
    $option2: ["在线 API", "本地数据库"] as StringTuple<2>,
    help: "本地数据库体积较大，但更快，质量更高，需要下载本地数据库版本。"
  },
  not_find_word: "查询不到该单词",
  forbid:
    "为减小服务器压力，禁止同时处理超过 5 张卡片。如果需要大量制卡，请使用本地数据库。",
  choose_meaning: "选择在文中的释义"
}

const en: typeof zh = {
  intro: "Complete word form. Only support verbs and nouns",
  on: "Auto Executed",
  custom_fill:
    "Custom excerption filling template, click for support variables",
  custom_fill_front: {
    help: "Custom excerption filling template, click for support variables",
    link: doc("autocomplete"),
    error: "The input bar is not allowed to use {{zh}} or {{en}}"
  },
  complete_selected: "Complete Word Form",
  select_lemma: "Dynamic Select Word Lemma",
  select_meaning: {
    label: "Dynamic Select Meaning",
    $option2: ["Chinese", "English"]
  },
  complete_word: {
    label: "English Word Card",
    $option2: ["Append", "Replace"]
  },
  translate_context: {
    label: "Translate Context",
    help: "Set it up first with AutoTranslate"
  },
  auto_context: {
    label: "Auto Excert Context",
    help: "OCR Pro is not currently supported"
  },
  collins: {
    label: "Collins Star",
    $option6: ["Zero", "One", "Two", "Three", "Four", "Five"],
    help: "The more stars, the more useful, but the simpler it is"
  },
  fill_word_info: {
    label: "Fill Word Info",
    $option3: ["Not Fill", "Customize", "Chinese Meaning"]
  },
  data_source: {
    label: "Data Source",
    $option2: ["Online API", "Local Database"],
    help: "Local databases are larger, but faster and of higher quality"
  },
  not_find_word: "No matching words found",
  forbid:
    "To reduce server pressure, it is forbidden to process more than 5 cards at the same time. If you need to make a lot of word cards, please use the local database.",
  choose_meaning: "Select the meanings in the text."
}

export const lang = MN.isZH ? zh : en
