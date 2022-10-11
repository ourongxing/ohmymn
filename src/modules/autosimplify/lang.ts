import { MN } from "marginnote/sdk"

const zh = {
  intro: "自动转换为简体中文",
  on: {
    label: "摘录时自动执行",
    help: "【仅当前文档】"
  },
  variant: {
    label: "异体字转换",
    $option3: ["中国大陆", "中国台湾", "中国香港"] as StringTuple<3>
  },
  taiwan_idiom: {
    label: "台湾特殊用词转换"
  },
  custom_simplify: {
    help: "自定义转换，点击查看自定义方法"
  },
  simplify_card: {
    label: "转换为简体中文",
    $option3: ["摘录和标题", "仅摘录", "仅标题"] as StringTuple<3>
  },
  simplify_text: "转换为简体中文"
}

const en: typeof zh = {
  intro: "Auto convert to simplified Chinese",
  on: {
    label: "Auto Execute when Excerpting",
    help: "【Current Document】"
  },
  variant: {
    label: "Variant Conversion",
    $option3: ["Mainland China", "Taiwan China", "Hong Kong China"]
  },
  taiwan_idiom: {
    label: "Taiwan Special Word Conversion"
  },
  custom_simplify: {
    help: "Custom conversion, click to get how to customize"
  },
  simplify_card: {
    label: "Convert to Simplified Chinese",
    $option3: ["Excerpt and Title", "Only Excerpt", "Only Title"]
  },
  simplify_text: "Convert to Simplified Chinese"
}
export const lang = MN.isZH ? zh : en
