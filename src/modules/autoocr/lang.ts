import { MN } from "~/const"

const zh = {
  intro: "使用百度 OCR API，不需要激活 OCR Pro 即可使用，并支持多个小语种。",
  link: "https://ohmymn.vercel.app/guide/modules/autoocr.html",
  option: {
    lang: [
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
    formulaOCRProviders: ["百度", "Mathpix"],
    formulaOCR: ["Pure Latex", "$ Latex $", "$$ Latex $$"]
  },
  help: {
    on: "【当前文档】",
    lang: "【当前文档】",
    baiduApiKey: "百度 Api Key，点击查看如何获取。",
    baiduSecretKey: "百度 Secret Key",
    mathpixAppKey: "Mathpix App Key，点击查看如何获取。"
  },
  label: {
    lang: "识别语言",
    formulaOCRProviders: "公式识别提供商",
    showKey: "显示/隐藏 Key",
    on: "摘录时自动执行",
    formulaOCR: "公式识别",
    textOCR: "文字识别",
    handWrittingOCR: "手写识别",
    QRCodeOCR: "二维码识别"
  },
  other: {
    sure: "确定",
    link: "结果已复制到剪贴板上，但检测到识别结果中含有链接，是否直接在浏览器中打开？",
    baidu_token_error: "百度 OCR Api Key 或 Secret Key 输入错误！",
    no_mathpix_key: "没有输入 Mathpix key！",
    mathpix_key_error: "Mathpix key 输入错误！",
    success_clipboard: "结果已复制到剪贴板上，快去粘贴吧！"
  }
}

const en: typeof zh = {
  intro:
    "Using Baidu OCR API, it can be used without activating OCR Pro and supports several small languages.",
  link: "https://busiyi.notion.site/AutoReplace-23df00035c97436e88a863925a08e57f",
  option: {
    lang: [
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
    ],
    formulaOCRProviders: ["Baidu", "Mathpix"],
    formulaOCR: ["Pure Latex", "$ Latex $", "$$ Latex $$"]
  },
  help: {
    on: "[Current Document]",
    lang: "[Current Document]",
    baiduApiKey: "Baidu Api Key, click to see how to get it.",
    baiduSecretKey: "Baidu Secret Key",
    mathpixAppKey: "Mathpix App Key, click to see how to get it."
  },
  label: {
    lang: "Language",
    formulaOCRProviders: "Formula OCR Providers",
    showKey: "Show / Hidden Key",
    on: "Auto Executed",
    formulaOCR: "Formula OCR",
    textOCR: "Text OCR",
    handWrittingOCR: "Handwritting OCR",
    QRCodeOCR: "QRCode OCR"
  },
  other: {
    sure: "Sure",
    link: "The result has been copied to the clipboard, but a link is detected in the recognition result, is it opened directly?",
    baidu_token_error: "Api Key or Secret Key is wrong!",
    no_mathpix_key: "No Mathpix key！",
    mathpix_key_error: "Mathpix key is wrong!",
    success_clipboard:
      "The results have been copied to the clipboard, go ahead and paste them!"
  }
}
export const lang = MN.isZH ? zh : en
