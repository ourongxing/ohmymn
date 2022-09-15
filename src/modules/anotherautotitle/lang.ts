import { MN } from "~/sdk"

const zh = {
  intro: "什么样的摘录该自动转为标题？",
  link: "https://ohmymn.marginnote.cn/guide/modules/anotherautotitle.html",
  on: "摘录时自动执行",
  preset: {
    label: "选择需要的预设",
    $option3: ["自定义", "根据字数", "不含有点号"] as StringTuple<3>
  },
  word_count: {
    help: "[类中文字数, 类英文单词数]，没超过就自动设置为标题",
    enter_positive: "请输入正整数",
    input_array: "请输入数组，比如 [10,5]",
    input_three_number: "数组内必须有两个数字，比如 [10,5]"
  },
  custom_be_title: {
    help: "自定义，点击查看具体格式",
    link: "https://ohmymn.marginnote.cn/guide/modules/anotherautotitle.html#自定义"
  },
  change_title_no_limit: {
    label: "标题摘录始终为标题",
    help: "修改已经转为标题的摘录选区，始终转为标题"
  }
}

const en: typeof zh = {
  intro: "What kind of excerpts should be automatically converted to titles?",
  link: "https://ohmymn.marginnote.cn/guide/modules/anotherautotitle.html",
  on: "Auto Executed",
  preset: {
    label: "Select Presets",
    $option3: ["Custom", "Word Count", "Not Contain Dots"]
  },
  change_title_no_limit: {
    label: "Title Always Be Title",
    help: "Change the title excerpt selection, always turn to the title"
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
    link: "https://ohmymn.marginnote.cn/guide/modules/anotherautotitle.html#自定义"
  }
}

export const lang = MN.isZH ? zh : en
