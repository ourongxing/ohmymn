import { MN, showHUD } from "marginnote"
import { requiredModules } from "./modules"
import type { ICheckMethod, IActionMethod4Card } from "./typings"
import type { IAllProfile } from "./profile"

export type AllModuleKeyUnion = Exclude<keyof IAllProfile, "additional">
export type DataSourceSectionKeyUnion = AllModuleKeyUnion | "more"

export const { actions, checkers } = Object.values({
  ...requiredModules
}).reduce(
  (acc, module) => {
    module.settings.length &&
      module.settings.forEach(k => {
        if ("check" in k) {
          acc.checkers[k.key] = k["check"]!
        }
      })
    module.actions?.length &&
      module.actions.forEach(k => {
        acc.actions[k.key] = k.method
        if ("check" in k) {
          acc.checkers[k.key] = k["check"]!
        }
      })
    return acc
  },
  {
    actions: {} as Record<string, IActionMethod4Card>,
    checkers: {} as Record<string, ICheckMethod>
  }
)

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
