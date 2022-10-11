import { defineConfig, IAllProfile } from "~/profile"
import { CellViewType, ISettingSelect } from "~/typings"
import { doc } from "~/utils"
import { lang } from "./lang"

export default defineConfig({
  name: "Gesture",
  key: "gesture",
  intro: lang.intro,
  link: doc("gesture"),
  settings: [
    [lang.singleBar, "single"],
    [lang.muiltBar, "muilt"],
    [lang.selectionBar, "selection"]
  ]
    .map(q => {
      return [
        ["↑", "Up"],
        ["↓", "Down"],
        ["←", "Left"],
        ["→", "Right"]
      ].map(k => ({
        label: `${q[0]} ${k[0]}`,
        key: `${q[1]}BarSwipe${k[1]}`,
        type: CellViewType.Select,
        option: [] as string[]
      }))
    })
    .flat() as ISettingSelect<IAllProfile["gesture"]>[]
})
