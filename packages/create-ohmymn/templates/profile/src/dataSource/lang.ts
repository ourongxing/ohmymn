import { i18n } from "marginnote"

export default i18n({
  zh: {
    magicaction_from_which_module: (module: string) =>
      `该动作来自于 ${module}，与其使用相同的设置。`,
    open_panel: "切换控制面板",
    none: "无"
  },
  en: {
    magicaction_from_which_module: (module: string) =>
      `This action comes from ${module} and uses the same settings. `,
    open_panel: "Switch Control Panel",
    none: "None"
  }
})
