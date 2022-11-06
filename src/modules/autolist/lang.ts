import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro:
      "针对有序号的摘录，自动添加换行。所有预设均必须匹配到两个及以上，包括自定义。",
    on: "摘录时自动执行",
    preset: {
      label: "选择需要的预设",
      $option4: [
        "自定义",
        "ABCD...",
        "一二三四...",
        "1234..."
      ] as StringTuple<4>
    },
    list_selected: {
      label: "添加换行",
      $option2: ["使用 AutoList 的设置", "确定"] as StringTuple<2>
    },
    custom_list: {
      help: "自定义，点击查看具体格式。",
      link: doc("autolist")
    }
  },
  en: {
    intro:
      "For text with serial number, auto add line breaks. All presets need to meet a minimum of two serial numbers.",
    on: "Auto Run When Excerpting",
    custom_list: {
      help: "Customize. Click for specific formats",
      link: doc("autolist")
    },
    preset: {
      label: "Select Presets",
      $option4: ["Custom", "ABCD...", "一二三四...", "1234..."]
    },
    list_selected: {
      label: "Add Line Breaks",
      $option2: ["Use AutoList Settings", "Confirm"]
    }
  }
})
