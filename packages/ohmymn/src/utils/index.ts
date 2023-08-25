import { Addon } from "~/addon"
import type { AllModuleKeyUnion } from "~/coreModule"

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

export class MyMap<K extends string | number, V> {
  private collection: { [key: string]: V } = {}
  private count: number = 0

  public size(): number {
    return this.count
  }

  public set(key: K, value: V): void {
    this.collection[key.toString()] = value
    this.count++
  }

  public has(key: K): boolean {
    return key.toString() in this.collection
  }

  public get(key: K): V | null {
    return key.toString() in this.collection
      ? this.collection[key.toString()]
      : null
  }

  public delete(key: K): void {
    if (key.toString() in this.collection) {
      delete this.collection[key.toString()]
      this.count--
    }
  }

  public values(): Array<V> {
    let result: Array<V> = []
    for (let key of Object.keys(this.collection)) {
      result.push(this.collection[key])
    }
    return result.length > 0 ? result : []
  }

  public clear(): void {
    this.collection = {}
    this.count = 0
  }
}

export * from "./checkInput"
export * from "./input"
export * from "./number"
export * from "./text"
