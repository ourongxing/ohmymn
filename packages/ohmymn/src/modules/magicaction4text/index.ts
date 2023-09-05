import { CellViewType } from "~/typings"
import { defineConfig } from "~/profile"
import { doc } from "~/utils"
import lang from "./lang"

export default defineConfig({
  name: "MagicAction for Text",
  key: "magicaction4text",
  link: doc("magicaction4text"),
  intro: lang.intro,
  settings: [
    {
      key: "preOCR",
      type: CellViewType.Switch,
      label: lang.pre_OCR.label,
      help: lang.pre_OCR.help,
      bind: ["quickSwitch", 12]
    },
    {
      key: "preSimplify",
      type: CellViewType.Switch,
      label: lang.pre_simplify.label,
      help: lang.pre_simplify.help,
      bind: ["quickSwitch", 15]
    },
    {
      key: "preFormat",
      type: CellViewType.Switch,
      label: lang.pre_format.label,
      help: lang.pre_format.help,
      bind: ["quickSwitch", 5]
    },
    {
      key: "showCopyContent",
      type: CellViewType.Switch,
      label: lang.show_copy_content.label
    },
    {
      key: "noteOptions",
      type: CellViewType.MuiltSelect,
      label: lang.note_options.label,
      help: lang.note_options.help,
      option: lang.note_options.$option6
    }
  ],
  actions4text: [
    {
      type: CellViewType.Button,
      key: "copyText",
      label: lang.copy_text,
      method({ text }) {
        return text
      }
    }
  ]
})
