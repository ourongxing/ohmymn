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
      key: "openDoc",
      type: CellViewType.Button,
      label: "打开开发文档",
      method() {
        openURL("https://ohmymn.marginnote.cn/dev/")
      }
    }
  ]
})
