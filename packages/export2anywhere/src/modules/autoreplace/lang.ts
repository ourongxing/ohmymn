import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro: "自动替换摘录中的文字。",
    on: "摘录时自动执行",
    preset: {
      label: "选择需要的预设",
      $option1: ["自定义"] as StringTuple<1>
    },
    replace_selected: {
      label: "替换摘录内容",
      $option2: ["使用 AutoReplace 的设置", "确定"] as StringTuple<2>
    },
    custom_replace: {
      link: doc("autoreplace", "自定义"),
      help: "自定义，点击查看具体格式。"
    }
  },
  en: {
    intro: "Automatically replace errors in excerpts. ",
    on: "Auto Run When Excerpting",
    preset: {
      label: "Select Presets",
      $option1: ["Custom"]
    },
    replace_selected: {
      $option2: ["Use AutoReplace Settings", "Confirm"],
      label: "Replace Excerpt Text"
    },
    custom_replace: {
      link: doc("autoreplace", "custom"),
      help: "Customize. Click for specific formats"
    }
  }
})
