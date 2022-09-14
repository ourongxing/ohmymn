import { CellViewType } from "~/enum"
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
      label: lang.pre_OCR.label,
      help: lang.pre_OCR.help
    },
    {
      key: "preSimplify",
      type: CellViewType.Switch,
      label: lang.pre_simplify.label,
      help: lang.pre_simplify.help
    },
    {
      key: "noteOptions",
      type: CellViewType.MuiltSelect,
      label: lang.note_options.label,
      help: lang.note_options.help,
      option: lang.note_options.$option6
    }
  ]
})
