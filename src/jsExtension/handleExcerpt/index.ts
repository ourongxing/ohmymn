import {
  delayBreak,
  getCommentIndex,
  isNoteExist,
  MbBookNote,
  MN,
  modifyNodeTitle,
  NodeNote,
  undoGroupingWithRefresh
} from "marginnote"

import { RemoveExcerpt } from "~/modules/addon/typings"
import { cacheTransformer } from "~/profile"
import { unique } from "~/utils"
import {
  customOCR,
  genCommentTag,
  modifyTitles,
  genColorStyle,
  genTitleTextCommentTag
} from "./genNewExcerpt"

// 记得初始化
let note: MbBookNote
let node: NodeNote
let nodeNote: MbBookNote
let isOCR = false
let isComment = false
let isPic = false

export default async (
  n: MbBookNote,
  isModify: boolean,
  lastExcerptText?: string
) => {
  console.log("Processing Excerpt", "excerpt")
  // Initialize global variables
  note = n
  isOCR = false
  isPic = false
  node = new NodeNote(note)
  nodeNote = node.note
  isComment = nodeNote !== note
  isComment && console.log("The Excerpt is a comment", "excerpt")
  self.excerptStatus.isModify = isModify

  if (
    self.globalProfile.addon.lockExcerpt &&
    self.excerptStatus.isModify &&
    lastExcerptText &&
    lastExcerptText !== "😎"
  ) {
    addTitleExcerpt({ text: lastExcerptText })
    return console.log("Locking excerpt is ON, restore excerpt", "excerpt")
  }

  /**
   * When will be OCR
   * 1. For the scanned version of the PDF, regardless of whether there is a text layer, even if nothing is open, will be OCR,
   * so that the text on the image can be searched when searching.
   * 2. Also, the rectangular excerpt to text automatically is essentially an online OCR, and then it will not be OCR online.
   */
  if (note.excerptPic) {
    const autoOCR =
      MN.db.getNotebookById(note.notebookId!)?.options?.autoOCRMode ?? false
    console.log("The excerpt is image", "ocr")
    if (autoOCR) {
      const success = await delayBreak(30, 0.1, () =>
        note.excerptText ? true : false
      )
      if (success) {
        console.log("Image to text success", "ocr")
        // If the PDF itself is pure text, is not the need for OCR. But other cases will call the online OCR to convert text,
        console.log(
          self.excerptStatus.OCROnline.times === 1 ? "OCR" : "not OCR",
          "ocr"
        )
        isOCR = true
      } else {
        isPic = true
        console.log("Image to text fail, no text", "ocr")
      }
    } else {
      isPic = true
      console.log("No auto-to-text option on, no image processing", "ocr")
    }
  }

  if (isPic) {
    const { tags, comments } = await genCommentTag(note, "@picture")
    addCommentTag({
      comments,
      tags
    })
  } else {
    // Indicates that the preceding rectangular excerpt to text does not use online OCR
    if (self.excerptStatus.OCROnline.times === 0) {
      self.excerptStatus.isModify &&
        (await delayBreak(
          30,
          0.01,
          () => self.excerptStatus.OCROnline.status === "begin"
        ))
      if (self.excerptStatus.OCROnline.status === "begin") {
        console.log("Online Correcting", "ocr")
        const success = await delayBreak(
          30,
          0.1,
          () => self.excerptStatus.OCROnline.status === "end"
        )
        if (success) console.log("Correct success", "ocr")
        else console.log("Correct fail", "ocr")
      }
    }

    self.excerptStatus.OCROnline = {
      times: 0,
      status: "free"
    }
    console.log("Rest OCR status", "ocr")

    const OCRContent = await customOCR()
    console.log("Custom OCR over", "ocr")
    if (OCRContent) note.excerptText = OCRContent
    const excerptText = note.excerptText?.trim()
    if (!excerptText) return
    const { title, text, comments, tags } = await genTitleTextCommentTag({
      note,
      nodeNote,
      text: excerptText,
      isComment
    })
    addTitleExcerpt({
      text,
      title: (await modifyTitles(unique(title))).join("; ")
    })
    addCommentTag({
      comments,
      tags
    })
  }

  decorateExecrpt()
}

function addTitleExcerpt({ text, title }: { text: string; title?: string }) {
  undoGroupingWithRefresh(() => {
    if (text) {
      note.excerptText = text
      if (self.excerptStatus.lastRemovedComment?.note === note)
        self.excerptStatus.lastRemovedComment = undefined
    } else {
      // as comment
      if (isComment) {
        const index = getCommentIndex(nodeNote, note)
        if (index != -1) {
          const { removeExcerpt } = self.globalProfile.addon
          self.excerptStatus.lastRemovedComment = {
            nodeNote,
            index,
            note
          }
          if (removeExcerpt[0] === RemoveExcerpt.Now) {
            removeLastComment()
          }
        }
        if (
          isOCR &&
          nodeNote.excerptText?.trim() === nodeNote.noteTitle?.trim()
        ) {
          nodeNote.excerptText = title
        }
      }

      // Excerpts can't be cleared after being OCR, otherwise the image will be displayed,
      // and must be set to the same title to not display
      else if (isOCR) note.excerptText = title
      else note.excerptText = ""
    }

    if (title) modifyNodeTitle(nodeNote, title)
  })
}

function addCommentTag({
  tags,
  comments
}: {
  tags: string[]
  comments: string[]
}) {
  if (
    self.excerptStatus.lastRemovedComment?.note === note ||
    !isNoteExist(note)
  )
    return
  undoGroupingWithRefresh(() => {
    if (comments?.length) {
      comments = unique(comments)
      const { cacheComment } = self.notebookProfile.additional
      const cachedComments = cacheComment[note.noteId!]
      if (cachedComments) {
        const existComments = node.textComments
        const indexList: number[] = []
        existComments.forEach(({ text, index }) => {
          if (cachedComments.some(k => cacheTransformer.tell(k, text)))
            indexList.unshift(index)
        })
        indexList.forEach(i => {
          nodeNote.removeCommentByIndex(i)
        })
      }
      cacheComment[note.noteId!] = comments.reduce((acc, k) => {
        k && acc.push(cacheTransformer.to(k))
        return acc
      }, [] as [string, string, string][])
      node.appendTextComments(...comments)
    }
    if (tags?.length) {
      tags = unique(tags)
      const { cacheTag } = self.notebookProfile.additional
      const cachedTags = cacheTag[note.noteId!]
      const existTags = node.tags.filter(k =>
        cachedTags?.length
          ? !cachedTags.some(h => cacheTransformer.tell(h, k))
          : true
      )
      cacheTag[note.noteId!] = tags.reduce((acc, k) => {
        k && acc.push(cacheTransformer.to(k))
        return acc
      }, [] as [string, string, string][])
      node.tags = [...existTags, ...tags]
    }
  })
}

async function decorateExecrpt() {
  if (
    self.excerptStatus.lastRemovedComment?.note === note ||
    !isNoteExist(note)
  )
    return
  const res = await genColorStyle(note)
  if (!res) return
  const { color, style } = res
  if (color === undefined && style == undefined) return
  undoGroupingWithRefresh(() => {
    // The default white color index is -1
    if (color !== undefined) note.colorIndex = color !== -1 ? color : 12
    if (style !== undefined) note.fillIndex = style
  })
}

export function removeLastComment() {
  if (!self.excerptStatus.lastRemovedComment) return
  const { nodeNote, index, note } = self.excerptStatus.lastRemovedComment
  if (isNoteExist(note) && isNoteExist(nodeNote)) {
    undoGroupingWithRefresh(() => {
      nodeNote.removeCommentByIndex(index)
    })
  }
  self.excerptStatus.lastRemovedComment = undefined
  const noteid = note.noteId!
  const { cacheTitle, cacheComment, cacheTag } = self.notebookProfile.additional
  if (cacheTitle[noteid]) cacheTitle[noteid] = undefined
  if (cacheComment[noteid]) cacheTitle[noteid] = undefined
  if (cacheTag[noteid]) cacheTitle[noteid] = undefined
}
