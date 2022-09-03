import { Addon } from "~/addon"

const zh = {
  intro: "搜索和复制你想要的",
  link: "https://ohmymn.vercel.app/guide/modules/copysearch.html",
  lable: {
    multiple_titles: "如果有多个标题",
    multiple_excerpts: "如果有多个摘录",
    custom_copy: "自定义搜索或复制的内容，点击查看支持哪些变量。",
    search_card_info: "搜索卡片内容",
    which_partof_card: "默认搜索卡片内容",
    copy_card_info: "复制卡片内容",
    separator_symbols_multiple_card: "分隔符",
    show_search_engine: "显示/隐藏搜索 URL",
    search_text: "搜索选中文字"
  },
  option: {
    which_partof_card: ["动态选择", "优先标题", "优先摘录", "自定义"],
    multiple_titles: ["动态选择", "所有标题", "第一个"],
    multiple_excerpts: ["动态选择", "所有摘录", "第一个"],
    muiltple_cards: ["标题", "摘录", "自定义"],
    search_engine: ["中文", "英文", "词典", "翻译", "学术", "问题", "其他"]
  },
  help: {
    show_search_engine: "点击查看如何自定义 URL。",
    separator_symbols_multiple_card: "选中多张卡片时，用来隔开每张卡片的内容",
    which_partof_card:
      "若优先的内容为空，则按照标题 > 摘录 > 自定义的顺序递推。选中多张卡片时递推无效。"
  },
  hud: {
    not_get_title: "没有获取到标题",
    not_get_excerpt: "没有获取到摘录，你看到的可能是评论",
    choose_search_engine: "本次使用哪一个搜索引擎",
    copy_seccess: "复制成功，快去粘贴吧",
    one_card_search: "默认搜索第一张卡片的内容，请不要选择多张卡片",
    no_search_engine_url: "没有填写此搜索引擎的 URL",
    no_keyword: "没有输入 {{keyword}}"
  },
  choose_you_want: `请选择一个你想要的`
}
const en: typeof zh = {
  intro: "Copy and search for what you want",
  link: "https://www.notion.so/huangkewei/CopySearch-c824347a82c543569acc3d01053cd227",
  lable: {
    search_text: "Search for Selected Text",
    which_partof_card: "Default Part of Card",
    multiple_titles: "If Multiple Titles",
    multiple_excerpts: "If Multiple Excerpts",
    custom_copy:
      "Customize what you search or copy, click to see which variables are supported",
    search_card_info: "Search Card Content",
    separator_symbols_multiple_card: "Separator Symbols",
    copy_card_info: "Copy Card Content",
    show_search_engine: "Show/Hide Search URL"
  },
  option: {
    which_partof_card: [
      "Instant Select",
      "Title First",
      "Excerpt First",
      "Custom First"
    ],
    multiple_titles: ["All", "First", "Instant Select"],
    multiple_excerpts: ["All", "First", "Instant Select"],
    muiltple_cards: ["Title", "Excerpt", "Custom"],
    search_engine: [
      "Chinese",
      "English",
      "Dict",
      "Translation",
      "Academic",
      "Question",
      "Other"
    ]
  },
  help: {
    which_partof_card:
      "If the first content is empty, it will get the content in the order of Title > Excerpt > Custom. Not valid when multiple cards are selected",
    show_search_engine: "Click to see how to customize the URL",
    separator_symbols_multiple_card:
      "When multiple cards are selected, it is used to separate the contents of each card"
  },
  hud: {
    not_get_title: "No title found",
    not_get_excerpt: "No excerpt text found. What you see may be comments",
    choose_search_engine: "Which search engine to use this time",
    copy_seccess: "Copy successfully, go ahead and paste",
    one_card_search:
      "Default search the content of the first card, please do not select more than one card",
    no_search_engine_url: "No URL of this search engine",
    no_keyword: "No {{keyword}}"
  },
  choose_you_want: "Choose one you want"
}

export const lang = Addon.isZH ? zh : en
