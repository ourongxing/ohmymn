import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro: "搜索和复制你想要的。",
    which_partof_card: {
      label: "默认搜索卡片内容",
      $option4: [
        "动态选择",
        "优先标题",
        "优先摘录",
        "自定义"
      ] as StringTuple<4>,
      help: "若优先的内容为空，则按照标题 > 摘录 > 自定义的顺序递推。选中多张卡片时递推无效。"
    },
    multiple_titles: {
      label: "> 如果有多个标题",
      $option3: ["动态选择", "所有标题", "第一个"] as StringTuple<3>
    },
    multiple_excerpts: {
      label: "> 如果有多个摘录",
      $option3: ["动态选择", "所有摘录", "第一个"] as StringTuple<3>
    },
    muiltple_cards: {
      $option3: ["标题", "摘录", "自定义"] as StringTuple<3>
    },
    show_search_engine: {
      help: "点击查看如何自定义 URL。",
      $label2: [
        "点击展开所有搜索引擎",
        "点击收起所有搜索引擎"
      ] as StringTuple<2>,
      link: doc("copysearch", "搜索-url")
    },
    modify_symbols: {
      help: "选中多张卡片时，为每张卡片的内容添加前后修饰，默认添加序号和换行（$&代表每一段），点击查看自定义方法。",
      link: doc("copysearch", "多张卡片")
    },
    $search_engine7: [
      "中文",
      "英文",
      "词典",
      "翻译",
      "学术",
      "问题",
      "其他"
    ] as StringTuple<7>,
    custom_copy: {
      link: doc("copysearch", "自定义"),
      help: "自定义复制的内容，点击查看支持哪些变量。"
    },
    custom_search: {
      link: doc("copysearch", "自定义"),
      help: "自定义搜索的内容，点击查看支持哪些变量。"
    },
    search_card_info: "搜索卡片内容",
    copy_card_info: "复制卡片内容",
    search_text: "搜索选中文字",
    not_get_title: "没有获取到标题",
    not_get_excerpt: "没有获取到摘录，你看到的可能是评论",
    choose_search_engine: "本次使用哪一个搜索引擎",
    copy_seccess: "复制成功，快去粘贴吧",
    one_card_search: "默认搜索第一张卡片的内容，请不要选择多张卡片",
    no_search_engine_url: "没有填写此搜索引擎的 URL",
    no_keyword: "缺少 {{keyword}}",
    choose_you_want: `请选择一个你想要的`
  },
  en: {
    intro: "Copy and search for what you want.",
    which_partof_card: {
      label: "Default Content To Search",
      $option4: ["Dynamic Selection", "Title First", "Excerpt First", "Custom"],
      help: "If the first content is empty, it will get the content in the order of Title > Excerpt > Custom. Not valid when multiple cards are selected"
    },
    multiple_titles: {
      label: "> If Multiple Titles",
      $option3: ["All", "First", "Dynamic Selection"]
    },
    multiple_excerpts: {
      label: "> If Multiple Excerpts",
      $option3: ["All", "First", "Dynamic Selection"]
    },
    muiltple_cards: {
      $option3: ["Title", "Excerpt", "Custom"]
    },
    search_card_info: "Search Card Content",
    copy_card_info: "Copy Card Content",
    search_text: "Search Selected Text",
    $search_engine7: [
      "Chinese",
      "English",
      "Dict",
      "Translation",
      "Academic",
      "Question",
      "Other"
    ],
    show_search_engine: {
      help: "Click to see how to customize the URL",
      $label2: ["Show All Search Engines", "Hide All Search Engines"],
      link: doc("copysearch", "search-url")
    },
    modify_symbols: {
      help: "Add prefix and suffix to the content of each card when multiple cards are selected, and add a number and a newline by default ($& represents each paragraph). Click to see how to customize it.",
      link: doc("copysearch", "multiple-cards")
    },
    custom_copy: {
      link: doc("copysearch", "custom"),
      help: "Customize what you copy, click to see which variables are supported"
    },
    custom_search: {
      link: doc("copysearch", "custom"),
      help: "Customize what you search, click to see which variables are supported"
    },
    not_get_title: "No title found",
    not_get_excerpt: "No excerpt text found. What you see may be comments",
    choose_search_engine: "Which search engine to use this time",
    copy_seccess: "Copy successfully, go ahead and paste",
    one_card_search:
      "Default search the content of the first card, please do not select more than one card",
    no_search_engine_url: "No URL of this search engine",
    no_keyword: "Missing {{keyword}}",
    choose_you_want: "Choose one you want"
  }
})
