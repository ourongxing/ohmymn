import { MbBookNote } from "@/typings"
import { isHalfWidth, CJK } from "@/utils/text"
import pangu from "@/utils/third party/pangu"
import { AutoStandardizePreset } from "./typings"
import { toTitleCase } from "@/utils/third party/toTitleCase"

export function titleCase(titles: string[]) {
  const { standardizeTitle } = self.globalProfile.autostandardize
  if (!standardizeTitle) return titles
  return titles.map(title =>
    isHalfWidth(title) ? (toTitleCase(title) as string) : title
  )
}

export function standrardizeText(text: string): string {
  if (isHalfWidth(text)) return text
  const { preset } = self.globalProfile.autostandardize
  text = text.replace(/\*\*(.+?)\*\*/g, (_, match) =>
    isHalfWidth(match)
      ? `placeholder${match}placeholder`
      : `占位符${match}占位符`
  )
  for (const set of preset) {
    switch (set) {
      case AutoStandardizePreset.Custom:
        const { customStandardize: params } = self.tempProfile.replaceParam
        if (!params) continue
        params.forEach(param => {
          text = text.replace(param.regexp, param.newSubStr)
        })
        break
      case AutoStandardizePreset.RemoveAllSpace:
        text = text.replace(/\x20/g, "")
        break
      case AutoStandardizePreset.HalfToFull:
        text = pangu.toFullwidth(text)
        break
      case AutoStandardizePreset.AddSpace:
        text = pangu.spacing(text)
        break
      case AutoStandardizePreset.RemoveCHSpace:
        text = text.replace(
          new RegExp(`([${CJK}])\x20+([${CJK}])`, "g"),
          "$1$2"
        )
        break
      case AutoStandardizePreset.RemoveRepeatSpace:
        text = text.replace(/\x20{2,}/g, "\x20")
        break
    }
  }
  return text.replace(/占位符/g, "**").replace(/placeholder/g, "**")
}
