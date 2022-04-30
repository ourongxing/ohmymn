import { CellViewType } from "@/typings/enum"
import { defineConfig } from "@/utils"
import { lang } from "./lang"

export default defineConfig({
  name: "MagicAction for Text",
  key: "magicaction4text",
  intro: lang.intro,
  settings: [
    {
      key: "preOCR",
      type: CellViewType.Switch,
      label: lang.label.preOCR,
      help: lang.help.preOCR
    }
  ]
})
