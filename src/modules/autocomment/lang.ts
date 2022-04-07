import { MN } from "const"

const zh = {
  intro: "自动添加评论",
  link: "https://busiyi.notion.site/AutoTag-3a7fc5e0b84e47d18366d4cb60c4943d",
  option: {
    preset: ["自定义", "修改时间", "引用"],
    add_comment: ["使用 AutoComment 的配置", "确定"]
  },
  help: {
    custom_comment: "自定义，点击查看具体格式"
  },
  label: {
    on: "摘录时自动执行",
    preset: "选择需要的预设",
    add_comment: "添加评论"
  }
}

const en: typeof zh = {
  intro: "Auto Add Comments",
  link: "https://www.notion.so/huangkewei/AutoTag-9e0bb2106d984ded8c29e781b53a1c23",
  option: {
    preset: ["Custom"],
    add_comment: ["Use AutoComment Settings", "Confirm"]
  },
  help: {
    custom_comment: "Customize. Click for specific formats"
  },
  label: {
    on: "Auto Executed",
    preset: "Select Presets",
    add_comment: "Add Comment"
  }
}

export const lang = MN.isZH ? zh : en
