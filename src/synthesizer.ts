import anotherautotitle from "modules/anotherautotitle"
import magicaction4card from "modules/magicaction4card"
import autocomplete from "modules/autocomplete"
import autolist from "modules/autolist"
import autoreplace from "modules/autoreplace"
import autostandardize from "modules/autostandardize"
import anotherautodef from "modules/anotherautodef"
import autotag from "modules/autotag"
import autostyle from "modules/autostyle"
import gesture from "modules/gesture"
import copysearch from "modules/copysearch"
import addon from "modules/addon"
import magicaction4text from "modules/magicaction4text"
import { IActionMethod4Card, IActionMethod4Text, MbBookNote } from "typings"

export const constModules = { addon, magicaction4card, magicaction4text }
export const modules = {
  gesture,
  anotherautotitle,
  anotherautodef,
  autostandardize,
  autocomplete,
  autoreplace,
  autolist,
  autotag,
  autostyle,
  copysearch
}

export type ModuleKeyType =
  | keyof typeof modules
  | "magicaction4card"
  | "magicaction4text"
  | "addon"
  | "more"

export const moduleKeyArray = Object.keys(modules) as ModuleKeyType[]
type AutoModuleKeyType = Include<keyof typeof modules, "auto">

const isON = (key: AutoModuleKeyType) =>
  self.profile.addon.quickSwitch.includes(moduleKeyArray.indexOf(key)) &&
  self.profile[key].on

export const utils: {
  text?: ((text: string) => MaybePromise<string | false>)[]
  title?: ((
    text: string
  ) => MaybePromise<{ title: string[]; text: string } | undefined | false>)[]
  tag?: ((text: string) => MaybePromise<string[] | false>)[]
  style?: ((
    note: MbBookNote
  ) => MaybePromise<
    { color: number | undefined; style: number | undefined } | false
  >)[]
} = {
  text: [
    text => isON("autostandardize") && autostandardize.utils.main(text),
    text => isON("autolist") && autolist.utils.main(text),
    text => isON("autoreplace") && autoreplace.utils.main(text)
  ],
  title: [
    text => isON("autocomplete") && autocomplete.utils.main(text),
    text => isON("anotherautodef") && anotherautodef.utils.main(text),
    text => isON("anotherautotitle") && anotherautotitle.utils.main(text)
  ],
  tag: [text => isON("autotag") && autotag.utils.main(text)],
  style: [note => isON("autostyle") && autostyle.utils.main(note)]
}

export const actions4text = (() => {
  const actions = {} as AnyProperty<IActionMethod4Text>
  Object.values({ ...constModules, ...modules }).forEach(module => {
    const act = module.configs.actions4text
    if (act?.length)
      act.forEach(k => {
        actions[k.key] = k.method
      })
  })
  return actions
})()

export const actions4card = (() => {
  const actions = {} as AnyProperty<IActionMethod4Card>
  Object.values({ ...constModules, ...modules }).forEach(module => {
    const act = module.configs.actions4card
    if (act?.length)
      act.forEach(k => {
        actions[k.key] = k.method
      })
  })
  return actions
})()
