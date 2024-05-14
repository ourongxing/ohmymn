import type { IAllProfile } from "~/profile"
import { defineConfig } from "~/profile"
import type { ISettingSelect } from "~/typings"
import { CellViewType } from "~/typings"
import { doc, reverseEscape } from "~/utils"
import lang from "./lang"

export default defineConfig({
  name: "Gesture",
  key: "gesture",
  intro: lang.intro,
  link: doc("gesture"),
  settings: [
    ...([
      [lang.single_bar, "single"],
      [lang.muilt_bar, "muilt"],
      [lang.selection_bar, "selection"]
    ]
      .map(q => {
        return [
          ["↑", "Up"],
          ["↓", "Down"],
          ["←", "Left"],
          ["→", "Right"]
        ].map(k => [
          {
            label: `${q[0]} ${k[0]}`,
            key: `${q[1]}BarSwipe${k[1]}`,
            type: CellViewType.Select,
            option: [] as string[]
          },
          {
            key: `${q[1]}BarSwipe${k[1]}Shortcut`,
            type: CellViewType.Input,
            bind: [`${q[1]}BarSwipe${k[1]}`, 1],
            check({ input }: { input: string }) {
              if (!input.startsWith(MN.scheme + "://addon")) throw lang.only_mn
            }
          }
        ])
      })
      .flat(Infinity) as ISettingSelect<IAllProfile["gesture"]>[])
  ]
})
