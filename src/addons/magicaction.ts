import { addTags, getAllText } from "utils/note"
import {
  escapeDoubleQuote,
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "utils/input"
import { HUDController, showHUD } from "utils/common"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import { textComment } from "types/MarginNote"
import lang from "lang"
import { unique } from "utils"

const { help, option, intro, label, link, hud } = lang.addon.magicaction

const config: IConfig = {
  name: "MagicAction",
  intro,
  link,
  settings: [],
  actions: [
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
      help: help.filter_cards,
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
      label: label.merge_text,
      key: "mergeText",
      help: help.merge_text,
      option: option.merge_text
    },
    {
      type: cellViewType.buttonWithInput,
      label: label.rename_title,
      key: "renameTitle",
      help: help.rename_title
    }
  ]
}

const enum FilterCards {
  OnlyTitle,
  AllText
}

const enum MergeCards {
  MergeTitle,
  NotMergeTitile
}

const enum MergeText {
  ToExpertText,
  ToComment
}

const util = {
  genCharArray(char: string, len: number, step: number = 1): string[] {
    const charArr = []
    let start = char.charCodeAt(0)
    const end = start + len * step - 1
    for (let i = start; i <= end; i = i + step) {
      charArr.push(String.fromCharCode(i))
    }
    return charArr
  },
  genNumArr(num: number, len: number, step = 1, digit = 0) {
    const numArr = []
    const end = num + len * step - 1
    for (let i = num; i <= end; i = i + step) {
      numArr.push(String(i).padStart(digit, "0"))
    }
    return numArr
  },
  getSerialInfo(newSubStr: string, length: number) {
    const serialArr = reverseEscape(
      newSubStr
        .match(/%\[(.*)\]/g)![0]
        .slice(1)
        .replace(/'/g, '"')
    ) as [string, string, ...string[]] | [string, number] | [string]
    const len = serialArr.length
    if (len == 0 || typeof serialArr[0] !== "string") throw ""
    else if (len == 1 || (len == 2 && typeof serialArr[1] == "number")) {
      const step = len == 1 ? 1 : (serialArr[1] as number)
      const first = serialArr[0]
      // 字母有大写和小写
      if (/^[A-Za-z]$/.test(first)) {
        const serial = this.genCharArray(first, length, step)
        return serial.map(k => newSubStr.replace(/%\[(.*)\]/, k))
      } // 数字要补零
      else if (!isNaN(Number(first))) {
        const serial = this.genNumArr(Number(first), length, step, first.length)
        return serial.map(k => newSubStr.replace(/%\[(.*)\]/, k))
      } else throw ""
    } // 自定义替换字符，数组元素长度大于 1，如果长度为 2，则第二个为字符串
    else if (len > 1 && serialArr.every(k => typeof k == "string"))
      return (serialArr as string[]).map(k => newSubStr.replace(/%\[(.*)\]/, k))
    else throw ""
  }
}

const action: IActionMethod = {
  renameTitle({ content, nodes }) {
    // 如果是矩形拖拽选中，则为从左到右，从上至下的顺序
    // 如果单个选中，则为选中的顺序
    content = /^\(.*\)$/.test(content)
      ? content
      : `(/^.*$/g, "${escapeDoubleQuote(content)}")`
    const { newSubStr, regexp } = string2ReplaceParam(content)[0]
    let newReplace: string[] = []
    // 如果含有序列信息，就把获取新的 replace 参数
    if (/%\[(.*)\]/.test(newSubStr)) {
      newReplace = util.getSerialInfo(newSubStr, nodes.length)
      nodes.forEach((note, index) => {
        const title = note.noteTitle ?? ""
        if (newReplace[index])
          note.noteTitle = title.replace(regexp, newReplace[index])
      })
    }
    // 或者直接替换
    else {
      nodes.forEach((note, index) => {
        const title = note.noteTitle ?? ""
        note.noteTitle = title.replace(regexp, newSubStr)
      })
    }
  },
  mergeText({ option, nodes, content }) {
    for (const node of nodes) {
      const allText = getAllText(
        node,
        reverseEscape(`"${escapeDoubleQuote(content ?? "")}"`)
      )
      // MN 这个里的 API 名称设计的有毛病
      const linkComments: textComment[] = []
      while (node.comments.length) {
        const comment = node.comments[0]
        if (
          comment.type == "TextNote" &&
          comment.text.includes("marginnote3app")
        )
          linkComments.push(comment)
        node.removeCommentByIndex(0)
      }
      switch (<MergeText>option) {
        case MergeText.ToExpertText:
          node.excerptText = allText
          break
        case MergeText.ToComment:
          node.excerptText = ""
          node.appendTextComment(allText.replace(/\*\*/g, ""))
      }
      linkComments.forEach(linkComment => {
        node.appendTextComment(linkComment.text)
      })
    }
  },
  filterCards({ nodes, content, option }) {
    if (!content) return
    const regGroup = string2RegArray(content)
    const customSelectedNodes = nodes.filter(node => {
      const title = node.noteTitle ?? ""
      const content = `${title}\n${getAllText(node, "\n", false)}`
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
      if (title) titles.push(title)
      node.merge(nodes[i])
    }
    const len = node.comments.length
    // 从后往前删，索引不会乱
    node.comments.reverse().forEach((comment, index) => {
      if (comment.type == "TextNote" && titles.includes(comment.text))
        node.removeCommentByIndex(len - index - 1)
    })
    if (option == MergeCards.MergeTitle)
      node.noteTitle = unique(titles).join("; ")
    // 合并标签
    addTags(node, [], true)
  }
}

export { config, util, action }
