import { CellViewType } from "~/typings/enum"
import { defineConfig } from "~/profile"
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
      label: "弹出更多选项",
      help: "如果选中这段文字或区域之前，你已经选中了一段摘录的笔记。此时复制到剪贴板的动作会弹出更多选项，方便直接写入卡片中。"
    }
  ]
})
