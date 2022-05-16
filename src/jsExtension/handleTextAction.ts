import { Addon, MN } from "@/const"
import { UIAlertViewStyle } from "@/typings/enum"
import { copy, openUrl, showHUD } from "@/utils/common"
import { reverseEscape } from "@/utils/input"
import { modifyNodeTitle, undoGroupingWithRefresh } from "@/utils/note"
import popup, { selectIndex } from "@/utils/popup"

const enum NoteOption {
  Copy,
  Title,
  MergeTitle,
  MergeExcerpt,
  Excerpt,
  Comment
}

export default async function (res: string, key: string) {
  if (
    /https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(res)
  ) {
    const { option } = await popup(
      {
        title: Addon.title,
        message: "检测到链接，是否直接打开？",
        type: UIAlertViewStyle.Default,
        buttons: ["确定"]
      },
      ({ buttonIndex }) => ({
        option: buttonIndex
      })
    )
    if (option !== -1) {
      openUrl(
        res.replace(
          /^.*(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]).*$/,
          "$1"
        )
      )
      return
    }
  }
  const { lastFocusNote } =
    MN.studyController().readerController.currentDocumentController
  const { noteOptions } = self.globalProfile.magicaction4text
  console.log(!lastFocusNote)
  if (!lastFocusNote || noteOptions.length === 0) {
    if (key === "translateText") {
      const { hudTime } = self.globalProfile.autotranslate
      showHUD(res, Number(hudTime))
      copy(res, false)
    } else copy(res)
  } else {
    let option = noteOptions[0]
    if (noteOptions.length > 1) {
      const index = await selectIndex(
        [
          "复制",
          "设置为标题",
          "合并标题",
          "合并到摘录",
          "设置为摘录",
          "设置为评论"
        ].filter((k, i) => noteOptions.includes(i)),
        "检测到您之前选中了一条笔记",
        Addon.title
      )
      option = noteOptions[index]
    }
    undoGroupingWithRefresh(() => {
      switch (option) {
        case NoteOption.Copy:
          if (key === "translateText") {
            const { hudTime } = self.globalProfile.autotranslate
            showHUD(res, Number(hudTime))
            copy(res, false)
          } else copy(res)
          break
        case NoteOption.Title:
          modifyNodeTitle(lastFocusNote, res)
          break
        case NoteOption.MergeTitle:
          modifyNodeTitle(lastFocusNote, lastFocusNote.noteTitle + "; " + res)
          break
        case NoteOption.Excerpt:
          lastFocusNote.excerptText = res
          break
        case NoteOption.MergeExcerpt:
          const { defaultMergeText } = self.globalProfile.magicaction4card
          const { excerptText } = lastFocusNote
          lastFocusNote.excerptText = excerptText
            ? excerptText + reverseEscape(defaultMergeText, true) + res
            : res
          break
        case NoteOption.Comment:
          if (key === "formulaOCR") {
            const { markdown } = self.globalProfile.autoocr
            // 0. markdown
            // 1. mymarkdown
            if (markdown[0] === 0) {
              lastFocusNote.appendHtmlComment(
                "```math\n" + res + "\n```",
                "```math\n" + res + "\n```",
                { width: 340, height: 100 },
                "MarkDownEditor"
              )
            } else
              lastFocusNote.appendHtmlComment(
                res,
                res,
                { width: 340, height: 100 },
                "MarkdownEditor"
              )
          } else lastFocusNote.appendTextComment(res)
      }
    })
  }
}
