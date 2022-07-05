import { textComment } from "~/typings"
import { CellViewType } from "~/typings/enum"
import { unique } from "~/utils"
import { checkPlainText, checkRegArray } from "~/utils/checkInput"
import { showHUD, HUDController } from "~/utils/common"
import { defineConfig } from "~/profile"
import {
  string2RegArray,
  escapeDoubleQuote,
  string2ReplaceParam,
  reverseEscape
} from "~/utils/input"
import {
  getAllTags,
  getExcerptText,
  getAllCommnets,
  getAllText,
  getAncestorNodes,
  addTags,
  removeHighlight,
  modifyNodeTitle
} from "~/utils/note"
import { lang } from "./lang"
import { renameTitle, getLayerSerialInfo } from "./renameTitle"
import { FilterCards, MergeCards, MergeText, SwitchTitle } from "./typings"
import { getSerialInfo } from "~/utils/number"
const { help, option, intro, label, link, hud } = lang

export default defineConfig({
  name: "MagicAction for Card",
  key: "magicaction4card",
  intro,
  link,
  settings: [
    {
      key: "smartSelection",
      type: CellViewType.Switch,
      label: label.smart_selection
    },
    {
      key: "defaultMergeText",
      type: CellViewType.Input,
      help: "合并卡片文字的修饰（$&代表每一段）",
      check({ input }) {
        checkPlainText(input)
        if (!input.includes("$&")) throw "缺少 $&"
      }
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
      method({ nodes, content, option }) {
        if (!content) {
          showHUD(hud.none_card)
          return []
        }
        const regGroup = string2RegArray(content)
        const customSelectedNodes = nodes.filter(node => {
          const title = node.noteTitle ?? ""
          const searchContent = (() => {
            switch (option) {
              case FilterCards.Title:
                return title
              case FilterCards.Tag:
                return getAllTags(node).join(" ")
              case FilterCards.Excerpt:
                return getExcerptText(node).ocr.join("\n")
              case FilterCards.Comment:
                return getAllCommnets(node).nopic.join("\n")
              default:
                return `${title}\n${getAllText(node)}`
            }
          })()
          return regGroup.some(regs =>
            regs.every(reg => reg.test(searchContent))
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
      check({ input }) {
        checkRegArray(input)
      }
    },
    {
      type: CellViewType.Button,
      label: label.merge_cards,
      key: "mergeCards",
      option: option.merge_cards,
      method({ option, nodes }) {
        if (nodes.length == 1) return
        const { node } = nodes.slice(1).reduce(
          (acc, cur) => {
            const level = getAncestorNodes(cur).length
            if (level < acc.level)
              return {
                level,
                node: cur
              }
            else return acc
          },
          {
            level: getAncestorNodes(nodes[0]).length,
            node: nodes[0]
          }
        )
        const titles = node.noteTitle ? [node.noteTitle] : []
        for (const n of nodes) {
          if (n === node) continue
          const title = n.noteTitle
          title && titles.push(title)
          node.merge(n)
        }
        const len = node.comments.length
        // 从后往前删，索引不会乱
        node.comments.reverse().forEach((comment, index) => {
          comment.type == "TextNote" &&
            titles.includes(comment.text) &&
            node.removeCommentByIndex(len - index - 1)
        })
        if (option == MergeCards.MergeTitle)
          modifyNodeTitle(node, unique(titles))
        // 合并标签
        addTags(node, [], true)
      }
    },
    {
      type: CellViewType.ButtonWithInput,
      label: label.rename_title,
      key: "renameTitle",
      help: help.rename_title,
      method: renameTitle,
      check({ input }) {
        input = /^\(.+\)$/.test(input)
          ? input
          : `(/^.*$/gs, "${escapeDoubleQuote(input)}")`
        const { regexp, newSubStr } = string2ReplaceParam(input)[0]
        "test".replace(regexp, newSubStr)
        if (/%\[.+\]/.test(newSubStr)) getSerialInfo(newSubStr, 1)
        if (/#\[.+\]/.test(newSubStr))
          getLayerSerialInfo(newSubStr, [[1, 1, 1]])
      }
    },
    {
      type: CellViewType.Button,
      label: label.merge_text,
      key: "mergeText",
      option: option.merge_text,
      help: "仅支持合并文字摘录和文字评论，如果存在图片，则在合并后会置顶。",
      method: ({ option, nodes }) => {
        const { defaultMergeText } = self.globalProfile.magicaction4card
        const [front, behind] = reverseEscape(
          `${escapeDoubleQuote(defaultMergeText)}`,
          true
        ).split("$&")
        for (const node of nodes) {
          const dataArr = [
            ...getExcerptText(node, true).ocr,
            ...getAllCommnets(node).nopic
          ]
          const allText = (() => {
            if (/%\[.+\]/.test(front)) {
              const serialArr = getSerialInfo(front, dataArr.length)
              return dataArr
                .map((k, i) => front.replace(/%\[(.+)\]/, serialArr[i]) + k)
                .join(behind)
            }
            return dataArr.map(k => front + k).join(behind)
          })()

          const linkComments: textComment[] = []
          const tags = getAllTags(node, false)
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
          addTags(node, tags)
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
})
