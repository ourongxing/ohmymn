import { MN, showHUD } from "marginnote"
import { optionalModules, requiredModules } from "./modules"
import type {
  AutoUtilType,
  TypeUtilArray,
  TypeUtilIndexArray,
  ICheckMethod,
  IActionMethod4Text,
  IActionMethod4Card
} from "./typings"
import type { IAllProfile } from "./profile"

export type AllModuleKeyUnion = Exclude<keyof IAllProfile, "additional">
export type DataSourceSectionKeyUnion = AllModuleKeyUnion | "more"
export type OptionalModuleKeyUnion = Exclude<
  AllModuleKeyUnion,
  "addon" | "magicaction4card" | "magicaction4text"
>
type AutoModuleKeyUnion = Include<AllModuleKeyUnion, "auto">

export const autoUtils = (() => {
  try {
    const res = Object.values(optionalModules).reduce((acc, module) => {
      for (const k of module.settings) {
        if (k.key === "on" && "auto" in k) {
          Object.entries(k.auto).forEach(([k, v]) => {
            acc[k] = [
              ...(acc[k] ?? []),
              "index" in v
                ? {
                    index: v.index,
                    status: () =>
                      isModuleAutoON(module.key as AutoModuleKeyUnion),
                    method: v.method
                  }
                : {
                    index: 0,
                    status: () =>
                      isModuleAutoON(module.key as AutoModuleKeyUnion),
                    method: v
                  }
            ]
          })
          break
        }
      }
      return acc
    }, {} as TypeUtilIndexArray<AutoUtilType>)
    return Object.entries(res).reduce((acc, [k, v]) => {
      acc[k] = v
        .sort((a, b) => a.index - b.index)
        .map(k => ({
          status: k.status,
          method: k.method
        }))
      return acc
    }, {} as TypeUtilArray<AutoUtilType>)
  } catch (err) {
    MN.error(err)
    return {}
  }
})()

export const { actions4card, actions4text, checkers } = Object.values({
  ...requiredModules,
  ...optionalModules
}).reduce(
  (acc, module) => {
    module.settings.length &&
      module.settings.forEach(k => {
        if ("check" in k) {
          acc.checkers[k.key] = k["check"]!
        }
      })
    module.actions4card?.length &&
      module.actions4card.forEach(k => {
        acc.actions4card[k.key] = k.method
        if ("check" in k) {
          acc.checkers[k.key] = k["check"]!
        }
      })
    module.actions4text?.length &&
      module.actions4text.forEach(k => {
        acc.actions4text[k.key] = k.method
        if ("check" in k) {
          acc.checkers[k.key] = k["check"]!
        }
      })
    return acc
  },
  {
    actions4card: {} as Record<string, IActionMethod4Card>,
    actions4text: {} as Record<string, IActionMethod4Text>,
    checkers: {} as Record<string, ICheckMethod>
  }
)

export const moduleKeys = Object.values(optionalModules).reduce((acc, cur) => {
  acc.push(cur.key)
  return acc
}, [] as OptionalModuleKeyUnion[])

export function isModuleON(key: OptionalModuleKeyUnion) {
  const { quickSwitch } = self.globalProfile.addon
  const index = moduleKeys.indexOf(key)
  return index === -1 || quickSwitch.includes(index)
}

export async function checkInputCorrect(
  input: string,
  key: string
): Promise<boolean> {
  try {
    if (checkers[key]) {
      await checkers[key]({ input })
    }
  } catch (err) {
    showHUD(
      err
        ? String(err)
        : MN.isZH
        ? "格式错误，请重新输入"
        : "Input errors, please re-enter",
      3
    )
    return false
  }
  return true
}

function isModuleAutoON(key: AutoModuleKeyUnion) {
  const { quickSwitch } = self.globalProfile.addon
  return (
    quickSwitch.includes(moduleKeys.indexOf(key)) &&
    //@ts-ignore
    (self.globalProfile[key]?.on ??
      self.docProfile[key]?.on ??
      self.notebookProfile[key]?.on ??
      false)
  )
}
