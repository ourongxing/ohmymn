import { lang } from "./lang"
import { IDocProfile } from "profile"
import type { IConfig } from "typings"
import { CellViewType } from "typings/enum"

const configs: IConfig<"magicaction4text"> = {
  name: "MagicAction for Text",
  key: "magicaction4text",
  intro: lang.intro,
  settings: [
    {
      key: "preOCR",
      type: CellViewType.Switch,
      label: lang.label.preOCR,
      help: lang.help.preOCR
    }
  ]
}

const magicaction4text = { configs }
export default magicaction4text
