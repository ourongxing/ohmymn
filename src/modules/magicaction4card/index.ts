import { addTags, getAllText, removeHighlight } from "utils/note"
import { escapeDoubleQuote, reverseEscape, string2RegArray } from "utils/input"
import { HUDController, showHUD } from "utils/common"
import type { textComment, IConfig, Methods, IActionMethod4Card } from "typings"
import { cellViewType } from "typings/enum"
import { lang } from "./lang"
import { unique } from "utils"
import { renameTitle } from "./renameTitle"

const { help, option, intro, label, link, hud } = lang

const configs: IConfig = {
  name: "MagicAction for Selecting Card",
  intro,
  link,
  settings: [
    {
      key: "smartSelection",
      type: cellViewType.switch,
      label: label.smart_selection
    }
  ],
  actions4card: [
    {
      key: "manageProfile",
      type: cellViewType.button,
      label: label.manage_profile,
      option: option.manage_profile,
      help: help.manage_profile
    },
    {
      type: cellViewType.buttonWithInput,
      label: label.filter_cards,
      option: option.filter_cards,
      key: "filterCards"
    },
    {
      type: cellViewType.button,
      label: label.merge_cards,
      key: "mergeCards",
      option: option.merge_cards
    },
    {
      type: cellViewType.buttonWithInput,
      label: label.rename_title,
      key: "renameTitle",
      help: help.rename_title
    },
    {
      type: cellViewType.buttonWithInput,
      label: label.merge_text,
      key: "mergeText",
      help: help.merge_text,
      option: option.merge_text
    },
    {
      key: "switchTitle",
      type: cellViewType.button,
      label: label.switch_title,
      option: option.switch_title,
      help: help.switch_title
    }
  ]
}

enum FilterCards {
  OnlyTitle,
  AllText
}

enum MergeCards {
  MergeTitle,
  NotMergeTitile
}

enum MergeText {
  ToExpertText,
  ToComment
}

enum SwitchTitle {
  ToNonexistent,
  Exchange
}

const actions4card: Methods<IActionMethod4Card> = {
  renameTitle,
  mergeText({ option, nodes, content }) {
    for (const node of nodes) {
      const allText = getAllText(
        node,
        reverseEscape(`${escapeDoubleQuote(content ?? "")}`, true)
      )
      // MN 这个里的 API 名称设计的有毛病
      const linkComments: textComment[] = []
      while (node.comments.length) {
        const comment = node.comments[0]

        comment.type == "TextNote" &&
          comment.text.includes("marginnote3app") &&
          linkComments.push(comment)

        node.removeCommentByIndex(0)
      }
      switch (option) {
        case MergeText.ToExpertText:
          node.excerptText = allText
          break
        case MergeText.ToComment:
          node.excerptText = ""
          node.appendTextComment(removeHighlight(allText))
      }
      linkComments.forEach(linkComment => {
        node.appendTextComment(linkComment.text)
      })
    }
  },
  filterCards({ nodes, content, option }) {
    if (!content) {
      showHUD(hud.none_card)
      return []
    }
    const regGroup = string2RegArray(content)
    const customSelectedNodes = nodes.filter(node => {
      const title = node.noteTitle ?? ""
      const content = `${title}\n${getAllText(node)}`
      return regGroup.some(regs =>
        regs.every(reg =>
          reg.test(option == FilterCards.AllText ? content : title)
        )
      )
    })
    if (customSelectedNodes.length) {
      HUDController.show(hud.is_clicked)
      return customSelectedNodes
    } else {
      showHUD(hud.none_card)
      return []
    }
  },
  mergeCards({ option, nodes }) {
    if (nodes.length == 1) return
    const node = nodes[0]
    const titles = node.noteTitle ? [node.noteTitle] : []
    for (let i = 1; i < nodes.length; i++) {
      const title = nodes[i].noteTitle
      title && titles.push(title)
      node.merge(nodes[i])
    }
    const len = node.comments.length
    // 从后往前删，索引不会乱
    node.comments.reverse().forEach((comment, index) => {
      comment.type == "TextNote" &&
        titles.includes(comment.text) &&
        node.removeCommentByIndex(len - index - 1)
    })
    if (option == MergeCards.MergeTitle)
      node.noteTitle = unique(titles).join("; ")
    // 合并标签
    addTags(node, [], true)
  },
  switchTitle({ nodes, option }) {
    for (const note of nodes) {
      const title = note.noteTitle ?? ""
      const text = note.excerptText ? removeHighlight(note.excerptText) : ""
      switch (option) {
        case SwitchTitle.ToNonexistent:
          // 只允许存在一个
          if ((title || text) && !(title && text)) {
            note.noteTitle = text
            note.excerptText = title
          } else if (title == text) note.noteTitle = ""
          break
        case SwitchTitle.Exchange:
          note.noteTitle = text
          note.excerptText = title
          break
      }
    }
  }
}

export { configs, actions4card }
