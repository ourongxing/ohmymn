import { lang } from "./lang"
import type { IConfig, ICheckMethod } from "typings"
import { CellViewType } from "typings/enum"
import { IDocProfile, IProfile } from "profile"
import { ActionKey } from "./enum"
const { link, intro, lable, option, help } = lang

const configs: IConfig<(IProfile & IDocProfile)[""], typeof ActionKey> = {
  name: "AutoX",
  intro,
  link,
  settings: [
    {
      type: CellViewType.Switch,
      key: "",
      label: ""
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      key: "action4Card",
      label: "",
      option: [],
      method: async ({ nodes, option }) => {
        console.log("")
      }
    }
  ],
  actions4text: [
    {
      type: CellViewType.Button,
      key: "action4Text",
      label: "",
      option: [],
      method: ({ text, option }) => {
        console.log("")
      }
    }
  ]
}

const utils = {
  main() {
    console.log("")
  }
}

const checker: ICheckMethod<
  PickByValue<(IProfile & IDocProfile)[""], string>
> = (input, key) => {
  switch (key) {
    default:
      return false
  }
}

const autox = { configs, utils, checker }
export default autox
