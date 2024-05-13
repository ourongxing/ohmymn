import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro: "补全单词词形，只支持动词和名词。顺便提供词义补充和上下文摘录。",
    on: "摘录时自动执行",
    loading: "正在制卡...",
    custom: "自定义",
    complete_word: {
      label: "补全单词词形"
    },
    select_meaning: {
      label: "动态选择释义",
      $option2: ["中文", "英文"] as StringTuple<2>
    },
    maybe_other_word:
      "检测到当前单词既可能是其他单词的变形，也可能就是原形，请选择单词原形",
    select_lemma: "动态选择单词原形",
    gen_word_card: {
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
      help: "目前不支持 OCR Pro，必须 PDF 自带文字层。     ",
      label: "自动摘录上下文"
    },
    collins: {
      label: "柯林斯星级筛选",
      $option6: ["无", "⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
      help: "星越多代表越常用，但也越简单，没有选中的星级单词会被排除，不会触发。"
    },
    fill_word_info: {
      label: "填充单词信息",
      $option3: ["不填充", "自定义", "中文释义"] as StringTuple<3>
    },
    data_source: {
      label: "数据来源",
      $option2: ["在线 API", "本地数据库"] as StringTuple<2>,
      help: "在国外的用户请选择本地数据库。可以在 OhMyMN 的 QQ 频道中下载。"
    },
    not_find_word: "查询不到该单词",
    forbid:
      "为减小服务器压力，禁止同时处理超过 5 张卡片。如果需要大量制卡，请使用本地数据库。",
    choose_meaning: "选择在文中的释义",
    not_find_db: {
      message:
        "没有找到 AutoComplete 数据库。请下载并导入名为 AutoCompleteData.zip 或者 AutoCompleteData.online.zip 的文件。",
      $options2: ["立即下载", "导入数据库"] as StringTuple<2>,
      wrong_file: "文件不符合要求，请不要导入错误文件或者修改文件名!",
      wait: "正在导入数据库，请稍后..."
    }
  },
  en: {
    intro: "Complete word form. Only support verbs and nouns.",
    on: "Auto Run When Excerpting",
    custom_fill:
      "Custom excerption filling template, click for support variables",
    custom_fill_front: {
      help: "Custom excerption filling template, click for support variables.",
      link: doc("autocomplete"),
      error: "The input bar is not allowed to use {{zh}} or {{en}}"
    },
    custom: "Custom",
    complete_word: {
      label: "Complete Word Form"
    },
    loading: "Loading...",
    select_lemma: "Dynamic Basic Form Selection",
    maybe_other_word:
      "The word may be the basic form or the inflected form, choose you want.",
    select_meaning: {
      label: "Dynamic Interpretation Selection",
      $option2: ["Chinese", "English"]
    },
    gen_word_card: {
      label: "Generate Word Card",
      $option2: ["Append", "Replace"]
    },
    auto_context: {
      label: "Auto Excert Context",
      help: "Currently not support OCR Pro, only PDF with text layer."
    },
    collins: {
      label: "Collins Star Filtering",
      $option6: ["None", "⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
      help: "The more stars, the more common, but also the simpler, the words without the selected star level will be excluded, and will not trigger."
    },
    fill_word_info: {
      label: "Fill in Word Info",
      $option3: ["Not Fill", "Custom", "Chinese Meaning"]
    },
    data_source: {
      label: "Data Source",
      $option2: ["Online API", "Local Database"],
      help: "For users outside of China, please choose local database. You can download it in Github Release."
    },
    not_find_word: "No matching words found",
    forbid:
      "To reduce server pressure, it is forbidden to process more than 5 cards at the same time. If you need to make a lot of word cards, please use the local database.",
    choose_meaning: "Select the meanings in the text.",
    not_find_db: {
      message:
        "AutoComplete database not found. Please download and import the file named AutoCompleteData.zip or AutoCompleteData.online.zip .",
      $options2: ["Download Now", "Import Database"],
      wrong_file:
        "The file does not meet the requirements. Please do not import the wrong file or modify the file name!",
      wait: "Importing database, please wait..."
    }
  }
})
