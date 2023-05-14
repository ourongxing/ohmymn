import {
  alert,
  confirm,
  copy,
  MN,
  NodeNote,
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
  const imageFromSelection = MN.currentDocumentController
    .imageFromSelection()
    ?.base64Encoding()
  if (imageFromSelection === undefined) return showHUD(lang.not_select_area, 2)
  let res: string | undefined = undefined

  if (key.endsWith("OCR")) {
    res = await actions4text[key]({
      text: "",
      imgBase64: imageFromSelection,
      option
    })
  } else {
    const { preFormat, preOCR, preSimplify } = self.docProfile.magicaction4text
    const { selectionText } = MN.currentDocumentController
    let text =
      preOCR && isModuleON("autoocr")
        ? (await ocrSelection(imageFromSelection)) ?? selectionText
        : selectionText
    if (!text) return showHUD(lang.no_text_selection, 2)
    if (preSimplify && isModuleON("autosimplify")) text = simplifyText(text)
    if (preFormat && isModuleON("autoformat")) text = formatText(text)
    res = await actions4text[key]({
      text,
      imgBase64: "",
      option
    })
  }

  if (res) {
    if (isURL(res, true)) {
      const { buttonIndex: option } = await popup({
        title: Addon.title,
        message: lang.detect_link,
        type: UIAlertViewStyle.Default,
        buttons: [lang.sure]
      })
      if (option !== -1) {
        openURL(
          res.replace(
            /^.*(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]).*$/,
            "$1"
          ),
          true
        )
        return
      }
    }
    const { lastFocusNote } = MN.currentDocumentController
    const { noteOptions, showCopyContent } = self.globalProfile.magicaction4text
    if (!lastFocusNote || noteOptions.length === 0) {
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
      const lastFocusNode = new NodeNote(lastFocusNote)
      undoGroupingWithRefresh(() => {
        if (res)
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
              lastFocusNode.title = res
              break
            case NoteOption.MergeTitle:
              lastFocusNode.appendTitles(res)
              break
            case NoteOption.Excerpt:
              lastFocusNode.mainExcerptText = res
              break
            case NoteOption.MergeExcerpt:
              lastFocusNode.mainExcerptText =
                lastFocusNode.mainExcerptText + res
              break
            case NoteOption.Comment:
              if (key === "formulaOCR") {
                if (lastFocusNode.note.appendMarkdownComment) {
                  lastFocusNode.note.appendMarkdownComment(res)
                } else {
                  const { markdown } = self.globalProfile.autoocr
                  // 0. markdown
                  // 1. mymarkdown
                  // 2. milkdown
                  switch (markdown[0]) {
                    case 0:
                      lastFocusNote.appendHtmlComment(
                        "```math\n" + res + "\n```",
                        "```math\n" + res + "\n```",
                        { width: 420, height: 100 },
                        "MarkDownEditor"
                      )
                      break
                    case 1:
                      lastFocusNote.appendHtmlComment(
                        res,
                        res,
                        { width: 420, height: 100 },
                        "MarkdownEditor"
                      )
                      break
                    case 2:
                      lastFocusNote.appendHtmlComment(
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
                  lastFocusNode.appendMarkdownComments(res)
                else lastFocusNode.appendTextComments(res)
              }
          }
      })
    }
  }
}
