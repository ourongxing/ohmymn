import { MbBookNote } from "typings"
import { dateFormat } from "utils"
import { render } from "utils/third party/mustache"
import {
  getExcerptText,
  getAllText,
  getAllTags,
  getAllCommnets,
  removeHighlight
} from "utils/note"
import { MN } from "const"

/** undefine can be auto hidden when using Mustache */
const undefine2undefine = (v: any, f: (t: any) => any) => {
  if (!v) return undefined
  if (Array.isArray(v) && v.length === 0) return undefined
  const res = f(v)
  if (!res) return undefined
  if (Array.isArray(res) && res.length === 0) return undefined
  return res
}

export const getNodeProperties = (node: MbBookNote, template: string) => {
  /** Reduce unnecessary memory consumption */
  const isRequire = (key: string) => template.includes(key)
  return {
    tags: isRequire("tags") && getAllTags(node, false),
    nohl: () => (text: any, render: (arg0: any) => string) =>
      removeHighlight(render(text)),
    allText: isRequire("allText") && getAllText(node),
    excerpts: isRequire("excerpts") && getExcerptText(node),
    comments: isRequire("comments") && getAllCommnets(node),
    time: isRequire("allText") && {
      creat: undefine2undefine(node.createDate, dateFormat),
      modify: undefine2undefine(node.modifiedDate, dateFormat),
      now: dateFormat(new Date())
    },
    title: isRequire("title") && {
      note: undefine2undefine(node.noteTitle, t => t.split(/\s*[;；]\s*/)),
      doc: undefine2undefine(
        node.docMd5,
        t => MN.db.getDocumentById(t)?.docTitle
      ),
      notebook: undefine2undefine(
        node.notebookId,
        t => MN.db.getNotebookById(t)?.title
      )
    },
    link: isRequire("link") && {
      note: undefine2undefine(node.noteId, t => "marginnote3app://note/" + t),
      notebook: undefine2undefine(
        node.notebookId,
        t => "marginnote3app://notebook/" + t
      )
    }
  }
}

export const renderTemplateOfNodeProperties = (
  node: MbBookNote,
  template: string
) => {
  const isRequire = (key: string) => template.includes(key)
  try {
    return render(template, {
      ...getNodeProperties(node, template),
      parent:
        isRequire("parent") &&
        undefine2undefine(node.parentNote, t => getNodeProperties(t, template)),
      children:
        isRequire("children") &&
        undefine2undefine(node.childNotes, k =>
          k.map((k: MbBookNote) => getNodeProperties(k, template))
        )
    })
  } catch (err) {
    console.log(String(err))
    return ""
  }
}
