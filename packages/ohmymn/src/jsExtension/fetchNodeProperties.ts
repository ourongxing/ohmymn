import type { MbBookNote } from "marginnote"
import { getDocURL, getLocalDataByKey, NodeNote } from "marginnote"
import { dateFormat } from "~/utils"
import Mustache from "~/utils/third party/mustache"
import { oldFunc } from "./mustacheFunc"

/** undefine can be auto hidden when using Mustache */
const undefine2undefine = (v: any, f: (t: any) => any) => {
  if (!v) return undefined
  if (Array.isArray(v) && v.length === 0) return undefined
  const res = f(v)
  if (!res) return undefined
  if (Array.isArray(res) && res.length === 0) return undefined
  return res
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
    MN.error(e)
  } finally {
    return self.metadata.data
  }
}

export const fetchNodeProperties = (node: NodeNote, template: string) => {
  /** Reduce unnecessary memory consumption */
  const isRequire = (key: string) => template.includes(key)
  const nodeNote = node.note
  return {
    ...oldFunc,
    titles:
      isRequire("titles") &&
      undefine2undefine(nodeNote.noteTitle, t => t.split(/\s*[;；]\s*/)),
    id: isRequire("id") && nodeNote.noteId,
    url: isRequire("url") && {
      pure: undefine2undefine(nodeNote.noteId, t => `${MN.scheme}://note/` + t),
      md: undefine2undefine(
        nodeNote.noteId,
        t => `[${nodeNote.noteTitle ?? "MarginNote"}](${MN.scheme}://note/${t}`
      ),
      html: undefine2undefine(
        nodeNote.noteId,
        t =>
          `<a href="${MN.scheme}://note/${t}" class="MNLink">${
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
    /**
     * @deprecated use `date` instead
     */
    time: isRequire("time.") && {
      creat: undefine2undefine(nodeNote.createDate, dateFormat),
      modify: undefine2undefine(nodeNote.modifiedDate, dateFormat),
      now: dateFormat(new Date())
    },
    date: isRequire("date.") && {
      create: undefine2undefine(nodeNote.createDate, dateFormat),
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
        pure: undefine2undefine(
          nodeNote.docMd5 &&
            nodeNote.notebookId &&
            getDocURL(nodeNote.docMd5, nodeNote.notebookId, nodeNote.startPage),
          t => t
        ),
        md: undefine2undefine(
          nodeNote.docMd5 &&
            nodeNote.notebookId &&
            getDocURL(nodeNote.docMd5, nodeNote.notebookId, nodeNote.startPage),
          t =>
            `[${
              nodeNote.docMd5
                ? MN.db.getDocumentById(nodeNote.docMd5)?.docTitle ??
                  "MarginNote"
                : "MarginNote"
            }](${MN.scheme}://note/${t}`
        ),
        html: undefine2undefine(
          nodeNote.docMd5 &&
            nodeNote.notebookId &&
            getDocURL(nodeNote.docMd5, nodeNote.notebookId, nodeNote.startPage),
          t =>
            `<a href="${MN.scheme}://note/${t}" class="MNDoc">${
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
          t => `${MN.scheme}://notebook/` + t
        ),
        md: undefine2undefine(
          nodeNote.notebookId,
          t =>
            `[${
              undefine2undefine(
                nodeNote.notebookId,
                t => MN.db.getNotebookById(t)?.title
              ) ?? "MarginNote"
            }](${MN.scheme}://notebook/${t}`
        ),
        html: undefine2undefine(
          nodeNote.notebookId,
          t =>
            `<a href="${MN.scheme}://notebook/${t}" class="MNNotebookUrl">${
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
): string => {
  if (!/{{.+}}/.test(template)) return template
  const isRequire = (key: string) => template.includes(key)
  try {
    // @ts-ignore
    return Mustache.render(template, {
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
    MN.error(err)
    return template
  }
}
