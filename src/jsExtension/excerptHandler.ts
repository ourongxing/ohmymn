import { addTags, getCommentIndex, undoGroupingWithRefresh } from "utils/note"
import { delayBreak } from "utils/common"
import {
  customOCR,
  newColorStyle,
  newTag,
  newTitleText
} from "./newExcerptGenerater"
import { MbBookNote } from "typings"
import { MN } from "const"

let note: MbBookNote
let nodeNote: MbBookNote
let isOCR = false
let isComment = false
let lastRemovedComment:
  | {
      nodeNote: MbBookNote
      note: MbBookNote
      index: number
    }
  | undefined = undefined

export default async (_note: MbBookNote, lastExcerptText?: string) => {
  console.log("Processing Excerpt", "excerpt")
  // Initialize global variables
  note = _note
  nodeNote = note.groupNoteId ? MN.db.getNoteById(note.groupNoteId)! : note
  self.node = nodeNote
  isComment = nodeNote !== note
  self.isModify = lastExcerptText !== undefined
  if (
    self.profile.addon.lockExcerpt &&
    self.isModify &&
    lastExcerptText !== "😎"
  ) {
    processExcerpt(lastExcerptText!)
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
        console.log(self.OCROnline.times === 1 ? "OCR" : "not OCR", "ocr")
        isOCR = true
      } else return console.log("Image to text fail, no text", "ocr")
    } else
      return console.log(
        "No auto-to-text option on, no image processing",
        "ocr"
      )
  }

  // Indicates that the preceding rectangular excerpt to text does not use online OCR
  if (self.OCROnline.times === 0) {
    self.isModify &&
      (await delayBreak(30, 0.01, () => self.OCROnline.status === "begin"))
    if (self.OCROnline.status === "begin") {
      console.log("Online Correcting", "ocr")
      const success = await delayBreak(
        30,
        0.1,
        () => self.OCROnline.status === "end"
      )
      if (success) console.log("Correct success", "ocr")
      else console.log("Correct fail", "ocr")
    }
  }

  self.OCROnline = {
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
  const { title, text } = await newTitleText(
    excerptText,
    nodeNote.noteTitle?.split(/\s*[;；]\s*/),
    isComment
  )
  const tags = await newTag(excerptText)
  processExcerpt(text, title?.join("; "), tags)
}

const processExcerpt = (text: string, title?: string, tags?: string[]) => {
  undoGroupingWithRefresh(() => {
    if (text) {
      note.excerptText = text
      if (lastRemovedComment?.note === note) lastRemovedComment = undefined
    } else {
      // as comment
      if (isComment) {
        const index = getCommentIndex(nodeNote, note)
        if (index != -1) lastRemovedComment = { nodeNote, index, note }
        if (isOCR && nodeNote.excerptText == nodeNote.noteTitle)
          nodeNote.excerptText = title
      }
      // Excerpts can't be cleared after being OCR, otherwise the image will be displayed,
      // and must be set to the same title to not display
      else if (isOCR) note.excerptText = title
      else note.excerptText = ""
    }
    if (title) nodeNote.noteTitle = title
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

export const removeLastCommentCacheTitle = (onlyLastComment = false) => {
  if (!lastRemovedComment) return
  const { nodeNote, index, note } = lastRemovedComment
  undoGroupingWithRefresh(() => {
    if (note?.excerptText) nodeNote.removeCommentByIndex(index)
  })
  lastRemovedComment = undefined
  if (onlyLastComment) return
  const { cacheExcerptTitle } = self.docProfile.additional
  self.docProfile.additional.lastExcerpt = Date.now()
  Object.keys(cacheExcerptTitle).forEach(k => {
    if (!MN.db.getNoteById(k)) cacheExcerptTitle[k] = undefined
  })
}
