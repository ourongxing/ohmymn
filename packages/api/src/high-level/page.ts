import { MN } from "./mn"
import { CGRectString2CGRect, NSValue2String } from "./nsvalue"

export function getPageContent(pageNo: number) {
  const { document } = MN.currentDocumentController
  if (!document) return ""
  const data = document.textContentsForPageNo(pageNo)
  if (!data?.length) return ""
  return data
    .reduce((acc, cur) => {
      const line = cur.reduce((a, c) => {
        a += String.fromCharCode(Number(c.char))
        return a
      }, "")
      if (line) {
        const { y } = CGRectString2CGRect(NSValue2String(cur[0].rect))
        acc.push({
          y,
          line
        })
      }
      return acc
    }, [] as { y: number; line: string }[])
    .sort((a, b) => b.y - a.y)
    .map(k => k.line)
    .join(" ")
    .trim()
}
