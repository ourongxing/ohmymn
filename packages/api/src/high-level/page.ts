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

/**
 * Get a note link as the document link.
 */
export function getDocURL(md5: string, notebookid: string, pageNo?: number) {
  const notebook = MN.db.getNotebookById(notebookid)
  if (!notebook) return `${MN.scheme}://notebook/${notebookid}`
  let noteId: string | undefined
  if (pageNo) {
    noteId = notebook?.notes?.find(
      k =>
        k.docMd5 === md5 &&
        k.modifiedDate &&
        (k.startPage === pageNo || k.endPage === pageNo)
    )?.noteId
  } else {
    noteId = notebook?.notes?.find(
      k => k.docMd5 === md5 && k.modifiedDate
    )?.noteId
  }
  return notebook
    ? `${MN.scheme}://note/${noteId}`
    : `${MN.scheme}://notebook/${notebookid}`
}
