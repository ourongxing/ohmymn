import type { IAllProfile } from "~/profile"
import { defineConfig } from "~/profile"
import type { ISettingSelect } from "~/typings"
import { CellViewType } from "~/typings"
import { doc } from "~/utils"
import lang from "./lang"

export default defineConfig({
  name: "Toolbar",
  key: "toolbar",
  intro: lang.intro,
  link: doc("toolbar"),
  settings: [
    ...([...Array(8).keys()]
      .map(i => [
        {
          key: `cardToolbar${i}`,
          type: CellViewType.Select,
          label: `${lang.card_toolbar} ${i + 1}`,
          option: [] as string[]
        },
        {
          key: `cardToolbar${i}Shortcut`,
          type: CellViewType.Input,
          bind: [`cardToolbar${i}`, 1],
          check({ input }: { input: string }) {
            if (!input.startsWith(MN.scheme + "://addon")) throw lang.only_mn
          }
        }
      ])
      .flat() as ISettingSelect<IAllProfile["toolbar"]>[]),
    ...([...Array(4).keys()]
      .map(i => [
        {
          key: `textToolbar${i}`,
          type: CellViewType.Select,
          label: `${lang.text_toolbar} ${i + 1}`,
          option: [] as string[]
        },
        {
          key: `textToolbar${i}Shortcut`,
          type: CellViewType.Input,
          bind: [`textToolbar${i}`, 1],
          check({ input }: { input: string }) {
            if (!input.startsWith(MN.scheme + "://addon")) throw lang.only_mn
          }
        }
      ])
      .flat() as ISettingSelect<IAllProfile["toolbar"]>[])
  ]
})
