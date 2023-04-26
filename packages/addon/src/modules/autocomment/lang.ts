import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro: "自动从摘录中提取评论或者在特定时候自动添加评论。",
    on: "摘录时自动执行",
    preset: {
      label: "选择需要的预设",
      $option: ["自定义"] as StringTuple<1>
    },
    add_comment: {
      label: "添加评论",
      $option2: ["使用 AutoComment 的设置", "确定"] as StringTuple
    },
    custom_comment: {
      help: "自定义，点击查看具体格式。",
      link: doc("autocomment")
    }
  },
  en: {
    intro:
      "Automatically extract comments from excerpts or add comments at a specific time.",
    on: "Auto Run When Excerpting",
    preset: {
      label: "Select Presets",
      $option: ["Custom"]
    },
    add_comment: {
      $option2: ["Use AutoComment Settings", "Confirm"],
      label: "Add Comment"
    },
    custom_comment: {
      help: "Customize. Click for specific formats.",
      link: doc("autocomment")
    }
  }
})
