import { MbBookNote, NodeNote } from "marginnote"
import { CGSizeValue2CGSize, MN, removeHighlight, showHUD } from "marginnote"
import { countWord, notCJK, reverseEscape } from "~/utils"
import lang from "./lang"
import { AutoStylePreset, Style } from "./typings"

export function getExcerptArea(note: MbBookNote) {
  const { width, height } = CGSizeValue2CGSize(note.excerptPic!.size)
  return Math.floor((width * height) / 1000)
}

export function modifyStyle(note: MbBookNote, isAuto = false) {
  // 就跟随卡片 => 跟随兄弟节点 => 跟随父节点 => 默认 => 不动
  const {
    preset,
    showArea,
    wordCountArea,
    defaultPicExcerptColor,
    defaultPicExcerptStyle,
    defaultTextExcerptColor,
    defaultTextExcerptStyle
  } = self.globalProfile.autostyle

  const color = note.excerptPic
    ? defaultPicExcerptColor[0] !== 0
      ? defaultPicExcerptColor[0] - 1
      : undefined
    : defaultTextExcerptColor[0] !== 0
    ? defaultTextExcerptColor[0] - 1
    : undefined

  const style = note.excerptPic
    ? defaultPicExcerptStyle[0] !== 0
      ? defaultPicExcerptStyle[0] - 1
      : undefined
    : defaultTextExcerptStyle[0] !== 0
    ? defaultTextExcerptStyle[0] - 1
    : undefined

  const res = {
    color,
    style
  }

  if (
    preset.includes(AutoStylePreset.StyleByWordCountAndArea) &&
    wordCountArea
  ) {
    const [zh, en, area] = reverseEscape(wordCountArea) as number[]
    if (note.excerptPic?.size) {
      const actualArea = getExcerptArea(note)
      if (actualArea > area) res.style = Style.Wireframe
      if (showArea) showHUD(lang.area + ": " + actualArea)
    } else if (note.excerptText) {
      const text = removeHighlight(note.excerptText)
      if (countWord(text) > (notCJK(text) ? en : zh))
        res.style = Style.Wireframe
    }
  }

  const node = new NodeNote(note, isAuto ? MN.currnetNotebookId : undefined)
  const nodeNote = node.note
  for (const set of preset)
    switch (set) {
      case AutoStylePreset.ColorFollowCard:
        if (nodeNote.noteId !== note.noteId) {
          res.color = nodeNote.colorIndex
          return res
        }
        break
      case AutoStylePreset.ColorFollowBrother:
        const len = nodeNote.parentNote?.childNotes?.length
        if (len && len > 1) {
          res.color = nodeNote.parentNote.childNotes[0].colorIndex
          return res
        }
        break
      case AutoStylePreset.ColorFollowParents:
        if (nodeNote.parentNote) {
          res.color = nodeNote.parentNote.colorIndex
          return res
        }
    }
  return res
}
