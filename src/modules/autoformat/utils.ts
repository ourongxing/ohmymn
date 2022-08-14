import { CJK, notCJK } from "~/utils/text"
import pangu from "~/utils/third party/pangu"
import { AutoFormatPreset } from "./typings"
import { toTitleCase } from "~/utils/third party/toTitleCase"

export function titleCase(titles: string[]) {
  return titles.map(title =>
    /^\w+$/.test(title) ? (toTitleCase(title) as string) : title
  )
}

export function formatText(text: string): string {
  if (notCJK(text)) return text
  const { preset } = self.globalProfile.autoformat
  text = text.replace(/\*\*(.+?)\*\*/g, (_, match) =>
    notCJK(match) ? `placeholder${match}placeholder` : `占位符${match}占位符`
  )
  for (const set of preset) {
    switch (set) {
      case AutoFormatPreset.Custom:
        const { customFormat: params } = self.tempProfile.replaceParam
        if (!params) continue
        params.forEach(param => {
          text = text.replace(param.regexp, param.newSubStr)
        })
        break
      case AutoFormatPreset.RemoveAllSpace:
        text = text.replace(/\x20/g, "")
        break
      case AutoFormatPreset.HalfToFull:
        text = pangu.toFullwidth(text)
        break
      case AutoFormatPreset.AddSpace:
        text = pangu.spacing(text)
        break
      case AutoFormatPreset.RemoveCHSpace:
        text = text.replace(
          new RegExp(`([${CJK}])\x20+([${CJK}])`, "g"),
          "$1$2"
        )
        break
      case AutoFormatPreset.RemoveRepeatSpace:
        text = text.replace(/\x20{2,}/g, "\x20")
        break
    }
  }
  return text.replace(/占位符/g, "**").replace(/placeholder/g, "**")
}
