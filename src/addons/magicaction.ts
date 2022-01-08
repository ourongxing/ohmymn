import { excerptNotes, getAllText } from "utils/note"
import {
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "utils/input"
import { HUDController, showHUD } from "utils/common"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import { textComment } from "types/MarginNote"
import lang from "lang"

const { help, option, intro, label, link, hud } = lang.addon.magicaction

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
      label: label.change_fill_style,
      key: "changeFillStyle",
      option: option.change_fill_style
    },
    {
      type: cellViewType.buttonWithInput,
      label: label.change_color,
      key: "changeColor",
      help: help.change_color
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
  getSerialInfo(newSubStr: string, length: number): string[] {
    const seriaInfo = newSubStr
      .match(/%\[(.*)\]/)![0]
      .slice(1)
      .replace(/'/g, '"')
    // 将序列信息转成数组
    const seriaInfo_arr = <any[]>reverseEscape(seriaInfo)

    // 自定义替换字符，数组元素大于 2
    if (seriaInfo_arr.length > 2)
      return seriaInfo_arr.map((item: string) =>
        newSubStr.replace(/%\[(.*)\]/, item)
      )
    else {
      if (seriaInfo_arr[1] && typeof seriaInfo_arr[1] !== "number") throw ""
      let step: number = 1
      if (seriaInfo_arr[1]) step = seriaInfo_arr[1]
      // 序列只有两种情况，字母，和数字。
      const inival = seriaInfo_arr[0]

      // 字母有大写和小写
      if (/^[A-Za-z]$/.test(inival)) {
        const serias = this.genCharArray(inival, length, step)
        return serias.map((item: string) =>
          newSubStr.replace(/%\[(.*)\]/, item)
        )
      }
      // 数字要补零
      else if (!isNaN(Number(inival))) {
        const serias = this.genNumArr(
          Number(inival),
          length,
          step,
          inival.length
        )
        return serias.map((item: string) =>
          newSubStr.replace(/%\[(.*)\]/, item)
        )
      } else throw ""
    }
  }
}

const action: IActionMethod = {
  renameTitle({ content, nodes }) {
    // 如果是矩形拖拽选中，则为从左到右，从上至下的顺序
    // 如果单个选中，则为选中的顺序
    content = /^\(.*\)$/.test(content) ? content : `(/^.*$/g, "${content}")`
    const params = string2ReplaceParam(content)
    if (params.length > 1) return
    let newReplace: string[] = []
    // 如果含有序列信息，就把获取新的 replace 参数
    if (/%\[(.*)\]/.test(params[0].newSubStr)) {
      newReplace = util.getSerialInfo(params[0].newSubStr, nodes.length)
      nodes.forEach((note, index) => {
        const title = note.noteTitle ?? ""
        if (newReplace[index])
          note.noteTitle = title.replace(params[0].regexp, newReplace[index])
      })
    }
    // 或者直接替换
    else {
      nodes.forEach((note, index) => {
        const title = note.noteTitle ?? ""
        note.noteTitle = title.replace(params[0].regexp, params[0].newSubStr)
      })
    }
  },
  changeFillStyle({ option, nodes }) {
    for (const node of nodes) {
      excerptNotes(node).forEach(note => {
        note.fillIndex = option
      })
    }
  },
  changeColor({ content, nodes }) {
    if (!content) return
    const index = Number(content)
    for (const node of nodes) {
      excerptNotes(node).forEach(note => {
        note.colorIndex = index - 1
      })
    }
  },
  mergeText({ option, nodes, content }) {
    for (const node of nodes) {
      const allText = getAllText(node, reverseEscape(`"${content}"`))
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
    // 0 判断标题 1 判断整个内容
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
    let titles = [node.noteTitle]
    for (let i = 1; i < nodes.length; i++) {
      titles.push(nodes[i].noteTitle ?? "")
      node.merge(nodes[i])
    }
    titles = titles.filter(item => item)
    const len = node.comments.length
    // 从后往前删，索引不会乱
    node.comments.reverse().forEach((comment, index) => {
      if (comment.type == "TextNote" && titles.includes(comment.text))
        node.removeCommentByIndex(len - index - 1)
    })
    if (option == MergeCards.MergeTitle) node.noteTitle = titles.join("; ")
  }
}

export { config, util, action }
