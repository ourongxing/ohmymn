import {
  HUDController,
  MN,
  removeHighlight,
  select,
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
  string2ReplaceParam
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
        //
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
          const title = node.title ?? ""
          const searchContent = (() => {
            switch (option) {
              case FilterCards.Title:
                return title
              case FilterCards.Tag:
                return node.tags.join(" ")
              case FilterCards.Excerpt:
                return node.excerptsText.join("\n\n")
              case FilterCards.Comment:
                return node.commentsText.join("\n\n")
              default:
                return `${title}\n${node.allText}`
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
            const level = cur.ancestorNodes.length
            if (level < acc.level)
              return {
                level,
                node: cur
              }
            else return acc
          },
          {
            level: nodes[0].ancestorNodes.length,
            node: nodes[0]
          }
        )
        const titles = node.titles
        undoGroupingWithRefresh(() => {
          for (const n of nodes) {
            if (n === node) continue
            titles.push(...n.titles)
            node.note.merge(n.note)
          }
          const len = node.note.comments.length
          // 从后往前删，索引不会乱
          node.note.comments.reverse().forEach((comment, index) => {
            if (comment.type == "TextNote" && titles.includes(comment.text)) {
              node.note.removeCommentByIndex(len - index - 1)
            }
          })
          if (option == MergeCards.MergeTitle) {
            node.titles = titles
          }
          node.tidyupTags()
        })
      }
    },
    {
      type: CellViewType.ButtonWithInput,
      label: lang.rename_title.label,
      key: "renameTitle",
      help: lang.rename_title.help,
      method({ content, nodes }) {
        undoGroupingWithRefresh(() => {
          renameTitle(content, nodes)
        })
      },
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
        undoGroupingWithRefresh(() => {
          for (const node of nodes) {
            const allText = ((arr: string[]) => {
              if (/%\[.+\]/.test(front)) {
                const serialArr = getSerialInfo(front, arr.length)
                return arr
                  .map((k, i) => front.replace(/%\[(.+)\]/, serialArr[i]) + k)
                  .join(behind)
              }
              return arr.map(k => front + k).join(behind)
            })(node.excerptsCommentsText)

            node.removeCommentButLinkTag(
              k =>
                k.type === "PaintNote" ||
                k.type === "HtmlNote" ||
                (k.type === "LinkNote" &&
                !node.isOCR &&
                MN.db.getNoteById(k.noteid!)?.excerptPic?.paint
                  ? true
                  : false),
              async node => {
                switch (option) {
                  case MergeText.ToExpertText:
                    if (node.note.excerptPic?.paint && node.isOCR === false) {
                      const { index } = await select(
                        lang.merge_text.$excerpt_pic_option2,
                        lang.merge_text.label,
                        lang.merge_text.is_excerpt_pic
                      )
                      if (index) {
                        if (self.globalProfile.addon.useMarkdown)
                          node.appendMarkdownComments(removeHighlight(allText))
                        else node.appendTextComments(removeHighlight(allText))
                        return
                      }
                    }
                    node.mainExcerptText = allText
                    break
                  case MergeText.ToComment:
                    if (node.isOCR && node.mainExcerptText) {
                      const { index } = await select(
                        lang.merge_text.$excerpt_pic_text_option2,
                        lang.merge_text.label,
                        lang.merge_text.is_excerpt_pic_text
                      )
                      if (index) {
                        node.mainExcerptText = allText
                        return
                      }
                    }
                    if (!node.note.excerptPic?.paint) node.mainExcerptText = ""
                    if (self.globalProfile.addon.useMarkdown) {
                      node.appendMarkdownComments(removeHighlight(allText))
                    } else node.appendTextComments(removeHighlight(allText))
                }
              }
            )
          }
        })
      }
    },
    {
      key: "switchTitle",
      type: CellViewType.Button,
      label: lang.switch_title.label,
      option: lang.switch_title.$option2,
      help: lang.switch_title.help,
      method: async ({ nodes, option }) => {
        if (option === SwitchTitle.ToNonexistent) {
          undoGroupingWithRefresh(() => {
            for (const node of nodes) {
              const title = node.title
              const text = removeHighlight(node.mainExcerptText)
              /**
               * 只有标题
               * 1. 摘录和标题相同：删除标题
               * 2. 摘录为空：删除标题，设置摘录
               * 只有摘录：删除摘录（是文字），设置标题
               */
              if (node.note.excerptPic?.paint && !node.note.textFirst) {
              } else if (text === title) node.title = ""
              else if (title && !text) {
                node.title = ""
                node.mainExcerptText = title
              } else if (text && !title) {
                node.title = text
                // 有可能有重点
                if (node.note.excerptPic?.paint) node.mainExcerptText = text
                else node.mainExcerptText = ""
              }
            }
          })
        } else {
          /**
           * 标题和摘录都存在
           * 1. 交换：标题和摘录交换
           * 2. 摘录强制转为标题：删除摘录（是文字），设置标题
           * 3. 标题强制转为摘录：删除标题，设置摘录
           */
          const res = nodes.map(node => [
            node.title,
            removeHighlight(node.mainExcerptText)
          ])
          const option = res.find(([title, text]) => title && text)
            ? (
                await select(
                  lang.switch_title.$both_option3,
                  lang.switch_title.swap_title_excerpt,
                  lang.switch_title.swap_help
                )
              ).index
            : 0
          undoGroupingWithRefresh(() => {
            nodes.forEach((node, index) => {
              const [title, text] = res[index]
              if (node.note.excerptPic?.paint && !node.note.textFirst) {
              } else if (text === title) {
                node.title = ""
              } else if (title && !text) {
                node.title = ""
                node.mainExcerptText = title
              } else if (text && !title) {
                node.title = text
                if (node.note.excerptPic?.paint) node.mainExcerptText = text
                else node.mainExcerptText = ""
              } else {
                switch (option) {
                  case 0:
                    node.title = text
                    node.mainExcerptText = title
                    break
                  case 1:
                    node.title = text
                    if (!node.note.excerptPic?.paint) node.mainExcerptText = ""
                    break
                  case 2:
                    node.title = ""
                    node.mainExcerptText = title
                }
              }
            })
          })
        }
      }
    }
  ]
})
