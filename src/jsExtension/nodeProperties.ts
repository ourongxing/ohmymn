import { render } from "utils/third party/mustache"
import { MbBookNote } from "typings"
import { dateFormat } from "utils"
import { MN } from "const"
import {
  getExcerptText,
  getAllText,
  getAllTags,
  getAllCommnets,
  removeHighlight
} from "utils/note"

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
    nohl: () => (text: string, render: (p: string) => string) =>
      removeHighlight(render(text)),
    blod: () => (text: string, render: (p: string) => string) =>
      render(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"),
    clozeSync: () => (text: string, render: (p: string) => string) =>
      render(text).replace(/\*\*(.+?)\*\*/g, "{{c1::$1}}"),
    cloze: () => (text: string, render: (p: string) => string) => {
      let index = 1
      return render(text).replace(/\*\*(.+?)\*\*/g, (_, m) => {
        return `{{c${index++}::${m}}}}`
      })
    },
    lower: () => (text: string, render: (p: string) => string) =>
      render(text).toLowerCase(),
    upper: () => (text: string, render: (p: string) => string) =>
      render(text).toUpperCase(),

    titles:
      isRequire("titles") &&
      undefine2undefine(node.noteTitle, t => t.split(/\s*[;；]\s*/)),
    id: isRequire("id") && node.noteId,
    url: isRequire("url") && {
      pure: undefine2undefine(node.noteId, t => "marginnote3app://note/" + t),
      md: undefine2undefine(
        node.noteId,
        t => `[${node.noteTitle ?? "MarginNote"}](marginnote3app://note/${t}`
      ),
      html: undefine2undefine(
        node.noteId,
        t =>
          `<a href="marginnote3app://note/${t}">${
            node.noteTitle ?? "MarginNote"
          }</a>`
      )
    },
    page: isRequire("page.") && {
      end: node.endPage,
      start: node.startPage,
      real: isRequire("real") && {
        end: undefine2undefine(
          node.endPage,
          t => t + Number(self.docProfile.addon.pageOffset ?? 0)
        ),
        start: undefine2undefine(
          node.startPage,
          t => t + Number(self.docProfile.addon.pageOffset ?? 0)
        )
      }
    },
    tags: isRequire("tags") && getAllTags(node, false),
    allText: isRequire("allText") && getAllText(node),
    excerpts: isRequire("excerpts.") && getExcerptText(node),
    comments: isRequire("comments.") && getAllCommnets(node),
    time: isRequire("time.") && {
      creat: undefine2undefine(node.createDate, dateFormat),
      modify: undefine2undefine(node.modifiedDate, dateFormat),
      now: dateFormat(new Date())
    },
    doc: isRequire("doc.") && {
      md5: node.docMd5,
      title: undefine2undefine(
        node.docMd5,
        t => MN.db.getDocumentById(t)?.docTitle
      ),
      path: undefine2undefine(
        node.docMd5,
        t => MN.db.getDocumentById(t)?.pathFile
      )
    },
    notebook: isRequire("notebook.") && {
      title: undefine2undefine(
        node.notebookId,
        t => MN.db.getNotebookById(t)?.title
      ),
      id: node.notebookId,
      url: isRequire("url.") && {
        pure: undefine2undefine(
          node.notebookId,
          t => "marginnote3app://notebook/" + t
        ),
        md: undefine2undefine(
          node.notebookId,
          t =>
            `[${
              undefine2undefine(
                node.notebookId,
                t => MN.db.getNotebookById(t)?.title
              ) ?? "MarginNote"
            }](marginnote3app://notebook/${t}`
        ),
        html: undefine2undefine(
          node.notebookId,
          t =>
            `<a href="marginnote3app://notebook/${t}">${
              undefine2undefine(
                node.notebookId,
                t => MN.db.getNotebookById(t)?.title
              ) ?? "MarginNote"
            }</a>`
        )
      }
    }
  }
}

export const renderTemplateOfNodeProperties = (
  node: MbBookNote,
  template: string
) => {
  if (!/{{.*}}/.test(template)) return template
  const isRequire = (key: string) => template.includes(key)
  try {
    return render(template, {
      ...getNodeProperties(node, template),
      parent:
        isRequire("parent.") &&
        undefine2undefine(node.parentNote, t => getNodeProperties(t, template)),
      children:
        isRequire("children") &&
        undefine2undefine(node.childNotes, k =>
          k.map((k: MbBookNote) => getNodeProperties(k, template))
        )
    }).trim()
  } catch (err) {
    console.log(String(err))
    return template
  }
}

export const renderTemplateOfNodePropertiesWhenExcerpt = (template: string) => {
  if (!/{{.*}}/.test(template)) return template
  if (!self.node) return template
  const isRequire = (key: string) => template.includes(key)
  try {
    return render(template, {
      ...getNodeProperties(self.node, template),
      parent:
        isRequire("parent.") &&
        undefine2undefine(self.node.parentNote, t =>
          getNodeProperties(t, template)
        ),
      children:
        isRequire("children") &&
        undefine2undefine(self.node.childNotes, k =>
          k.map((k: MbBookNote) => getNodeProperties(k, template))
        )
    }).trim()
  } catch (err) {
    console.log(String(err))
    return template
  }
}
