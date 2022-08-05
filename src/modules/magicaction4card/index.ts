import { CellViewType } from "~/typings/enum"
import { defineConfig } from "~/profile"
import {
  unique,
  checkPlainText,
  checkRegArray,
  showHUD,
  HUDController,
  string2RegArray,
  escapeDoubleQuote,
  string2ReplaceParam,
  reverseEscape,
  getAllTags,
  getExcerptText,
  getAllCommnets,
  getAllText,
  getAncestorNodes,
  addTags,
  removeHighlight,
  modifyNodeTitle,
  getSerialInfo,
  removeCommentButLinkTag
} from "~/utils"
import { lang } from "./lang"
import { renameTitle, getLayerSerialInfo } from "./renameTitle"
import { FilterCards, MergeCards, MergeText, SwitchTitle } from "./typings"

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
      help: "合并卡片内文字的前后修饰（$&代表每一段）",
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
      help: "仅支持合并文字摘录和文字评论，框选摘录会自动 OCR。",
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
          const allText = ((arr: string[]) => {
            if (/%\[.+\]/.test(front)) {
              const serialArr = getSerialInfo(front, arr.length)
              return arr
                .map((k, i) => front.replace(/%\[(.+)\]/, serialArr[i]) + k)
                .join(behind)
            }
            return arr.map(k => front + k).join(behind)
          })(dataArr)
          removeCommentButLinkTag(
            node,
            k => k.type === "PaintNote" || k.type === "HtmlNote",
            k => {
              switch (option) {
                case MergeText.ToExpertText:
                  k.excerptText = allText
                  break
                case MergeText.ToComment:
                  k.excerptText = ""
                  k.appendTextComment(removeHighlight(allText))
              }
            }
          )
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
              /**
               * 只有标题说明
               * 1. 摘录和标题相同。此时摘录也有可能是图片转文字。
               * 2. 摘录为空
               *
               * 而只有摘录，此时摘录也有可能由图片转文字。
               *
               * 既然想转标题，自然已经是文字了
               */
              if (note.excerptPic?.paint) {
                if (text && !title) {
                  note.noteTitle = text
                  note.excerptText = text
                } else {
                  // 只有标题只能说明摘录和标题相同
                  note.noteTitle = ""
                }
              } else {
                if ((!text && title) || (text && !title)) {
                  note.noteTitle = text
                  note.excerptText = title
                } else if (title == text) note.noteTitle = ""
              }
              break
            case SwitchTitle.Exchange:
              if (note.excerptPic?.paint) {
                if (text && title && text != title) {
                  note.excerptText = title
                  note.noteTitle = text
                } else {
                  if (text && !title) {
                    note.noteTitle = text
                    note.excerptText = text
                  } else {
                    note.noteTitle = ""
                  }
                }
              } else {
                note.noteTitle = text
                note.excerptText = title
              }
              break
          }
        }
      }
    }
  ]
})
