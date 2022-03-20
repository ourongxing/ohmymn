import { profilePreset } from "profile"
import type { IConfig } from "typings"
import { CellViewType } from "typings/enum"

const profileTemp = {
  ...profilePreset.magicaction4text
}

const configs: IConfig<typeof profileTemp, AnyProperty<string>> = {
  name: "MagicAction for Text",
  key: "magicaction4text",
  intro: "所有动作均需要在文档中选中文字或框选选区",
  settings: [
    {
      key: "preOCR",
      type: CellViewType.Switch,
      label: "预先 OCR"
    }
  ]
}

const magicaction4text = { configs }
export default magicaction4text
