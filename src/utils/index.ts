import { Addon } from "~/addon"
import { AllModuleKeyUnion } from "~/merged"

export const deepCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value))
export const unique = <T>(arr: T[]): T[] => {
  if (arr.length <= 1) return arr
  else return Array.from(new Set(arr))
}
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

export function isURL(url: string, include = false) {
  if (include)
    return /\w+:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(
      url
    )
  else
    return /^\w+:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/.test(
      url
    )
}

export function doc(module: AllModuleKeyUnion, hash?: string) {
  return `${Addon.doc}/guide/modules/${module}.html${hash ? "#" + hash : ""}`
}

export * from "./text"
export * from "./number"
export * from "./input"
export * from "./checkInput"
