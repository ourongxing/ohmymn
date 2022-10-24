import { i18n } from "marginnote"

export default i18n({
  zh: {
    intro:
      "【3.7.19】通过 URL Scheme 来触发 MagicAction 中的动作，你可以设置快捷键来打开 URL。该功能完全由 OhMyMN 提供，与 MN 无关。点击查看设置方法及注意事项。",
    shortcut_pro: {
      help: "直接通过 URL Scheme 设置动作的参数，而不需要输入框。可以设置无限多个捷径。",
      label: "自定义捷径"
    },
    card_shortcut: "卡片动作捷径",
    action_not_work: "模块未启用，该动作无法执行",
    text_shortcut: "文字动作捷径",
    shortcut_range: "shortcut 参数请传入范围内的整数",
    no_action: "必须传入 action 参数",
    action_not_exist: "action 不存在",
    option_interger: "option 参数请传入整数",
    type_not_exist: "type 参数不正确，必须是 card 或 text"
  },
  en: {
    intro:
      "[3.7.19] Trigger the action in MagicAction through URL Scheme, you can set the shortcut to open the URL. This function is provided by OhMyMN, and has nothing to do with MN. Click to view the setting method and precautions.",
    shortcut_pro: {
      help: "Set the parameters of the action directly through the URL Scheme, without the need for an input box. You can set an unlimited number of shortcuts.",
      label: "Custom Shortcut"
    },
    card_shortcut: "Card Action Shortcut",
    text_shortcut: "Text Action Shortcut",
    action_not_work: "Module is not enabled, the action cannot be executed",
    shortcut_range:
      "The shortcut parameter should be an integer within the range",
    no_action: "The action parameter must be passed in",
    action_not_exist: "action does not exist",
    option_interger: "The option parameter should be an integer",
    type_not_exist: "The type parameter is incorrect, it must be card or text"
  }
})
