import { CJK, isCJK, isHalfWidth, notCJK } from "~/utils/text"
import pangu from "~/utils/third party/pangu"
import { AutoFormatPreset } from "./typings"
import { toTitleCase } from "~/utils/third party/toTitleCase"

export function titleCase(titles: string[]) {
  return titles.map(title =>
    isHalfWidth(title) ? (toTitleCase(title) as string) : title
  )
}

export function formatText(text: string): string {
  const { preset } = self.globalProfile.autoformat
  const { removeSpace } = self.docProfile.autoformat
  text = text.replace(/\*\*(.+?)\*\*/g, (_, match) =>
    notCJK(match) ? `placehder${match}placehder` : `占啊位符${match}占啊位符`
  )
  if (removeSpace) text = text.replace(/\x20/g, "")
  for (const set of preset) {
    if (set !== AutoFormatPreset.Custom && notCJK(text)) continue
    switch (set) {
      case AutoFormatPreset.Custom:
        const { customFormat: params } = self.tempProfile.replaceParam
        if (!params) continue
        params.forEach(param => {
          const { regexp, newSubStr, fnKey } = param
          /**
           * 0 默认，有中文才执行
           * 1 没有中文才执行
           * 2 任何情况都执行
           */
          if (
            (fnKey === 0 && isCJK(text)) ||
            (fnKey === 1 && notCJK(text)) ||
            fnKey >= 2
          )
            text = text.replace(regexp, newSubStr)
        })
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
  return text.replace(/占啊位符/g, "**").replace(/placehder/g, "**")
}
