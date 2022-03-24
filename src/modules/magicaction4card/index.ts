import { addTags, getAllText, removeHighlight } from "utils/note"
import {
  escapeDoubleQuote,
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "utils/input"
import { HUDController, showHUD } from "utils/common"
import type { textComment, IConfig, ICheckMethod } from "typings"
import { CellViewType } from "typings/enum"
import { lang } from "./lang"
import { unique } from "utils"
import { getLayerSerialInfo, getSerialInfo, renameTitle } from "./renameTitle"
import {
  ActionKey,
  FilterCards,
  MergeCards,
  MergeText,
  SwitchTitle
} from "./enum"
import { IProfile } from "profile"
import { checkPlainText, checkRegArray } from "utils/checkInput"

const { help, option, intro, label, link, hud } = lang

const configs: IConfig<IProfile["magicaction4card"], typeof ActionKey> = {
  name: "MagicAction for Card",
  key: "magicaction4card",
  intro,
  link,
  settings: [
    {
      key: "smartSelection",
      type: CellViewType.Switch,
      label: label.smart_selection
    }
  ],
  actions4card: [
    {
      key: "manageProfile",
      type: CellViewType.Button,
      label: label.manage_profile,
      option: option.manage_profile,
      help: help.manage_profile,
      method: () => {
        console.log()
      }
    },
    {
      type: CellViewType.ButtonWithInput,
      label: label.filter_cards,
      option: option.filter_cards,
      key: "filterCards",
      method: ({ nodes, content, option }) => {
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
      }
    },
    {
      type: CellViewType.Button,
      label: label.merge_cards,
      key: "mergeCards",
      option: option.merge_cards,
      method: ({ option, nodes }) => {
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
      }
    },
    {
      type: CellViewType.ButtonWithInput,
      label: label.rename_title,
      key: "renameTitle",
      help: help.rename_title,
      method: renameTitle
    },
    {
      type: CellViewType.ButtonWithInput,
      label: label.merge_text,
      key: "mergeText",
      help: help.merge_text,
      option: option.merge_text,
      method: ({ option, nodes, content }) => {
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
      }
    },
    {
      key: "switchTitle",
      type: CellViewType.Button,
      label: label.switch_title,
      option: option.switch_title,
      help: help.switch_title,
      method: ({ nodes, option }) => {
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
  ]
}

const checker: ICheckMethod<typeof ActionKey> = (input, key) => {
  switch (key) {
    case "mergeText":
      checkPlainText(input)
      break
    case "renameTitle":
      input = /^\(.+\)$/.test(input)
        ? input
        : `(/^.*$/g, "${escapeDoubleQuote(input)}")`
      const { regexp, newSubStr } = string2ReplaceParam(input)[0]
      "test".replace(regexp, newSubStr)
      if (/%\[.+\]/.test(newSubStr)) getSerialInfo(newSubStr, 1)
      if (/#\[.+\]/.test(newSubStr)) getLayerSerialInfo(newSubStr, [[1, 1, 1]])
      break
    case "filterCards":
      checkRegArray(input)
      break
    default:
      return undefined
  }
}

const magicaction4card = {
  configs,
  checker
}

export default magicaction4card
