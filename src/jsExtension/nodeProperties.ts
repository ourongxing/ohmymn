import { MbBookNote } from "typings"
import { dateFormat } from "utils"
import {
  getExcerptText,
  getAllText,
  getAllTags,
  getAllCommnets,
  getDocumentById,
  getNotebookById
} from "utils/note"

const getNodeProperties = (node: MbBookNote) => {
  /** false can be auto hidden when using Mustache */
  const undefine2false = (v: any, f: (t: any) => any) =>
    v ? f(v) ?? false : false
  const getNodeProperties = (node: MbBookNote) => ({
    /** string array */
    tags: () => getAllTags(node, false),
    allText: {
      hl: () => getAllText(node),
      nohl: () => getAllText(node, undefined, false)
    },
    /** string array */
    excerpts: {
      ocr: () => getExcerptText(node, true, "ocr"),
      base64: () => getExcerptText(node, true, "base64"),
      html: () => getExcerptText(node, true, "html"),
      md: () => getExcerptText(node, true, "md"),
      nohl: {
        ocr: () => getExcerptText(node, false, "ocr"),
        base64: () => getExcerptText(node, false, "base64"),
        html: () => getExcerptText(node, false, "html"),
        md: () => getExcerptText(node, false, "md")
      }
    },
    /** string array */
    comments: {
      nopic: () => getAllCommnets(node, "none"),
      base64: () => getAllCommnets(node, "base64"),
      html: () => getAllCommnets(node, "html"),
      md: () => getAllCommnets(node, "md")
    },
    time: {
      creat: () => undefine2false(node.createDate, dateFormat),
      modify: () => undefine2false(node.modifiedDate, dateFormat),
      now: () => dateFormat(new Date())
    },
    title: {
      /** string array */
      note: () => undefine2false(node.noteTitle, t => t.split(/\s*[;；]\s*/)),
      doc: () => undefine2false(node.docMd5, t => getDocumentById(t).docTitle),
      notebook: () =>
        undefine2false(node.notebookId, t => getNotebookById(t).title)
    },
    link: {
      note: () =>
        undefine2false(node.noteId, t => "marginnote3app://note/" + t),
      notebook: () =>
        undefine2false(node.notebookId, t => "marginnote3app://notebook/" + t)
    }
  })
  return {
    ...getNodeProperties(node),
    parentNode: undefine2false(node.parentNote, () =>
      getNodeProperties(node.parentNote!)
    ),
    childNodes: node.childNotes?.length
      ? node.childNotes.map(k => getNodeProperties(k))
      : false
  }
}

export default getNodeProperties
