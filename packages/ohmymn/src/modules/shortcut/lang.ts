import { i18n } from "marginnote"
import { doc } from "~/utils"

export default i18n({
  zh: {
    intro:
      "通过 URL Scheme 来触发 MagicAction 中的动作，你可以设置快捷键来打开 URL。该功能完全由 OhMyMN 提供，与 MN 无关。点击查看设置方法及注意事项。",
    shortcut_pro: {
      help: "用于同时触发多个动作并传入输入值，点击创建自定义捷径。",
      label: "自定义捷径",
      link: doc("shortcut", "自定义捷径")
    },
    pro: "请打开自定义捷径功能",
    card_shortcut: "卡片动作捷径",
    action_not_work: "模块未启用，该动作无法执行",
    text_shortcut: "文字动作捷径",
    shortcut_range: "shortcut 参数请传入范围内的整数",
    no_action: "必须传入 action 参数",
    action_not_exist: "action 不存在",
    option_interger: "option 参数请传入整数",
    info_error: "错误的 actions 参数",
    type_not_exist: "type 参数不正确，必须是 card 或 text"
  },
  en: {
    intro:
      "Trigger the action in MagicAction by URL Scheme, you can set a shortcut to open the URL. This feature is provided by OhMyMN, not MN. Click to view the setup method and precautions.         ",
    shortcut_pro: {
      help: "Used to trigger multiple actions at the same time and pass in input values. Click to create a custom shortcut.",
      label: "Custom Shortcuts",
      link: doc("shortcut", "custom-shortcuts")
    },
    pro: "Please open the custom shortcut feature",
    card_shortcut: "Card Action Shortcut",
    text_shortcut: "Text Action Shortcut",
    action_not_work: "Module is not enabled, the action cannot be executed",
    shortcut_range:
      "The shortcut parameter should be an integer within the range",
    no_action: "The action parameter must be passed in",
    action_not_exist: "action does not exist",
    option_interger: "The option parameter should be an integer",
    type_not_exist: "The type parameter is incorrect, it must be card or text",
    info_error: "Incorrect Actions parameter"
  }
})
