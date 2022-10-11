import { RemoveExcerpt } from "~/modules/addon/typings"
import { MbBookNote } from "~/marginnote/api"
import {
  MN,
  delayBreak,
  undoGroupingWithRefresh,
  getCommentIndex,
  addTags,
  modifyNodeTitle,
  appendTextComment
} from "~/marginnote/sdk"
import { cacheTransformer } from "~/profile"
import {
  customOCR,
  newTitleTextCommentTag,
  newColorStyle
} from "./newExcerptGenerater"

let note: MbBookNote
let nodeNote: MbBookNote
let isOCR = false
let isComment = false

export default async (_note: MbBookNote, lastExcerptText?: string) => {
  console.log("Processing Excerpt", "excerpt")
  // Initialize global variables
  note = _note
  isOCR = false
  nodeNote = note.groupNoteId ? MN.db.getNoteById(note.groupNoteId)! : note
  isComment = nodeNote !== note
  self.excerptStatus.isModify = lastExcerptText !== undefined
  if (
    self.globalProfile.addon.lockExcerpt &&
    self.excerptStatus.isModify &&
    lastExcerptText !== "😎"
  ) {
    processExcerpt({ text: lastExcerptText! })
    return console.log(
      "Locked excerpt option is detected, restore excerpt",
      "excerpt"
    )
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
        decorateExecrpt()
        return console.log("Image to text fail, no text", "ocr")
      }
    } else {
      decorateExecrpt()
      return console.log(
        "No auto-to-text option on, no image processing",
        "ocr"
      )
    }
  }

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

  decorateExecrpt()
  const excerptText = note.excerptText?.trim()
  if (!excerptText) return
  const { title, text, comments, tags } = await newTitleTextCommentTag({
    note,
    text: excerptText,
    nodeTitle: nodeNote.noteTitle?.split(/\s*[;；]\s*/),
    isComment
  })
  processExcerpt({
    text,
    title: title.join("; "),
    comments,
    tags
  })
}

const processExcerpt = ({
  text,
  title,
  tags,
  comments
}: {
  text: string
  title?: string
  tags?: string[]
  comments?: string[]
}) => {
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
          switch (removeExcerpt[0]) {
            case RemoveExcerpt.Later:
              self.excerptStatus.lastRemovedComment = { nodeNote, index, note }
              break
            case RemoveExcerpt.Now:
              self.excerptStatus.lastRemovedComment = { nodeNote, index, note }
              removeLastCommentCacheTitle()
              break
          }
        }
        if (
          isOCR &&
          nodeNote.excerptText?.trim() === nodeNote.noteTitle?.trim()
        )
          nodeNote.excerptText = title
      }
      // Excerpts can't be cleared after being OCR, otherwise the image will be displayed,
      // and must be set to the same title to not display
      else if (isOCR) note.excerptText = title
      else note.excerptText = ""
    }
    if (title) modifyNodeTitle(nodeNote, title)
    if (comments?.length) {
      const { cacheComment } = self.notebookProfile.additional
      const oldComments = cacheComment[note.noteId!]
      if (oldComments) {
        const existComments = nodeNote.comments
        const index: number[] = []
        oldComments.forEach(h => {
          existComments.forEach((k, i) => {
            if (k.type === "TextNote" && cacheTransformer.tell(h, k.text))
              index.unshift(i)
          })
        })
        index.forEach(i => {
          nodeNote.removeCommentByIndex(i)
        })
      }
      cacheComment[note.noteId!] = comments.reduce((acc, k) => {
        k && acc.push(cacheTransformer.to(k))
        return acc
      }, [] as [string, string, string][])
      appendTextComment(nodeNote, ...comments)
    }
    if (tags?.length) addTags(nodeNote, tags)
  })
}

const decorateExecrpt = async () => {
  const res = await newColorStyle(note)
  if (!res) return
  const { color, style } = res
  if (color === undefined && style == undefined) return
  undoGroupingWithRefresh(() => {
    // The default white color index is -1
    if (color !== undefined) note.colorIndex = color !== -1 ? color : 12
    if (style !== undefined) note.fillIndex = style
  })
}

export const removeLastCommentCacheTitle = () => {
  if (!self.excerptStatus.lastRemovedComment) return
  const { nodeNote, index, note } = self.excerptStatus.lastRemovedComment
  undoGroupingWithRefresh(() => {
    if (note?.excerptText) nodeNote.removeCommentByIndex(index)
  })
  self.excerptStatus.lastRemovedComment = undefined
  const noteid = note.noteId!
  const { cacheTitle, cacheComment } = self.notebookProfile.additional
  if (cacheTitle[noteid]) delete cacheTitle[noteid]
  if (cacheComment[noteid]) delete cacheComment[noteid]
}
