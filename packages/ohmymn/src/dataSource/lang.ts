import { i18n } from "marginnote"

export default i18n({
  zh: {
    magicaction_from_which_module: (module: string) =>
      `该动作来自于 ${module}，与其使用相同的设置。`,
    open_panel: "切换控制面板",
    custom_shortcut: "自定义捷径",
    none: "无",
    expand: "▶ 点击展开所有选项",
    website: "官网及文档：ohmymn.marginnote.cn",
    intro:
      "OhMyMN 是一个可以自动处理摘录的工具箱，同时也是 MarginNote 插件开发框架。OhMyMN 完全开源，欢迎参与。"
  },
  en: {
    magicaction_from_which_module: (module: string) =>
      `This action comes from ${module} and uses the same settings. `,
    open_panel: "Switch Control Panel",
    none: "None",
    custom_shortcut: "Custom Shortcut",
    expand: "▶ Click to expand all options",
    website: "Website & Document: ohmymn.marginnote.cn/en",
    intro:
      "OhMyMN is a toolbox that can process excerpts automatically and also is MarginNote addon development framework. OhMyMN is completely open source, and welcome to join us."
  }
})
