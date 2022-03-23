const deepCopy = (value: any) => JSON.parse(JSON.stringify(value))
const unique = <T>(arr: T[]): T[] => Array.from(new Set(arr))
const dateFormat = (date: Date, fmt = "YYYY-mm-dd HH:MM") => {
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
export { deepCopy, unique, dateFormat }
