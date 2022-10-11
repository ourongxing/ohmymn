import { MN } from "marginnote/sdk"
import { doc } from "~/utils"

const zh = {
  intro:
    "将摘录拆分为标题（被定义项）和摘录（定义项）两部分。\n定义 = 被定义项 + 定义联项 + 定义项。   ",
  on: "摘录时自动执行",
  only_desc: "摘录仅保留定义项",
  to_title_link: "别名转为多个标题",
  preset: {
    label: "选择需要的预设",
    $option9: [
      "自定义提取标题",
      "自定义定义联项",
      "xxx : yyy",
      "xxx —— yyy",
      "xxx ，是(指) yyy",
      "xxx 是(指)，yyy",
      "xxx 是指 yyy",
      "yyy，___称(之)为 xxx",
      "yyy(被)称(之)为 xxx"
    ] as StringTuple<9>
  },
  confirm_preset: {
    label: "需要确认的预设",
    help: "如果你的摘录中匹配到指定预设，在执行前会弹出确认框，避免误触发。"
  },
  title_link_split: {
    label: "选择别名分词",
    $option3: ["自定义", "默认", "标点符号"] as StringTuple<3>
  },
  extract_title: {
    label: "提取标题",
    $option2: ["使用 AutoDef 中的配置", "确定"] as StringTuple<2>
  },
  split_excerpt: {
    label: "拆分摘录",
    $option2: ["使用 AutoDef 中的配置", "确定"] as StringTuple<2>,
    help: "将摘录拆分为标题（被定义项）和摘录（定义项）两部分。"
  },
  custom_title_split: {
    link: doc("anotherautodef", "自定义别名分词"),
    help: "自定义别名分词，点击查看具体格式"
  },
  custom_def_link: {
    link: doc("anotherautodef", "自定义定义联项"),
    help: "自定义定义联项，点击查看具体格式"
  },
  custom_extract_title: {
    link: doc("anotherautodef", "自定义提取标题"),
    help: "自定义提取标题，点击查看具体格式"
  }
}

const en: typeof zh = {
  intro:
    "Extract the defined terms and any other content as title or title link\nDefinition = Defined Term + Connective of Definition + Definiens\n", //Question:有待商议
  on: "Auto Executed",
  only_desc: "Only Keep Definiens",
  to_title_link: "Convert Alias To Muilt Titles",
  title_link_split: {
    $option3: ["Custom", "Default", "Punctuation"],
    label: "Select Alias Participle"
  },
  preset: {
    $option9: [
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
    label: "Select Presets"
  },
  confirm_preset: {
    label: "Confirm Presets",
    help: "If the excerpt matches the specified preset, a confirmation box will pop up before execution to avoid accidental triggering."
  },
  extract_title: {
    label: "Extract Title",
    $option2: ["Use AutoDef Settings", "Confirm"]
  },
  split_excerpt: {
    label: "Split Excerpt Text",
    $option2: ["Use AutoDef Settings", "Confirm"],
    help: "Split the excerpt into title (defined) and excerpt (definiens) parts."
  },
  custom_title_split: {
    link: doc("anotherautodef", "自定义别名分词"),
    help: "Customize alias participle, click for  specific format"
  },
  custom_def_link: {
    link: doc("anotherautodef", "自定义定义联项"),
    help: "Customize connective of definition, click for  the specific format"
  },
  custom_extract_title: {
    link: doc("anotherautodef", "自定义提取标题"),
    help: "Customize extract title, click for  specific format"
  }
}

export const lang = MN.isZH ? zh : en
