import { i18n } from "marginnote"

export default i18n({
  zh: {
    intro:
      "所有动作均需要在文档中选中文字或框选选区。动作来自于各个模块，需要启用对应的模块。点击查看具体的使用方法和注意事项。",
    pre_OCR: {
      label: "预先 OCR",
      help: "【仅当前文档】使用 AutoOCR 进行转文字或矫正，请确保你已经填入 OCR 密钥。"
    },
    pre_simplify: {
      label: "预先转为简体中文",
      help: "【仅当前文档】使用 AutoSimplify 进行繁简转换。"
    },
    pre_format: {
      label: "预先格式化",
      help: "【仅当前文档】使用 AutoFormat 进行格式化排版。"
    },
    show_copy_content: {
      label: "显示复制的内容"
    },
    copy_text: "复制选中文字",
    note_options: {
      $option6: [
        "复制",
        "设置为标题",
        "合并标题",
        "合并到摘录",
        "添加为摘录",
        "添加为评论"
      ] as StringTuple<6>,
      label: "弹出更多选项",
      help: "如果选中这段文字之前，你已经选中了一个摘录。此时执行某些会将结果复制到剪贴板的动作时会弹出更多选项，方便直接写入卡片中。"
    }
  },
  en: {
    intro:
      "All actions require text to be selected or a selection area to be selected. Actions come from various modules and require the corresponding module to be enabled. Click to view specific usage and precautions.",
    copy_text: "Copy Selected Text",
    pre_OCR: {
      label: "Pre OCR",
      help: "[Only Current Document] Use AutoOCR to OCR. Please make sure you have filled in the OCR key."
    },
    pre_simplify: {
      label: "Pre Simplify",
      help: "[Only Current Document] Use AutoSimplify to convert to Simplified Chinese."
    },
    pre_format: {
      label: "Pre Format",
      help: "[Only Current Document] Use AutoFormat to format the text."
    },
    show_copy_content: {
      label: "Show Content of Copied"
    },
    note_options: {
      $option6: [
        "Copy",
        "Set as Title",
        "Merge Title",
        "Merge to Note",
        "Add as Note",
        "Add as Comment"
      ],
      label: "Popup More Options",
      help: "If you have selected a note before selecting this text or area, some action which copied result will pop up more options to write directly into the card."
    }
  }
})
