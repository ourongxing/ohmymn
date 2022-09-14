import { MN } from "~/sdk"

const zh = {
  intro: "使用百度 OCR 服务来进行小语种的在线矫正。",
  link: "https://ohmymn.marginnote.cn/guide/modules/autoocr.html",
  on: {
    label: "摘录时自动执行",
    help: "【当前文档】"
  },
  lang: {
    $option20: [
      "自动检测",
      "中英文混合",
      "英文",
      "日语",
      "韩语",
      "法语",
      "西班牙语",
      "葡萄牙语",
      "德语",
      "意大利语",
      "俄语",
      "丹麦语",
      "荷兰语",
      "马来语",
      "瑞典语",
      "印尼语",
      "波兰语",
      "罗马尼亚语",
      "土耳其语",
      "希腊语",
      "匈牙利语"
    ],
    help: "【当前文档】",
    label: "识别语言"
  },
  formula_ocr: {
    label: "公式识别",
    $option3: ["Pure Latex", "$ Latex $", "$$ Latex $$"],
    help: `"Markdown" 插件请选择 Pure Latex`
  },
  formula_ocr_providers: {
    label: "公式识别提供商",
    $option2: ["百度", "Mathpix"],
    help: "公式识别不支持摘录时自动识别，只能在 MagicAtion for Text 中手动进行公式识别。"
  },
  markdown: {
    label: "使用的 Markdown 插件",
    help: "用于显示公式，推荐使用 Milkdown",
    $option3: ["Markdown", "myMarkDown", "Milkdown"]
  },
  baidu_api_key: {
    help: "百度 Api Key，点击查看如何获取。",
    link: "https://ohmymn.marginnote.cn/guide/modules/autoocr.html#百度-ocr"
  },
  baidu_secret_key: "百度 Secret Key",
  mathpix_app_key: {
    help: "Mathpix App Key，点击查看如何获取。",
    link: "https://ohmymn.marginnote.cn/guide/modules/autoocr.html#mathpix"
  },
  show_key: "显示/隐藏 Key",
  text_ocr: "文字识别",
  hand_writting_ocr: "手写识别",
  qr_code_ocr: "二维码识别",
  sure: "确定",
  detect_link:
    "结果已复制到剪贴板上，但检测到识别结果中含有链接，是否直接在浏览器中打开？",
  baidu_token_error: "百度 OCR Api Key 或 Secret Key 输入错误！",
  no_mathpix_key: "没有输入 Mathpix key！",
  mathpix_key_error: "Mathpix key 输入错误！",
  success_clipboard: "结果已复制到剪贴板上，快去粘贴吧！",
  no_baidu_api_key: "没有设置百度 OCR Api Key",
  no_baidu_secret_key: "没有设置百度 OCR Secret Key"
}

const en: typeof zh = {
  intro:
    "Using Baidu OCR API, it can be used without activating OCR Pro and supports several small languages.",
  link: "https://busiyi.notion.site/AutoReplace-23df00035c97436e88a863925a08e57f",
  on: {
    label: "Auto Executed",
    help: "[Current Document]"
  },
  lang: {
    help: "[Current Document]",
    label: "Language",
    $option20: [
      "Auto",
      "Chinese+English",
      "English",
      "Japanese",
      "Korean",
      "French",
      "Spanish",
      "Portuguese",
      "German",
      "Italian",
      "Russian",
      "Danish",
      "Dutch",
      "Malay",
      "Swedish",
      "Indonesian",
      "Polish",
      "Romanian",
      "Turkish",
      "Greek",
      "Hungarian"
    ]
  },
  formula_ocr_providers: {
    label: "Formula OCR Providers",
    $option2: ["Baidu", "Mathpix"],
    help: "Formula OCR is not supported in auto mode, only in MagicAtion for Text."
  },
  markdown: {
    label: "Markdown Addon Used",
    help: "For displaying formulas, Milkdown is recommended",
    $option3: ["Markdown", "myMarkDown", "Milkdown"]
  },
  formula_ocr: {
    label: "Formula OCR",
    help: 'For "Markdown" Addon, please choose Pure Latex',
    $option3: ["Pure Latex", "$ Latex $", "$$ Latex $$"]
  },
  baidu_api_key: {
    link: "",
    help: "Baidu Api Key, click to see how to get it."
  },
  baidu_secret_key: "Baidu Secret Key",
  mathpix_app_key: {
    link: "",
    help: "Mathpix App Key, click to see how to get it."
  },
  show_key: "Show / Hidden Key",
  text_ocr: "Text OCR",
  hand_writting_ocr: "Handwritting OCR",
  qr_code_ocr: "QRCode OCR",
  sure: "Confirm",
  detect_link:
    "The result has been copied to the clipboard, but a link is detected in the recognition result, is it opened directly?",
  baidu_token_error: "Api Key or Secret Key is wrong!",
  no_mathpix_key: "No Mathpix key！",
  mathpix_key_error: "Mathpix key is wrong!",
  success_clipboard:
    "The results have been copied to the clipboard, go ahead and paste them!",
  no_baidu_api_key: "No Baidu OCR Api Key",
  no_baidu_secret_key: "No Baidu OCR Secret Key"
}
export const lang = MN.isZH ? zh : en
