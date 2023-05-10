import type { IAllProfile } from "~/profile"
import type { ISettingSelect } from "~/typings"
import { CellViewType } from "~/typings"
import { defineConfig } from "~/profile"
import lang from "./lang"
import { doc } from "~/utils"

export default defineConfig({
  name: "Shortcut",
  key: "shortcut",
  intro: lang.intro,
  link: doc("shortcut"),
  settings: [
    {
      key: "shortcutPro",
      type: CellViewType.Switch,
      help: lang.shortcut_pro.help,
      label: lang.shortcut_pro.label,
      link: lang.shortcut_pro.link
    },
    ...[...Array(8).keys()].map(
      i =>
        ({
          key: `cardShortcut${i}`,
          type: CellViewType.Select,
          label: `${lang.card_shortcut} ${i + 1}`,
          option: [] as string[]
        } as ISettingSelect<IAllProfile["shortcut"]>)
    ),
    ...[...Array(4).keys()].map(
      i =>
        ({
          key: `textShortcut${i}`,
          type: CellViewType.Select,
          label: `${lang.text_shortcut} ${i + 1}`,
          option: [] as string[]
        } as ISettingSelect<IAllProfile["shortcut"]>)
    )
  ]
})
