import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro: "自动从摘录中提取标签或者在特定时候自动添加标签。",
    link: doc("autotag"),
    on: "摘录时自动执行",
    preset: {
      label: "选择需要的预设",
      $option1: ["自定义"] as StringTuple<1>
    },
    add_tag: {
      label: "添加标签",
      $option2: ["使用 AutoTag 的设置", "确定"] as StringTuple<2>
    },
    custom_tag: {
      link: doc("autotag", "自定义"),
      help: "自定义，点击查看具体格式。"
    }
  },
  en: {
    intro:
      "Extract tags from excerpts or add tags at specific times Automatically.",
    link: doc("autotag"),
    on: "Auto Run When Excerpting",
    preset: {
      label: "Select Presets",
      $option1: ["Custom"]
    },
    add_tag: {
      label: "Add Tags",
      $option2: ["Use AutoTag Settings", "Confirm"]
    },
    custom_tag: {
      link: doc("autotag", "custom"),
      help: "Customize. Click for specific formats"
    }
  }
})
