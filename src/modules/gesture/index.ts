import { defineConfig, IAllProfile } from "~/profile"
import { CellViewType, ISettingSelect } from "~/typings"
import { doc, reverseEscape } from "~/utils"
import lang from "./lang"

export default defineConfig({
  name: "Gesture",
  key: "gesture",
  intro: lang.intro,
  link: doc("gesture"),
  settings: [
    {
      key: "selectionBarY",
      type: CellViewType.Input,
      help: lang.selection_bar_y.help,
      link: lang.selection_bar_y.link,
      check({ input }) {
        input = reverseEscape(input)
        if (!Array.isArray(input)) throw lang.selection_bar_y.input_array
        if (input.length !== 2) throw lang.selection_bar_y.input_two_number
        if (input.some(item => !Number.isInteger(item)))
          throw lang.selection_bar_y.enter_positive
      }
    },
    {
      key: "showY",
      type: CellViewType.Switch,
      label: lang.show_y.label,
      help: lang.show_y.help
    },
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
              if (!input.startsWith("marginnote3app://addon"))
                throw lang.only_mn
            }
          }
        ])
      })
      .flat(Infinity) as ISettingSelect<IAllProfile["gesture"]>[])
  ]
})
