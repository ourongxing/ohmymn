export const deepCopy = (value: any) => JSON.parse(JSON.stringify(value))
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

export function escapeURLParam(param: string) {
  const replaceParams = [
    [/%/g, "%25"],
    [/#/g, "%23"],
    [/&/g, "%26"],
    [/;/g, "%3B"],
    [/\+/g, "%2B"],
    [/\//g, "%2F"],
    [/\\/g, "%5C"],
    [/=/g, "%3D"],
    [/\?/g, "%3F"],
    [/\./g, "%2E"],
    [/\:/g, "%3A"]
  ] as [RegExp, string][]
  return replaceParams.reduce((acc, cur) => acc.replace(cur[0], cur[1]), param)
}

export function unescapeURLParam(param: string) {
  const replaceParams = [
    [/%25/g, "%"],
    [/%23/g, "#"],
    [/%26/g, "&"],
    [/%3B/g, ";"],
    [/%2B/g, "+"],
    [/%2F/g, "/"],
    [/%5C/g, "\\"],
    [/%3D/g, "="],
    [/%3F/g, "?"],
    [/%2E/g, "."],
    [/%3A/g, ":"]
  ] as [RegExp, string][]
  return replaceParams.reduce((acc, cur) => acc.replace(cur[0], cur[1]), param)
}

export * from "./popup"
export * from "./text"
export * from "./number"
export * from "./input"
export * from "./network"
export * from "./note"
export * from "./profile"
export * from "./checkInput"
export * from "./common"
