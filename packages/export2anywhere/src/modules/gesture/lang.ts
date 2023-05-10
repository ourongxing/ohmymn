import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro:
      "【仅 iPad 可用】使用手势来触发 MagicAction 中的动作。该功能完全由 OhMyMN 提供，与 MN 无关。点击查看手势监测区域及注意事项。             ",
    single_bar: "卡片单选工具栏",
    muilt_bar: "卡片多选工具栏",
    selection_bar: "文字选择工具栏",
    action_not_work: "模块未启用，该动作无法执行",
    custom_shortcut: "自定义捷径",
    only_mn: "仅支持 MarginNote 插件的 URL Scheme，但不限于 OhMyMN",
    show_y: {
      label: "显示 Y 轴坐标",
      help: "针对文字选择工具栏区域手势无法识别的问题，开启后会显示滑动位置的 Y 轴坐标，方便自行调整。     "
    },
    selection_bar_y: {
      help: "[从左到右选择时在文字选择工具栏顶部滑动时的 Y 轴坐标, 从右到左选择时在文字选择工具栏顶部滑动时的 Y 轴坐标]。点击查看设置方法。                   ",
      enter_positive: "请输入正整数",
      input_array: "请输入数组，比如 [0,70]",
      input_two_number: "数组内必须有两个数字，比如 [0,70]",
      link: doc("gesture", "调整文字选择工具栏识别区域")
    }
  },
  en: {
    intro:
      "【iPad only】Trigger MagicAction by gesture. This feature is provided by OhMyMN, not MarginNote. Click to view the gesture detection area and precautions.",
    single_bar: "Card Selection Toolbar",
    muilt_bar: "Card Multi-Select Toolbar",
    selection_bar: "Text Selection Toolbar",
    action_not_work: "Module is not enabled, the action cannot be run",
    custom_shortcut: "Custom Shortcuts",
    only_mn:
      "Only support MarginNote addon's URL Scheme, but not limited to OhMyMN.",
    selection_bar_y: {
      help: "[Y axis coordinate when swiping in the top of text select toolbar when selecting from left to right, Y axis coordinate when swiping in the top of text select toolbar when selecting from right to left].",
      enter_positive: "Please enter a positive integer",
      input_array: "Please enter an array, such as [0,70]",
      input_two_number:
        "There must be two numbers in the array, such as [0,70]",
      link: doc("gesture", "adjust-the-text-selection-toolbar-recognition-area")
    },
    show_y: {
      label: "Show Y coordinate",
      help: "For the problem that the gesture in the text selection toolbar area cannot be recognized, the Y coordinate of the sliding position will be displayed after turning on, which is convenient for self-adjustment."
    }
  }
})
