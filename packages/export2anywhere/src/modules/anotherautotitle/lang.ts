import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro: "自动将摘录转为标题。",
    on: "摘录时自动执行",
    preset: {
      label: "选择需要的预设",
      $option3: ["自定义", "字数", "不含有点号"] as StringTuple<3>
    },
    word_count: {
      help: "[类中文字数, 类英文单词数]，没超过就自动设置为标题。",
      enter_positive: "请输入正整数",
      input_array: "请输入数组，比如 [10,5]",
      input_three_number: "数组内必须有两个数字，比如 [10,5]"
    },
    custom_be_title: {
      help: "自定义，点击查看具体格式。",
      link: doc("anotherautotitle", "自定义")
    }
  },
  en: {
    intro: "Automatically convert the excerpt to the title.",
    on: "Auto Run When Excerpting",
    preset: {
      label: "Select Presets",
      $option3: ["Custom", "Word Count", "Not Contain Dot Symbols"]
    },
    word_count: {
      help: "[Chinese words, English words], if not exceeded, then set the excerpt text as the title",
      enter_positive: "Please enter a positive integer",
      input_array: "Please enter an array, for example [10,5]",
      input_three_number:
        "There must be two numbers in the array，for example [10,5]"
    },
    custom_be_title: {
      help: "Customize. Click for specific formats",
      link: doc("anotherautotitle", "custom")
    }
  }
})
