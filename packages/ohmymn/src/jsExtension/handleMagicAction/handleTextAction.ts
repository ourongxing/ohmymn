import {
  confirm,
  copy,
  MN,
  CanvasNode,
  openURL,
  popup,
  select,
  showHUD,
  UIAlertViewStyle,
  undoGroupingWithRefresh
} from "marginnote"
import { Addon } from "~/addon"
import { actions4text, isModuleON } from "~/coreModule"
import { formatText } from "~/modules/autoformat/utils"
import { mainOCR as ocrSelection } from "~/modules/autoocr/utils"
import { simplifyText } from "~/modules/autosimplify"
import { countWord, isURL } from "~/utils"
import lang from "../lang"

const enum NoteOption {
  Copy,
  Title,
  MergeTitle,
  MergeExcerpt,
  Excerpt,
  Comment
}

export default async function (key: string, option: number, content: string) {
  const imageFromSelection = MN.currentDocumentController.imageFromSelection()
  if (imageFromSelection === undefined) return showHUD(lang.not_select_area, 2)
  let res: string | undefined = undefined
  const imageFromSelectionBase64 = imageFromSelection.base64Encoding()

  if (key.endsWith("OCR")) {
    res = await actions4text[key]({
      text: "",
      img: imageFromSelection,
      imgBase64: imageFromSelectionBase64,
      option
    })
  } else {
    const { preFormat, preOCR, preSimplify } = self.docProfile.magicaction4text
    const { selectionText } = MN.currentDocumentController
    let text =
      preOCR && isModuleON("autoocr")
        ? (await ocrSelection(imageFromSelectionBase64)) ?? selectionText
        : selectionText
    if (!text) return showHUD(lang.no_text_selection, 2)
    if (preSimplify && isModuleON("autosimplify")) text = simplifyText(text)
    if (preFormat && isModuleON("autoformat")) text = formatText(text)
    res = await actions4text[key]({
      text,
      img: imageFromSelection,
      imgBase64: imageFromSelectionBase64,
      option
    })
  }

  if (res) {
    if (isURL(res)) {
      const { buttonIndex: option } = await popup({
        title: Addon.title,
        message: lang.detect_link,
        type: UIAlertViewStyle.Default,
        buttons: [lang.sure]
      })
      if (option !== -1) {
        openURL(res, true)
        return
      }
    }
    const selectedNotes = CanvasNode.getSelectedNodes()
    const { noteOptions, showCopyContent } = self.globalProfile.magicaction4text
    if (selectedNotes.length !== 1 || noteOptions.length === 0) {
      if (showCopyContent) {
        if (countWord(res) > 10 || res.includes("\n")) {
          const t = await confirm(Addon.title + " Copy", res)
          if (t) copy(res)
        } else {
          showHUD(res, 3)
          copy(res, false)
        }
      } else {
        copy(res)
      }
    } else {
      let option = noteOptions[0]
      if (noteOptions.length > 1) {
        const { index } = await select(
          lang.text_more_option.$options6.filter((k, i) =>
            noteOptions.includes(i)
          ),
          Addon.title,
          lang.text_more_option.selected_excerpt
        )
        option = noteOptions[index]
      }
      const focusNode = selectedNotes[0]
      undoGroupingWithRefresh(() => {
        if (res) {
          switch (option) {
            case NoteOption.Copy:
              if (showCopyContent) {
                copy(res, false)
                showHUD(res, 3)
              } else {
                copy(res)
              }
              break
            case NoteOption.Title:
              focusNode.title = res
              break
            case NoteOption.MergeTitle:
              focusNode.appendTitles(res)
              break
            case NoteOption.Excerpt:
              focusNode.mainExcerptText = res
              break
            case NoteOption.MergeExcerpt:
              focusNode.mainExcerptText = focusNode.mainExcerptText + res
              break
            case NoteOption.Comment:
              if (key === "formulaOCR") {
                if (MN.isMN4) {
                  focusNode.appendMarkdownComments(res)
                } else {
                  const { markdown } = self.globalProfile.autoocr
                  // 0. markdown
                  // 1. mymarkdown
                  // 2. milkdown
                  switch (markdown[0]) {
                    case 0:
                      focusNode.note.appendHtmlComment(
                        "```math\n" + res + "\n```",
                        "```math\n" + res + "\n```",
                        { width: 420, height: 100 },
                        "MarkDownEditor"
                      )
                      break
                    case 1:
                      focusNode.note.appendHtmlComment(
                        res,
                        res,
                        { width: 420, height: 100 },
                        "MarkdownEditor"
                      )
                      break
                    case 2:
                      focusNode.note.appendHtmlComment(
                        res,
                        res,
                        { width: 420, height: 100 },
                        "MilkdownEditor"
                      )
                      break
                  }
                }
              } else {
                if (self.globalProfile.addon.useMarkdown)
                  focusNode.appendMarkdownComments(res)
                else focusNode.appendTextComments(res)
              }
          }
        }
      })
    }
  }
}
