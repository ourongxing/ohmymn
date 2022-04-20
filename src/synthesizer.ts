import { ICheckMethod, IActionMethod4Text, IActionMethod4Card } from "./typings"
import lang from "./lang"
import { showHUD } from "./utils/common"
import { modules, constModules } from "./module"
import {
  AutoUtilType,
  TypeUtilFalseArray,
  TypeUtilIndexFalseArray
} from "./typings/Addon/AutoUtils"
export type ModuleKeyType =
  | keyof (typeof modules & typeof constModules)
  | "more"
type AutoModuleKeyType = Include<keyof typeof modules, "auto">
const isModuleAutoON = (key: AutoModuleKeyType) => {
  const { quickSwitch } = self.globalProfile.addon
  return (
    quickSwitch.includes(moduleKeyArray.indexOf(key)) &&
    //@ts-ignore
    (self.globalProfile[key]?.on ??
      self.docProfile[key]?.on ??
      self.notebookProfile[key] ??
      false)
  )
}

export const autoUtils = (() => {
  try {
    const res = Object.entries(modules).reduce((acc, [key, module]) => {
      for (const k of module.settings) {
        if (k.key === "on") {
          Object.entries(k.auto).forEach(([k, v]) => {
            acc[k] = [
              ...(acc[k] ?? []),
              "index" in v
                ? {
                    index: v.index,
                    method: async (...rest: Parameters<typeof v.method>) =>
                      // @ts-ignore
                      isModuleAutoON(key) && (await v.method(...rest))
                  }
                : {
                    index: 0,
                    // @ts-ignore
                    method: async (...rest: Parameters<typeof v>) =>
                      // @ts-ignore
                      isModuleAutoON(key) && (await v(...rest))
                  }
            ]
          })
          break
        }
      }
      return acc
    }, {} as TypeUtilIndexFalseArray<AutoUtilType>)
    return Object.entries(res).reduce((acc, [k, v]) => {
      acc[k] = v.sort((a, b) => a.index - b.index).map(k => k.method)
      return acc
    }, {} as TypeUtilFalseArray<AutoUtilType>)
  } catch (err) {
    console.error(err)
    return {}
  }
})()

export const moduleKeyArray = Object.keys(modules) as ModuleKeyType[]
export const isModuleON = (key: ModuleKeyType): boolean => {
  const { quickSwitch } = self.globalProfile.addon
  const index = moduleKeyArray.indexOf(key)
  return index === -1 || quickSwitch.includes(index)
}
const checkers = Object.values({ ...constModules, ...modules }).reduce(
  (acc, cur) => {
    cur.settings.forEach(k => {
      if ("check" in k) {
        acc[k.key] = k["check"]!
      }
    })
    cur.actions4card?.forEach(k => {
      if ("check" in k) {
        acc[k.key] = k["check"]!
      }
    })
    cur.actions4text?.forEach(k => {
      if ("check" in k) {
        acc[k.key] = k["check"]!
      }
    })
    return acc
  },
  {} as Record<string, ICheckMethod>
)

export const checkInputCorrect = async (
  input: string,
  key: string
): Promise<boolean> => {
  try {
    if (checkers[key]) {
      await checkers[key]({ input })
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
    const act = module.actions4text
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
    const act = module.actions4card
    if (act?.length)
      act.forEach(k => {
        actions[k.key] = k.method
      })
  })
  return actions
})()
