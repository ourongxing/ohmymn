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
  showHUD,
  undoGroupingWithRefresh
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
      method: async ({ nodes, option }) => {
        for (const note of nodes) {
          const title = note.noteTitle ?? ""
          const text = note.excerptText ? removeHighlight(note.excerptText) : ""
          switch (option) {
            case SwitchTitle.ToNonexistent:
              /**
               * 只有标题
               * 1. 摘录和标题相同：删除标题
               * 2. 摘录为空：删除标题，设置摘录
               * 只有摘录：删除摘录（是文字），设置标题
               */
              if (note.excerptPic?.paint && !note.textFirst) break
              else if (text === title) note.noteTitle = ""
              else if (title && !text) {
                note.noteTitle = ""
                note.excerptText = title
              } else if (text && !title) {
                note.noteTitle = text
                // 有可能有重点
                if (note.excerptPic?.paint) note.excerptText = text
                else note.excerptText = ""
              }
              break
            case SwitchTitle.Exchange:
              if (note.excerptPic?.paint && !note.textFirst) break
              else if (text === title) note.noteTitle = ""
              else if (title && !text) {
                note.noteTitle = ""
                note.excerptText = title
              } else if (text && !title) {
                note.noteTitle = text
                if (note.excerptPic?.paint) note.excerptText = text
                else note.excerptText = ""
              } else {
                /**
                 * 标题和摘录都存在
                 * 1. 交换：标题和摘录交换
                 * 2. 摘录强制转为标题：删除摘录（是文字），设置标题
                 * 3. 标题强制转为摘录：删除标题，设置摘录
                 */
                const option = await selectIndex(
                  ["摘录 ⇄ 标题", "摘录 → 标题", "摘录 ← 标题"],
                  "交换标题和摘录",
                  "检测到标题和摘录同时存在，请选择交换方式"
                )
                undoGroupingWithRefresh(() => {
                  switch (option) {
                    case 0:
                      note.noteTitle = text
                      note.excerptText = title
                      break
                    case 1:
                      note.noteTitle = text
                      if (!note.excerptPic?.paint) note.excerptText = ""
                      break
                    case 2:
                      note.noteTitle = ""
                      note.excerptText = title
                  }
                })
              }
              break
          }
        }
      }
    }
  ]
})
