import { MN } from "~/addon"

const zh = {
  intro: "什么样的摘录该自动转为标题？",
  link: "https://ohmymn.vercel.app/guide/modules/anotherautotitle.html",
  option: {
    preset: ["自定义", "根据字数", "不含有点号"]
  },
  label: {
    change_title_no_limit: "标题摘录始终为标题",
    on: "摘录时自动执行",
    preset: "选择需要的预设",
    word_count: "[类中文字数, 类英文单词数]，没超过就自动设置为标题"
  },
  help: {
    custom_be_title: "自定义，点击查看具体格式",
    change_title_no_limit: "修改标题摘录选区，始终转为标题"
  },
  check: {
    enter_positive: "请输入正整数",
    input_array: "请输入数组，比如 [10,5]",
    input_three_number: "数组内必须有两个数字，比如 [10,5]"
  }
}

const en: typeof zh = {
  intro: "What kind of excerpts should be automatically converted to titles?",
  link: "https://www.notion.so/huangkewei/AnotherAutoTitle-bdd09b713c844a82aeea1c0d3bd4cb48", //Todo:修改英文版Notion
  option: {
    preset: ["Custom", "Word Count", "Not Contain Dots"]
  },
  label: {
    on: "Auto Executed",
    change_title_no_limit: "Title Always Be Title",
    preset: "Select Presets",
    word_count:
      "[Chinese words, English words], if not exceeded, then set the excerpt text as the title"
  },
  help: {
    custom_be_title: "Customize. Click for specific formats",
    change_title_no_limit:
      "Change the title excerpt selection, always turn to the title"
  },
  check: {
    enter_positive: "Please enter a positive integer",
    input_array: "Please enter an array, for example [10,5]",
    input_three_number:
      "There must be two numbers in the array，for example [10,5]"
  }
}

export const lang = MN.isZH ? zh : en
