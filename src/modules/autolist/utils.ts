import { regFlag } from "~/utils/input"
import { SerialCode } from "~/utils/number"
import { isHalfWidth } from "~/utils/text"
import { AutoListPreset } from "./typings"

export function addLineBreak(text: string): string {
  const { preset } = self.globalProfile.autolist
  if (preset.includes(AutoListPreset.Custom)) {
    const { customList: params } = self.tempProfile.replaceParam
    if (params)
      for (const param of params) {
        param.regexp = regFlag.add(param.regexp, "g")
        const len = text.match(param.regexp)?.length
        if (len && len > 1) {
          return addNumber(
            text
              .replace(param.regexp, param.newSubStr)
              .replace(/\n{2,}/g, "\n")
              .trim(),
            param.fnKey
          )
        }
      }
  }
  return (
    ((text: string) => {
      for (const set of preset.filter(k => k !== AutoListPreset.Custom)) {
        switch (set) {
          case AutoListPreset.Letter:
            if (isHalfWidth(text)) continue
            const param: [RegExp, string] = [/\s*([A-Za-z][.、，,])/g, "\n$1"]
            const len = text.match(param[0])?.length
            if (len && len > 1) return text.replace(param[0], param[1])
            break
          default: {
            const params: [RegExp, string][] = [
              [
                new RegExp(
                  `\s*([其第]?[${SerialCode.chinese_number}]{1,2}[.、，,])|\s*([其第][${SerialCode.chinese_number}]{1,2}是?[.、，,]?)`,
                  "g"
                ),
                "\n$1$2"
              ],
              [
                /\s*([\(（【\[]?\s*[0-9]{1,2}\s*[\)）\]】]?[.、，,]\D)|\s*([\(（【\[]\s*[0-9]{1,2}\s*[\)）\]】][.、，,]?)/g,
                "\n$1$2"
              ]
            ]
            const param = params[set - 2]
            const len = text.match(param[0])?.length
            if (len && len > 1) return text.replace(param[0], param[1])
            break
          }
        }
      }
    })(text)
      ?.replace(/\n{2,}/g, "\n")
      .trim() ?? text
  )
}

export function addNumber(text: string, fnKey: number): string {
  if (fnKey === 0) return text
  let index = 1
  return text.replace(/^/gm, k => {
    return `${index++}. ${k}`
  })
}
