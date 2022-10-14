import { i18n } from "marginnote"

export default i18n({
  zh: {
    magicaction_from_which_module: (module: string) =>
      `该动作来自于 ${module}，与其使用相同的设置。`,
    open_panel: "切换控制面板",
    none: "无",
    website: "OhMyMN 官网：ohmymn.marginnote.cn",
    core_team: "核心开发团队：ourongxing，Bryan",
    intro:
      "OhMyMN 是一个可以自动处理摘录的强大插件，同时也是 MarginNote 插件开发框架。OhMyMN 完全开源，官方支持，欢迎参与。"
  },
  en: {
    magicaction_from_which_module: (module: string) =>
      `This action comes from ${module} and uses the same settings. `,
    open_panel: "Switch Control Panel",
    none: "None",
    website: "OhMyMN Website: ohmymn.marginnote.con",
    core_team: "Core Team: ourongxing，Bryan",
    intro:
      "OhMyMN is a powerful addon that can process excerpts automatically and also is MarginNote addon development framework. OhMyMN is completely open source, officially supported, and welcome to join us."
  }
})
