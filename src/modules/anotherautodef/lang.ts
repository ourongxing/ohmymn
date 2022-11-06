import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro:
      "将摘录拆分为标题（被定义项）和摘录（定义项）两部分。\n定义 = 被定义项 + 定义联项 + 定义项。   ",
    on: "摘录时自动执行",
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
    title_link_split: {
      label: "选择别名分词",
      $option3: ["自定义", "默认", "标点符号"] as StringTuple<3>
    },
    extract_title: {
      label: "提取标题",
      $option2: ["使用 AutoDef 中的设置", "确定"] as StringTuple<2>
    },
    split_excerpt: {
      label: "拆分摘录",
      $option2: ["使用 AutoDef 中的设置", "确定"] as StringTuple<2>,
      help: "将摘录拆分为标题（被定义项）和摘录（定义项）两部分。"
    },
    custom_title_split: {
      link: doc("anotherautodef", "自定义别名分词"),
      help: "自定义别名分词，点击查看具体格式。"
    },
    custom_def_link: {
      link: doc("anotherautodef", "自定义定义联项"),
      help: "自定义定义联项，点击查看具体格式。"
    },
    custom_extract_title: {
      link: doc("anotherautodef", "自定义提取标题"),
      help: "自定义提取标题，点击查看具体格式。"
    }
  },
  en: {
    intro:
      "Split the excerpt into two parts: title (definiendum) and excerpt (definiens).\nDefinition = Definiendum + Connective + Definiens.                                          ",
    on: "Auto Run When Excerpting",
    to_title_link: "Convert Alias To Muilt Titles",
    title_link_split: {
      $option3: ["Custom", "Default", "Punctuation"],
      label: "Select Alias Separator"
    },
    preset: {
      $option9: [
        "Custom Titles Extraction",
        "Custom Definition Connective",
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
    extract_title: {
      label: "Extract Title",
      $option2: ["Use AutoDef Settings", "Confirm"]
    },
    split_excerpt: {
      label: "Split Excerpt Text",
      $option2: ["Use AutoDef Settings", "Confirm"],
      help: "Split the excerpt into title (definiendum) and excerpt (definiens) parts."
    },
    custom_title_split: {
      link: doc("anotherautodef", "custom-alias-separator"),
      help: "Customize alias separator, click for specific format."
    },
    custom_def_link: {
      link: doc("anotherautodef", "custom-definition-connective"),
      help: "Customize definition connective, click for the specific format."
    },
    custom_extract_title: {
      link: doc("anotherautodef", "custom-titles-extraction"),
      help: "Customize titles extraction, click for specific format."
    }
  }
})
