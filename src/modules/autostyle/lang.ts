import { i18n } from "marginnote"

export default i18n({
  zh: {
    intro: "自动修改摘录颜色和样式。",
    area: "面积",
    on: "摘录时自动执行",
    change_style: {
      lable: "修改摘录样式",
      $option4: [
        "使用 AutoStyle 的设置",
        "线框+填充",
        "填充",
        "线框"
      ] as StringTuple<4>
    },
    change_color: {
      label: "修改摘录颜色",
      help: "输入颜色索引，也就是顺序，1 到 16。",
      out_of_range: "不再范围内（1,16）",
      $option2: ["使用 AutoStyle 的设置", "确定"] as StringTuple<2>
    },
    preset: {
      label: "选择需要的预设",
      $option4: [
        "样式由字数或面积决定",
        "颜色跟随卡片",
        "颜色跟随第一个兄弟卡片",
        "颜色跟随父卡片"
      ] as StringTuple<4>
    },
    $style4: ["无", "线框+填充", "填充", "线框"] as StringTuple<4>,
    $color17: [
      "无",
      "浅黄",
      "浅绿",
      "浅蓝",
      "浅红",
      "黄",
      "绿",
      "蓝",
      "红",
      "橘",
      "深绿",
      "深蓝",
      "深红",
      "白",
      "浅灰",
      "深灰",
      "紫"
    ] as StringTuple<17>,
    word_count_area: {
      help: "[类中文字数, 类英文单词数, 选区面积]，超过则将摘录样式设置为线框，否则默认。",
      input_array: "请输入数组，比如 [10,5,100]",
      input_three_number: "数组内必须有三个数字，比如 [10,5,100]"
    },
    show_area: "显示摘录面积",
    default_text_excerpt_color: "文本摘录默认颜色",
    default_pic_excerpt_color: "选区摘录默认颜色",
    default_text_excerpt_style: "文本摘录默认样式",
    default_pic_excerpt_style: "选区摘录默认样式",
    enter_positive: "请输入正整数"
  },
  en: {
    intro: "Auto modify excerpt colors and styles.",
    on: "Auto Run When Excerpting",
    area: "Aera",
    change_style: {
      lable: "Modify Excerpt Style",
      $option4: ["Use AutoStyle Settings", "Outline+Fill", "Fill", "Outline"]
    },
    change_color: {
      label: "Modify Excerpt Color",
      help: "Enter the color index, 1 to 16",
      $option2: ["Use AutoStyle Settings", "Confirm"],
      out_of_range: "Out of range（1,16）"
    },
    preset: {
      label: "Select Presets",
      $option4: [
        "Style is determined by word count or area",
        "Color follow card",
        "Color follows frist child node",
        "Color follows parent node"
      ]
    },
    $style4: ["None", "Wireframe+Fill", "Fill", "Wireframe"],
    $color17: [
      "None",
      "Light Yellow",
      "Light Green",
      "Light Blue",
      "light red",
      "Yellow",
      "Green",
      "Blue",
      "Red",
      "Orange",
      "Dark Green",
      "Dark Blue",
      "Dark Red",
      "White",
      "Light Grey",
      "Dark Grey",
      "Purple"
    ],
    word_count_area: {
      help: "[Chinese words, English words, Selected area size], if it exceeds, set the excerpt style to wireframe, otherwise the default.\n",
      input_array: "Please enter an array, for example [10,5,100]",
      input_three_number:
        "There must be three numbers in the array，for example [10,5,100]"
    },
    enter_positive: "Please enter a positive integer",
    show_area: "Show Excerpt Area",
    default_text_excerpt_color: "Default Text Excerpt Color",
    default_pic_excerpt_color: "Default Pic Excerpt Color",
    default_text_excerpt_style: "Default Text Excerpt Style",
    default_pic_excerpt_style: "Default Pic Excerpt Style"
  }
})
