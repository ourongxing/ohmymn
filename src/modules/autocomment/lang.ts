import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro: "自动添加评论",
    on: "摘录时自动执行",
    preset: {
      label: "选择需要的预设",
      $option2: ["自定义", "修改时间"] as StringTuple
    },
    add_comment: {
      label: "添加评论",
      $option2: ["使用 AutoComment 的设置", "确定"] as StringTuple
    },
    custom_comment: {
      help: "自定义，点击查看具体格式",
      link: doc("autocomment")
    }
  },
  en: {
    intro: "Auto Add Comments",
    on: "Auto Executed",
    preset: {
      label: "Select Presets",
      $option2: ["Custom", "Modified Time"]
    },
    add_comment: {
      $option2: ["Use AutoComment Settings", "Confirm"],
      label: "Add Comment"
    },
    custom_comment: {
      help: "Customize. Click for specific formats",
      link: doc("autocomment")
    }
  }
})
