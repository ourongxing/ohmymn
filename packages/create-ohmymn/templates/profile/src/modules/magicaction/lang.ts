import { i18n } from "marginnote"

export default i18n({
  zh: {
    intro: "点击查看具体的使用方法和注意事项。",
    manage_profile: {
      label: "配置管理",
      $option4: [
        "读取配置",
        "写入配置",
        "重置配置",
        "同步其他窗口的配置"
      ] as StringTuple<4>,
      help: "写入配置时请确保该卡片至少有一张子卡片。多张子卡片可以一起分担配置，防止单张卡片字数过多。"
    }
  },
  en: {
    intro: "Click to view the specific usage method and precautions.",
    manage_profile: {
      label: "Manage Profile",
      $option4: [
        "Read Profile",
        "Write Profile",
        "Reset Profile",
        "Sync Profile with Other Windows"
      ],
      help: "Please make sure that the card has at least one child card when writing the profile. Multiple child cards can share the profile together to prevent a single card from having too many words."
    }
  }
})
