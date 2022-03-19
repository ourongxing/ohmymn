import type { IConfig } from "typings"

const configs: IConfig<AnyProperty<string>, AnyProperty<string>> = {
  name: "MagicAction for Text",
  key: "magicaction4text",
  intro: "所有动作均需要在文档中选中文字或框选选区",
  settings: []
}

const magicaction4text = { configs }
export default magicaction4text
