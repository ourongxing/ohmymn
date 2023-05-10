import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro: "优化摘录和标题的排版与格式。",
    on: "摘录时自动执行",
    custom_format: {
      help: "自定义，点击查看具体格式。",
      link: doc("autoformat")
    },
    preset: {
      label: "选择需要的预设",
      $option5: [
        "自定义",
        "半角转全角",
        "中英文加空格",
        "去除中文间空格",
        "去除重复空格"
      ] as StringTuple<5>
    },
    format_selected: {
      label: "优化排版格式",
      $option3: ["标题和摘录", "仅标题", "仅摘录"] as StringTuple<3>
    },
    remove_space: {
      label: "删除所有空格",
      help: "【仅当前文档】如果文档中有大量单词，请谨慎使用。"
    },
    format_title: {
      help: "涉及到首字母大写，点击查看具体规范。",
      label: "英文标题规范化",
      link: doc("autoformat")
    }
  },
  en: {
    intro: "Optimize the layout and format of excerpts and titles.",
    on: "Auto Run When Excerpting",
    remove_space: {
      label: "Remove All Spaces",
      help: "[Only Current Document] If there are a lot of words in the document, please use it with caution."
    },
    custom_format: {
      help: "Customize. Click for specific formats.",
      link: doc("autoformat")
    },
    preset: {
      label: "Select Presets",
      $option5: [
        "Custom",
        "Half Width To Full Width",
        "Add Space Between Chinese & English",
        "Remove Spaces Between Chinese",
        "Remove Repeated Spaces"
      ]
    },
    format_selected: {
      label: "Format Excerpt Text",
      $option3: ["All", "Only Title", "Only Excerpt Text"]
    },
    format_title: {
      label: "Normalize English Title",
      link: doc("autoformat"),
      help: "Click for  specific specifications"
    }
  }
})
