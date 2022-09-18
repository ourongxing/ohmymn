import { Addon } from "~/addon"
import { ModuleKeyType } from "~/mergeMethod"

export const deepCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value))
export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr))
export function dateFormat(date: Date, fmt = "YYYY-mm-dd HH:MM") {
  let ret
  const opt = {
    "Y+": date.getFullYear().toString(),
    "m+": (date.getMonth() + 1).toString(),
    "d+": date.getDate().toString(),
    "H+": date.getHours().toString(),
    "M+": date.getMinutes().toString(),
    "S+": date.getSeconds().toString() // second
  }
  Object.entries(opt).forEach(([k, v]) => {
    ret = new RegExp("(" + k + ")").exec(fmt)
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? v : v.padStart(ret[1].length, "0")
      )
    }
  })
  return fmt
}

export function doc(module: ModuleKeyType, hash?: string) {
  return `${Addon.doc}/guide/modules/${module}.html${hash ? "#" + hash : ""}`
}

export * from "./text"
export * from "./number"
export * from "./input"
export * from "./checkInput"
