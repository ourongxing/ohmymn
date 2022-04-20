import { IAllProfile } from "@/profile"
import { ISettingSelect } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { defineConfig } from "@/utils/common"
import { lang } from "./lang"

const { link, intro, singleBar, muiltBar, selectionBar } = lang
export default defineConfig({
  name: "Gesture",
  key: "gesture",
  intro,
  link,
  settings: [
    [singleBar, "single"],
    [muiltBar, "muilt"],
    [selectionBar, "selection"]
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
