import { openURL } from "marginnote"
import { defineConfig } from "~/profile"
import { CellViewType } from "~/typings"
import lang from "./lang"

export default defineConfig({
  intro: lang.intro,
  name: "MagicAction",
  key: "magicaction",
  link: "https://ohmymn.marginnote.cn/dev/",
  settings: [],
  actions: [
    {
      key: "manageProfile",
      type: CellViewType.Button,
      label: lang.manage_profile.label,
      option: lang.manage_profile.$option4,
      help: lang.manage_profile.help,
      method: () => {
        //
      }
    },
    {
      key: "openDoc",
      type: CellViewType.Button,
      label: "打开开发文档",
      method() {
        openURL("https://ohmymn.marginnote.cn/dev/")
      }
    }
  ]
})
