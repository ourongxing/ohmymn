import { MN } from "const"

const zh = {
  link: "https://busiyi.notion.site/AutoStyle-008cc0fae7844e7fb171ca948da91cb5",
  intro: "自动修改摘录颜色和样式",
  area: "面积",
  label: {
    on: "摘录时自动执行",
    preset: "选择需要的预设",
    change_style: "修改摘录样式",
    change_color: "修改摘录颜色",
    show_area: "显示摘录面积",
    default_text_excerpt_color: "文本摘录默认颜色",
    default_pic_excerpt_color: "图片摘录默认颜色",
    default_text_excerpt_style: "文本摘录默认样式",
    default_pic_excerpt_style: "图片摘录默认样式",
    word_count_area:
      "[中文句子中的字数, 英文句子中的字数, 选区面积]，超过则将摘录样式设置为线框，否则默认"
  },
  help: {
    change_color: "输入颜色索引，也就是顺序，1 到 16"
  },
  option: {
    change_style: ["使用 AutoStyle 的配置", "线框+填充", "填充", "线框"],
    change_color: ["使用 AutoStyle 的配置", "确定"],
    preset: [
      "样式由字数或面积决定",
      "颜色跟随卡片",
      "颜色跟随第一个兄弟节点",
      "颜色跟随父节点"
    ],
    style: ["无", "线框+填充", "填充", "线框"],
    color: [
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
    ]
  }
}

const en: typeof zh = {
  link: "https://www.notion.so/huangkewei/AutoStyle-16971d7c0fb048bd828d97373a035bc2",
  intro: "Auto modify excerpt colors and styles",
  area: "Aera",
  label: {
    on: "Auto Executed",
    preset: "Select Presets",
    change_style: "Modify Excerpt Style",
    change_color: "Modify Excerpt Color",
    show_area: "Show Excerpt Area",
    default_text_excerpt_color: "Default Text Excerpt Color",
    default_pic_excerpt_color: "Default Pic Excerpt Color",
    default_text_excerpt_style: "Default Text Excerpt Style",
    default_pic_excerpt_style: "Default Pic Excerpt Style",
    word_count_area:
      "[number of words in a Chinese sentence, in a English sentence, selected area size], if it exceeds, set the excerpt style to wireframe, otherwise the default.\n"
  },
  help: {
    change_color: "Enter the color index, 1 to 16"
  },
  option: {
    change_style: [
      "Use AutoStyle Configuration",
      "Wireframe+Fill",
      "Fill",
      "Wireframe"
    ],
    change_color: ["Use AutoStyle Configuration", "Confirm"],
    preset: [
      "Style is determined by word count or area",
      "Color follow card",
      "Color follows frist child node",
      "Color follows parent node"
    ],
    style: ["None", "Wireframe+Fill", "Fill", "Wireframe"],
    color: [
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
    ]
  }
}

export const lang = MN.isZH ? zh : en
