import {
  addTags,
  appendTextComment,
  getAllCommnets,
  getAllTags,
  getAllText,
  getAncestorNodes,
  getExcerptText,
  HUDController,
  MN,
  modifyNodeTitle,
  removeCommentButLinkTag,
  removeHighlight,
  selectIndex,
  showHUD
} from "marginnote"
import { defineConfig } from "~/profile"
import { CellViewType } from "~/typings"
import {
  checkPlainText,
  checkRegArray,
  doc,
  escapeDoubleQuote,
  getSerialInfo,
  reverseEscape,
  string2RegArray,
  string2ReplaceParam,
  unique
} from "~/utils"
import lang from "./lang"
import { getLayerSerialInfo, renameTitle } from "./renameTitle"
import { FilterCards, MergeCards, MergeText, SwitchTitle } from "./typings"

export default defineConfig({
  name: "MagicAction for Card",
  key: "magicaction4card",
  intro: lang.intro,
  link: doc("magicaction4card"),
  settings: [
    {
      key: "smartSelection",
      type: CellViewType.Switch,
      label: lang.smart_selection.label,
      help: lang.smart_selection.help
    },
    {
      key: "defaultMergeText",
      type: CellViewType.Input,
      help: lang.default_merge_text.help,
      link: lang.default_merge_text.link,
      check({ input }) {
        checkPlainText(input)
        if (!input.includes("$&")) throw lang.default_merge_text.error
      }
    }
  ],
  actions4card: [
    {
      key: "manageProfile",
      type: CellViewType.Button,
      label: lang.manage_profile.label,
      option: lang.manage_profile.$option4,
      help: lang.manage_profile.help,
      method: () => {
        console.log()
      }
    },
    {
      type: CellViewType.ButtonWithInput,
      label: lang.filter_cards.label,
      option: lang.filter_cards.$option5,
      key: "filterCard",
      method({ nodes, content, option }) {
        if (!content) {
          showHUD(lang.none_card)
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
                return getExcerptText(node).text.join("\n")
              case FilterCards.Comment:
                return getAllCommnets(node).text.join("\n")
              default:
                return `${title}\n${getAllText(node)}`
            }
          })()
          return regGroup.some(regs =>
            regs.every(reg => reg.test(searchContent))
          )
        })
        if (customSelectedNodes.length) {
          HUDController.show(lang.is_selected)
          return customSelectedNodes
        } else {
          showHUD(lang.none_card)
          return []
        }
      },
      check({ input }) {
        checkRegArray(input)
      }
    },
    {
      type: CellViewType.Button,
      label: lang.merge_cards.label,
      key: "mergeCard",
      option: lang.merge_cards.$option2,
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
      label: lang.rename_title.label,
      key: "renameTitle",
      help: lang.rename_title.help,
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
      label: lang.merge_text.label,
      key: "mergeText",
      option: lang.merge_text.$option2,
      help: lang.merge_text.help,
      method: ({ option, nodes }) => {
        const { defaultMergeText } = self.globalProfile.magicaction4card
        const [front, behind] = reverseEscape(
          `${escapeDoubleQuote(defaultMergeText)}`,
          true
        ).split("$&")
        for (const node of nodes) {
          const dataArr = [
            ...getExcerptText(node, true).text,
            ...getAllCommnets(node).text
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
            k =>
              k.type === "PaintNote" ||
              k.type === "HtmlNote" ||
              (k.type === "LinkNote" &&
              !node.textFirst &&
              MN.db.getNoteById(k.noteid!)?.excerptPic
                ? true
                : false),
            async k => {
              switch (option) {
                case MergeText.ToExpertText:
                  if (k.excerptPic && !k.textFirst) {
                    const index = await selectIndex(
                      lang.merge_text.$excerpt_pic_option2,
                      lang.merge_text.label,
                      lang.merge_text.is_excerpt_pic
                    )
                    if (index) {
                      appendTextComment(k, removeHighlight(allText))
                      return
                    }
                  }
                  k.excerptText = allText
                  break
                case MergeText.ToComment:
                  if (k.excerptPic && k.textFirst && k.excerptText) {
                    const index = await selectIndex(
                      lang.merge_text.$excerpt_pic_text_option2,
                      lang.merge_text.label,
                      lang.merge_text.is_excerpt_pic_text
                    )
                    if (index) {
                      k.excerptText = allText
                      return
                    }
                  }
                  if (!k.excerptPic) k.excerptText = ""
                  appendTextComment(k, removeHighlight(allText))
              }
            }
          )
        }
      }
    },
    {
      key: "switchTitle",
      type: CellViewType.Button,
      label: lang.switch_title.label,
      option: lang.switch_title.$option2,
      help: lang.switch_title.help,
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
               * 而只有摘录，此时摘录也有可能由图片转文字。
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
