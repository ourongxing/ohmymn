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
import autoocr from "modules/autoocr"
import autotranslate from "modules/autotranslate"
import export2flomo from "modules/export2flomo"
import export2anki from "modules/export2anki"
import export2devonthink from "modules/export2devonthink"
import exportoutline from "modules/exportoutline"
import type {
  IActionMethod4Card,
  IActionMethod4Text,
  ICheckMethod,
  MbBookNote
} from "typings"
import { showHUD } from "utils/common"
import lang from "lang"

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
  copysearch,
  autoocr,
  autotranslate,
  export2flomo,
  export2anki,
  export2devonthink,
  exportoutline
}

export const utils: Utils = {
  customOCR: [imgBase64 => isON("autoocr") && autoocr.utils.main(imgBase64)],
  modifyExcerptText: [
    text => isON("autostandardize") && autostandardize.utils.main(text),
    text => isON("autolist") && autolist.utils.main(text),
    text => isON("autoreplace") && autoreplace.utils.main(text)
  ],
  generateTitles: [
    text => isON("autocomplete") && autocomplete.utils.main(text),
    text => isON("autotranslate") && autotranslate.utils.main(text),
    text => isON("anotherautodef") && anotherautodef.utils.main(text),
    text => isON("anotherautotitle") && anotherautotitle.utils.main(text)
  ],
  modifyTitles: [
    titles =>
      isON("autostandardize") &&
      self.profile.autostandardize.standardizeTitle &&
      titles.map(k => autostandardize.utils.toTitleCase(k))
  ],
  generateTags: [text => isON("autotag") && autotag.utils.main(text)],
  modifyStyle: [note => isON("autostyle") && autostyle.utils.main(note)]
}

type Utils = {
  customOCR?: ((
    imgBase64: string
  ) => MaybePromise<string | undefined | false>)[]
  modifyExcerptText?: ((text: string) => MaybePromise<string | false>)[]
  generateTitles?: ((
    text: string
  ) => MaybePromise<{ title: string[]; text: string } | undefined | false>)[]
  generateTags?: ((text: string) => MaybePromise<string[] | false>)[]
  modifyTitles?: ((titles: string[]) => MaybePromise<string[] | false>)[]
  modifyStyle?: ((
    note: MbBookNote
  ) => MaybePromise<
    { color: number | undefined; style: number | undefined } | false
  >)[]
}

export const constModules = { addon, magicaction4card, magicaction4text }
export type ModuleKeyType =
  | keyof (typeof modules & typeof constModules)
  | "more"
export const moduleKeyArray = Object.keys(modules) as ModuleKeyType[]
type AutoModuleKeyType = Include<keyof typeof modules, "auto">

const isON = (key: AutoModuleKeyType) => {
  return (
    self.profile.addon.quickSwitch.includes(moduleKeyArray.indexOf(key)) &&
    //@ts-ignore
    (self.profile[key]?.on || self.docProfile[key]?.on)
  )
}

const checkers = Object.values({ ...constModules, ...modules }).reduce(
  (acc, cur) => {
    if ("checker" in cur) acc.push(cur.checker)
    return acc
  },
  [] as ICheckMethod<Record<string, any>>[]
)

export const checkInputCorrect = async (
  input: string,
  key: string
): Promise<boolean> => {
  try {
    for (const checker of checkers) {
      const res = await checker(input, key)
      if (res === undefined) return true
    }
  } catch (err) {
    showHUD(err ? String(err) : lang.input_error, 3)
    return false
  }
  return true
}

export const actions4text = (() => {
  const actions = {} as Record<string, IActionMethod4Text>
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
  const actions = {} as Record<string, IActionMethod4Card>
  Object.values({ ...constModules, ...modules }).forEach(module => {
    const act = module.configs.actions4card
    if (act?.length)
      act.forEach(k => {
        actions[k.key] = k.method
      })
  })
  return actions
})()
