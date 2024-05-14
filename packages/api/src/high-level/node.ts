import type { NoteComment, MbBookNote, MNPic } from "src/low-level"
import { MN } from "./mn"
import { unique } from "./utils"

/**
 * Get picture base64 code wrapped in html and markdown
 * @param pic `MNPic`
 * @returns
 * - html: `<img class="MNPic" src="data:image/jpeg;base64,${base64}"/>`
 * - md: `![MNPic](data:image/jpeg;base64,${base64})`
 */
export function exportPic(pic: MNPic) {
  const base64 = MN.db.getMediaByHash(pic.paint)?.base64Encoding()
  if (base64)
    return {
      html: `<img class="MNPic" src="data:image/jpeg;base64,${base64}"/>`,
      md: `![MNPic](data:image/jpeg;base64,${base64})`
    }
}

function getNoteExcerptTextPic(note: MbBookNote) {
  const acc = {
    ocr: [] as string[],
    html: [] as string[],
    md: [] as string[]
  }
  const text = note.excerptText?.trim()
  if (note.excerptPic) {
    const imgs = exportPic(note.excerptPic)
    if (imgs)
      Object.entries(imgs).forEach(([k, v]) => {
        if (k in acc) acc[k as keyof typeof acc].push(v)
      })
    if (text) {
      acc.ocr.push(text)
    }
  } else {
    if (text) {
      Object.values(acc).forEach(k => k.push(text))
    }
  }
  return acc
}

/**
 * NodeNote is a class that represents a node in the mindmap. It's also the excerpted note.
 */
export class NodeNote {
  public note: MbBookNote
  constructor(note: MbBookNote, notebookid?: string) {
    this.note = note
    if (MN.isMN4) {
      notebookid = notebookid ?? note.notebookId
      const nodeid =
        notebookid &&
        note.realGroupNoteIdForTopicId &&
        note.realGroupNoteIdForTopicId(notebookid)
      if (nodeid) {
        const _note = MN.db.getNoteById(nodeid)
        // 这种方式获取到的 nodeid 始终是不一样的，但是只有 nodeid 不一样，可以通过 createDate 来判断是否是同一个节点
        if (_note && _note.createDate.getTime() !== note.createDate.getTime())
          this.note = _note
      }
    } else {
      const nodeid = note.groupNoteId
      if (nodeid) {
        const _note = MN.db.getNoteById(nodeid)
        if (_note) this.note = _note
      }
    }
  }
  static getSelectedNodes() {
    const MindMapNodes: any[] | undefined =
      MN.notebookController.mindmapView.selViewLst
    return MindMapNodes?.length
      ? MindMapNodes.map(item => new NodeNote(item.note.note))
      : []
  }
  get nodeId() {
    return this.note.noteId
  }
  get descendantNodes() {
    const { childNodes } = this
    if (!childNodes.length) {
      return {
        descendant: [] as NodeNote[],
        treeIndex: [] as number[][]
      }
    } else {
      function down(
        nodes: NodeNote[],
        level = 0,
        lastIndex = [] as number[],
        ret = {
          descendant: [] as NodeNote[],
          treeIndex: [] as number[][]
        }
      ) {
        level++
        nodes.forEach((node, index) => {
          ret.descendant.push(node)
          lastIndex = lastIndex.slice(0, level - 1)
          lastIndex.push(index)
          ret.treeIndex.push(lastIndex)
          if (node.childNodes?.length) {
            down(node.childNodes, level, lastIndex, ret)
          }
        })
        return ret
      }
      return down(childNodes)
    }
  }
  get ancestorNodes() {
    function up(node: NodeNote, ancestorNodes: NodeNote[]) {
      if (node.note.parentNote) {
        const parentNode = new NodeNote(node.note.parentNote)
        ancestorNodes = up(parentNode, [...ancestorNodes, parentNode])
      }
      return ancestorNodes
    }
    return up(this, [])
  }
  get childNodes() {
    return this.note.childNotes?.map(k => new NodeNote(k)) ?? []
  }
  get parentNode() {
    return this.note.parentNote && new NodeNote(this.note.parentNote)
  }
  get notes() {
    return this.note.comments.reduce(
      (acc, cur) => {
        cur.type == "LinkNote" && acc.push(MN.db.getNoteById(cur.noteid)!)
        return acc
      },
      [this.note]
    )
  }
  get titles() {
    return unique(this.note.noteTitle?.split(/\s*[;；]\s*/) ?? [], true)
  }
  set titles(titles: string[]) {
    const newTitle = unique(titles, true).join("; ")
    if (this.note.excerptText === this.note.noteTitle) {
      this.note.noteTitle = newTitle
      this.note.excerptText = newTitle
    } else {
      this.note.noteTitle = newTitle
    }
  }
  get isOCR() {
    if (this.note.excerptPic?.paint) {
      return this.note.textFirst
    }
  }
  get title() {
    return this.note.noteTitle ?? ""
  }
  set title(title: string) {
    this.note.noteTitle = title
  }
  get mainExcerptText() {
    return this.note.excerptText ?? ""
  }
  set mainExcerptText(text: string) {
    this.note.excerptText = text
  }
  /**
   * append titles as much as you want
   */
  appendTitles(...titles: string[]) {
    const newTitle = unique([...this.titles, ...titles], true).join("; ")
    if (this.note.excerptText === this.note.noteTitle) {
      this.note.noteTitle = newTitle
      this.note.excerptText = newTitle
    } else {
      this.note.noteTitle = newTitle
    }
    return this
  }
  /**
   * get all tags, without `#`
   */
  get tags() {
    const tags = this.note.comments.reduce((acc, cur) => {
      if (cur.type == "TextNote" && cur.text.startsWith("#")) {
        acc.push(...cur.text.split(/\s+/).filter(k => k.startsWith("#")))
      }
      return acc
    }, [] as string[])
    return tags.map(k => k.slice(1))
  }
  /**
   * set tags, will remove all old tags
   */
  set tags(tags: string[]) {
    this.tidyupTags()
    tags = unique(tags, true)
    const lastComment = this.note.comments[this.note.comments.length - 1]
    if (lastComment?.type == "TextNote" && lastComment.text.startsWith("#")) {
      this.note.removeCommentByIndex(this.note.comments.length - 1)
    }
    this.appendTextComments(tags.map(k => `#${k}`).join(" "))
  }
  /**
   * append tags as much as you want
   */
  appendTags(...tags: string[]) {
    this.tidyupTags()
    tags = unique([...this.tags, ...tags], true)
    const lastComment = this.note.comments[this.note.comments.length - 1]
    if (lastComment?.type == "TextNote" && lastComment.text.startsWith("#")) {
      this.note.removeCommentByIndex(this.note.comments.length - 1)
    }
    this.appendTextComments(tags.map(k => `#${k}`).join(" "))
    return this
  }
  /**
   * make sure tags are in the last comment
   */
  tidyupTags() {
    const existingTags: string[] = []
    const tagCommentIndex: number[] = []
    this.note.comments.forEach((comment, index) => {
      if (comment.type == "TextNote" && comment.text.startsWith("#")) {
        const tags = comment.text.split(" ").filter(k => k.startsWith("#"))
        existingTags.push(...tags.map(tag => tag.slice(1)))
        tagCommentIndex.unshift(index)
      }
    })

    tagCommentIndex.forEach(index => {
      this.note.removeCommentByIndex(index)
    })

    this.appendTextComments(
      unique(existingTags)
        .map(k => `#${k}`)
        .join(" ")
    )
    return this
  }
  /**
   * get comment index by comment
   */
  getCommentIndex(comment: MbBookNote | string) {
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      const _comment = comments[i]
      if (typeof comment == "string") {
        if (_comment.type == "TextNote" && _comment.text == comment) return i
      } else if (
        _comment.type == "LinkNote" &&
        _comment.noteid == comment.noteId
      )
        return i
    }
    return -1
  }
  get excerptsTextPic() {
    return this.notes.reduce(
      (acc, cur) => {
        Object.entries(getNoteExcerptTextPic(cur)).forEach(([k, v]) => {
          if (k in acc) acc[k as keyof typeof acc].push(...v)
        })
        return acc
      },
      {
        ocr: [] as string[],
        html: [] as string[],
        md: [] as string[]
      }
    )
  }
  get commentsTextPic() {
    return this.note.comments.reduce(
      (acc, cur) => {
        if (cur.type === "PaintNote") {
          const imgs = exportPic(cur)
          if (imgs)
            Object.entries(imgs).forEach(([k, v]) => {
              if (k in acc) acc[k as keyof typeof acc].push(v)
            })
        } else if (cur.type == "TextNote" || cur.type == "HtmlNote") {
          const text = cur.text.trim()
          if (text && !text.includes(MN.scheme) && !text.startsWith("#"))
            Object.values(acc).map(k => k.push(text))
        }
        return acc
      },
      {
        html: [] as string[],
        md: [] as string[]
      }
    )
  }
  get excerptsText() {
    return this.notes.reduce((acc, note) => {
      const text = note.excerptText?.trim()
      if (text) {
        if (!note.excerptPic?.paint || this.isOCR) {
          acc.push(text)
        }
      }
      return acc
    }, [] as string[])
  }
  /**
   * get all comment text
   */
  get commentsText() {
    return this.note.comments.reduce((acc, cur) => {
      if (cur.type == "TextNote" || cur.type == "HtmlNote") {
        const text = cur.text.trim()
        if (text && !text.includes(MN.scheme) && !text.startsWith("#"))
          acc.push(text)
      }
      return acc
    }, [] as string[])
  }
  /**
   * get all text and pic note will be OCR or be transformed to base64
   */
  get allTextPic() {
    const retVal = getNoteExcerptTextPic(this.note)
    this.note.comments.forEach(k => {
      if (k.type === "PaintNote") {
        const imgs = exportPic(k)
        if (imgs)
          Object.entries(imgs).forEach(([k, v]) => {
            if (k in retVal) retVal[k as keyof typeof retVal].push(v)
          })
      } else if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text) Object.values(retVal).map(k => k.push(text))
      } else if (k.type == "LinkNote") {
        const note = MN.db.getNoteById(k.noteid)
        if (note)
          Object.entries(getNoteExcerptTextPic(note)).forEach(([k, v]) => {
            if (k in retVal) retVal[k as keyof typeof retVal].push(...v)
          })
      }
    })
    return {
      html: retVal.html.join("\n\n"),
      ocr: retVal.ocr.join("\n\n"),
      md: retVal.md.join("\n\n")
    }
  }
  /**
   * Get all text
   */
  get allText() {
    const { mainExcerptText } = this
    const retVal =
      mainExcerptText && (!this.note.excerptPic?.paint || this.isOCR)
        ? [mainExcerptText]
        : []
    this.note.comments.forEach(k => {
      if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text) retVal.push(text)
      } else if (k.type == "LinkNote") {
        const note = MN.db.getNoteById(k.noteid)
        const text = note?.excerptText?.trim()
        if (text && (!note?.excerptPic?.paint || this.isOCR)) retVal.push(text)
      }
    })
    return retVal.join("\n\n")
  }
  /**
   * Get all text.
   */
  get excerptsCommentsText() {
    const { mainExcerptText } = this
    const retVal =
      mainExcerptText && (!this.note.excerptPic?.paint || this.isOCR)
        ? [mainExcerptText]
        : []
    this.note.comments.forEach(k => {
      if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text && !text.includes(MN.scheme) && !text.startsWith("#"))
          retVal.push(text)
      } else if (k.type == "LinkNote") {
        const note = MN.db.getNoteById(k.noteid)
        const text = note?.excerptText?.trim()
        if (text && (!note?.excerptPic?.paint || this.isOCR)) retVal.push(text)
      }
    })
    return retVal
  }
  /**
   * Append text comments as much as you want.
   * @example
   * node.appendTextComments("a", "b", "c")
   */
  appendTextComments(...comments: string[]) {
    comments = unique(comments, true)
    const existComments = this.note.comments.filter(k => k.type === "TextNote")
    comments.forEach(comment => {
      if (
        comment &&
        existComments.every(k => k.type === "TextNote" && k.text !== comment)
      ) {
        this.note.appendTextComment(comment)
      }
    })
    return this
  }
  appendMarkdownComments(...comments: string[]) {
    comments = unique(comments, true)
    const existComments = this.note.comments.filter(k => k.type === "TextNote")
    comments.forEach(comment => {
      if (
        comment &&
        existComments.every(k => k.type === "TextNote" && k.text !== comment)
      ) {
        if (this.note.appendMarkdownComment)
          this.note.appendMarkdownComment(comment)
        else this.note.appendTextComment(comment)
      }
    })
    return this
  }
  /**
   * Remove all comment but tag, link and also the filterd. And tags and links will be sat at the end。
   * @param filter not deleted
   * @param f call a function after deleted, before set tag and link
   */
  async removeCommentButLinkTag(
    // 不删除
    filter: (comment: NoteComment) => boolean,
    f?: (node: NodeNote) => Promise<void> | void
  ) {
    const { removedIndex, linkTags } = this.note.comments.reduce(
      (acc, comment, i) => {
        if (
          comment.type == "TextNote" &&
          (comment.text.includes(MN.scheme + "://note/") ||
            comment.text.startsWith("#"))
        ) {
          acc.linkTags.push(comment.text)
          acc.removedIndex.unshift(i)
        } else if (!filter(comment)) acc.removedIndex.unshift(i)
        return acc
      },
      {
        removedIndex: [] as number[],
        linkTags: [] as string[]
      }
    )
    removedIndex.forEach(k => {
      this.note.removeCommentByIndex(k)
    })
    f && (await f(this))
    this.appendTextComments(...linkTags)
    return this
  }
}
