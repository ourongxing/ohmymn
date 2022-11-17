import type { MbBookNote } from "marginnote"
import {
  getDocURL,
  getLocalDataByKey,
  NodeNote,
  removeHighlight
} from "marginnote"
import { dateFormat, getSerialInfo } from "~/utils"
import { render } from "~/utils/third party/mustache"

/** undefine can be auto hidden when using Mustache */
const undefine2undefine = (v: any, f: (t: any) => any) => {
  if (!v) return undefined
  if (Array.isArray(v) && v.length === 0) return undefined
  const res = f(v)
  if (!res) return undefined
  if (Array.isArray(res) && res.length === 0) return undefined
  return res
}

// TODO: 考虑使用 {{data | foramt: "YYYY-MM-DD"}} 的函数形式，从而支持参数
// https://github.com/jvitela/mustache-wax

const func: {
  [key: string]: () => (text: string, render: (p: string) => string) => string
} = {
  escape: () => (text, render) => encodeURIComponent(render(text)),
  nohl: () => (text, render) => removeHighlight(render(text)),
  blod: () => (text, render) =>
    render(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"),
  clozeSync: () => (text, render) =>
    render(text).replace(/\*\*(.+?)\*\*/g, "{{c1::$1}}"),
  cloze: () => (text, render) => {
    let index = 1
    return render(text).replace(/\*\*(.+?)\*\*/g, (_, m) => {
      return `{{c${index++}::${m}}}}`
    })
  },
  lower: () => (text, render) => render(text).toLowerCase(),
  upper: () => (text, render) => render(text).toUpperCase(),
  join: () => (text, render) => {
    if (text.match(/{{.+}}/g)?.length !== 1) return render(text)
    const [front, mustache, behind] = text.trimStart().split(/({{.+?}})/, 3)
    const dataArr = render(mustache).split(/; /)
    if (/\$\[.+\]/.test(front)) {
      const serialArr = getSerialInfo(front, dataArr.length, "\\$")
      return dataArr
        .map((k, i) => front.replace(/\$\[(.+)\]/, serialArr[i]) + k)
        .join(behind)
    }
    return dataArr.map(k => front + k).join(behind)
  }
}

const fetchDataFromMetadata = () => {
  try {
    if (self.metadata.lastFetch && Date.now() - self.metadata.lastFetch < 100) {
      self.metadata.lastFetch = Date.now()
    } else {
      self.metadata.lastFetch = Date.now()
      const data = getLocalDataByKey("metadata_profile_doc")?.[
        MN.currentDocmd5!
      ]
      if (data === undefined) {
        self.metadata.data = undefined
      } else {
        const { pageOffset, reference } = data.addon
        const { citeKey } = data.additional
        const metadata = JSON.parse(data.additional.data || "{}")
        self.metadata.data = {
          pageOffset,
          citeKey,
          reference,
          metadata
        }
      }
    }
  } catch (e) {
    dev.error(e)
  } finally {
    return self.metadata.data
  }
}

export const fetchNodeProperties = (node: NodeNote, template: string) => {
  /** Reduce unnecessary memory consumption */
  const isRequire = (key: string) => template.includes(key)
  const nodeNote = node.note
  return {
    ...func,
    titles:
      isRequire("titles") &&
      undefine2undefine(nodeNote.noteTitle, t => t.split(/\s*[;；]\s*/)),
    id: isRequire("id") && nodeNote.noteId,
    url: isRequire("url") && {
      pure: undefine2undefine(
        nodeNote.noteId,
        t => "marginnote3app://note/" + t
      ),
      md: undefine2undefine(
        nodeNote.noteId,
        t =>
          `[${nodeNote.noteTitle ?? "MarginNote"}](marginnote3app://note/${t}`
      ),
      html: undefine2undefine(
        nodeNote.noteId,
        t =>
          `<a href="marginnote3app://note/${t}" class="MNLink">${
            nodeNote.noteTitle ?? "MarginNote"
          }</a>`
      )
    },
    page: isRequire("page.") && {
      start: nodeNote.startPage,
      end:
        nodeNote.endPage === nodeNote.startPage ? undefined : nodeNote.endPage,
      real: isRequire("page.") && {
        start: undefine2undefine(
          nodeNote.startPage,
          k => k - Number(fetchDataFromMetadata()?.pageOffset ?? 0)
        ),
        end: undefine2undefine(nodeNote.endPage, k =>
          k === nodeNote.startPage
            ? undefined
            : k - Number(fetchDataFromMetadata()?.pageOffset ?? 0)
        )
      }
    },
    tags: isRequire("tags") && node.tags,
    allTextPic: isRequire("allTextPic") && {
      ...node.allTextPic,
      text: node.allText
    },
    excerpts: isRequire("excerpts.") && {
      ...node.excerptsTextPic,
      text: node.excerptsText
    },
    comments: isRequire("comments.") && {
      ...node.commentsTextPic,
      text: node.commentsText
    },
    time: isRequire("time.") && {
      creat: undefine2undefine(nodeNote.createDate, dateFormat),
      modify: undefine2undefine(nodeNote.modifiedDate, dateFormat),
      now: dateFormat(new Date())
    },
    doc: isRequire("doc.") && {
      md5: nodeNote.docMd5,
      title: undefine2undefine(
        nodeNote.docMd5,
        t => MN.db.getDocumentById(t)?.docTitle
      ),
      url: isRequire("url.") && {
        pure: undefine2undefine(getDocURL(), t => t),
        md: undefine2undefine(
          getDocURL(),
          t =>
            `[${
              nodeNote.docMd5
                ? MN.db.getDocumentById(nodeNote.docMd5)?.docTitle ??
                  "MarginNote"
                : "MarginNote"
            }](marginnote3app://note/${t}`
        ),
        html: undefine2undefine(
          getDocURL(),
          t =>
            `<a href="marginnote3app://note/${t}" class="MNDoc">${
              nodeNote.docMd5
                ? MN.db.getDocumentById(nodeNote.docMd5)?.docTitle ??
                  "MarginNote"
                : "MarginNote"
            }</a>`
        )
      },
      path: undefine2undefine(
        nodeNote.docMd5,
        t => MN.db.getDocumentById(t)?.pathFile
      ),
      ...(fetchDataFromMetadata() ?? {})
    },
    notebook: isRequire("notebook.") && {
      title: undefine2undefine(
        nodeNote.notebookId,
        t => MN.db.getNotebookById(t)?.title
      ),
      id: nodeNote.notebookId,
      url: isRequire("url.") && {
        pure: undefine2undefine(
          nodeNote.notebookId,
          t => "marginnote3app://notebook/" + t
        ),
        md: undefine2undefine(
          nodeNote.notebookId,
          t =>
            `[${
              undefine2undefine(
                nodeNote.notebookId,
                t => MN.db.getNotebookById(t)?.title
              ) ?? "MarginNote"
            }](marginnote3app://notebook/${t}`
        ),
        html: undefine2undefine(
          nodeNote.notebookId,
          t =>
            `<a href="marginnote3app://notebook/${t}" class="MNNotebookUrl">${
              undefine2undefine(
                nodeNote.notebookId,
                t => MN.db.getNotebookById(t)?.title
              ) ?? "MarginNote"
            }</a>`
        )
      }
    }
  }
}

export const renderTemplateOfNodeProperties = (
  node: NodeNote,
  template: string
) => {
  if (!/{{.+}}/.test(template)) return template
  const isRequire = (key: string) => template.includes(key)
  try {
    return render(template, {
      ...fetchNodeProperties(node, template),
      parent:
        isRequire("parent.") &&
        undefine2undefine(node.note.parentNote, t =>
          fetchNodeProperties(new NodeNote(t), template)
        ),
      children:
        isRequire("children") &&
        undefine2undefine(node.note.childNotes, k =>
          k.map((k: MbBookNote) =>
            fetchNodeProperties(new NodeNote(k), template)
          )
        )
    }).trim()
  } catch (err) {
    dev.error(err)
    return template
  }
}
