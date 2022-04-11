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
import autocomment from "modules/autocomment"
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
  autocomment
}

export const utils: Utils = {
  customOCR: [
    imgBase64 => isModuleAutoON("autoocr") && autoocr.utils.main(imgBase64)
  ],
  modifyExcerptText: [
    (note, text) =>
      isModuleAutoON("autostandardize") &&
      autostandardize.utils.main(note, text),
    (note, text) =>
      isModuleAutoON("autolist") && autolist.utils.main(note, text),
    (note, text) =>
      isModuleAutoON("autoreplace") && autoreplace.utils.main(note, text)
  ],
  generateTitles: [
    (note, text) =>
      isModuleAutoON("autocomplete") && autocomplete.utils.main(note, text),
    (note, text) =>
      isModuleAutoON("anotherautodef") && anotherautodef.utils.main(note, text),
    (note, text) =>
      isModuleAutoON("anotherautotitle") &&
      anotherautotitle.utils.main(note, text)
  ],
  generateComments: [
    (note, text) =>
      isModuleAutoON("autotranslate") && autotranslate.utils.main(note, text),
    (note, text) =>
      isModuleAutoON("autocomment") && autocomment.utils.main(note, text)
  ],
  modifyTitles: [
    titles =>
      isModuleAutoON("autostandardize") &&
      self.profile.autostandardize.standardizeTitle &&
      titles.map(k => autostandardize.utils.toTitleCase(k))
  ],
  generateTags: [
    (note, text) => isModuleAutoON("autotag") && autotag.utils.main(note, text)
  ],
  modifyStyle: [
    note => isModuleAutoON("autostyle") && autostyle.utils.main(note)
  ]
}

export const constModules = { addon, magicaction4card, magicaction4text }
export const moduleKeyArray = Object.keys(modules) as ModuleKeyType[]

export const isModuleON = (key: ModuleKeyType): boolean => {
  const { quickSwitch } = self.profile.addon
  const index = moduleKeyArray.indexOf(key)
  return index === -1 || quickSwitch.includes(index)
}

const isModuleAutoON = (key: AutoModuleKeyType) => {
  const { quickSwitch } = self.profile.addon
  return (
    quickSwitch.includes(moduleKeyArray.indexOf(key)) &&
    //@ts-ignore
    (self.profile[key]?.on ?? self.docProfile[key]?.on ?? false)
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
      const res = await checker({ input, key })
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

type Utils = {
  customOCR?: ((
    imgBase64: string
  ) => MaybePromise<string | undefined | false>)[]
  modifyExcerptText?: ((
    note: MbBookNote,
    text: string
  ) => MaybePromise<string | false>)[]
  generateTitles?: ((
    note: MbBookNote,
    text: string
  ) => MaybePromise<
    { title: string[]; text: string; comments?: string[] } | undefined | false
  >)[]
  generateTags?: ((
    note: MbBookNote,
    text: string
  ) => MaybePromise<string[] | false>)[]
  generateComments?: ((
    note: MbBookNote,
    text: string
  ) => MaybePromise<string[] | false>)[]
  modifyTitles?: ((titles: string[]) => MaybePromise<string[] | false>)[]
  modifyStyle?: ((
    note: MbBookNote
  ) => MaybePromise<
    { color: number | undefined; style: number | undefined } | false
  >)[]
}

export type ModuleKeyType =
  | keyof (typeof modules & typeof constModules)
  | "more"
type AutoModuleKeyType = Include<keyof typeof modules, "auto">
