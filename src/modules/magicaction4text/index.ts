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
    },
    {
      key: "noteOptions",
      type: CellViewType.MuiltSelect,
      option: [
        "复制",
        "设置为标题",
        "合并标题",
        "合并到摘录",
        "设置为摘录",
        "设置为评论"
      ],
      label: "选中笔记后的选项"
    }
  ]
})
