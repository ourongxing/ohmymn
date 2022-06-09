export const deepCopy = (value: any) => JSON.parse(JSON.stringify(value))
export const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr))
export const dateFormat = (date: Date, fmt = "YYYY-mm-dd HH:MM") => {
  let ret
  const opt = {
    "Y+": date.getFullYear().toString(), // year
    "m+": (date.getMonth() + 1).toString(), // month
    "d+": date.getDate().toString(), // day
    "H+": date.getHours().toString(), // hour
    "M+": date.getMinutes().toString(), // minute
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

export const escapeURLParam = (param: string) => {
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

export const unescapeURLParam = (param: string) => {
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
