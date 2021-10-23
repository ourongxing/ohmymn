import { excerptNotes, getAllText } from "utils/note"
import {
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "utils/input"
import { HUDController, log, showHUD } from "utils/common"

const config: IConfig = {
  name: "MagicAction",
  intro: "请注意，以下功能均为选中卡片后使用\n点击查看具体使用方法和注意事项",
  link: "https://busiyi.notion.site/MagicAction-c4fb456af9a7407683c5cd615481f04c",
  settings: [],
  actions: [
    {
      type: cellViewType.buttonWithInput,
      label: "筛选卡片",
      help: "注意事项及具体输入格式见顶上帮助信息",
      option: ["仅判断标题", "判断整个卡片内容"],
      key: "filterCards"
    },
    {
      type: cellViewType.button,
      label: "修改摘录样式",
      key: "changeFillSelected",
      option: ["边框+填充", "填充", "边框"]
    },
    {
      type: cellViewType.buttonWithInput,
      label: "修改摘录颜色",
      key: "changeColorSelected",
      help: "输入颜色索引，也就是顺序，1 到 16"
    },
    {
      type: cellViewType.button,
      label: "合并卡片内文字",
      key: "mergeTextSelected",
      help: "请不要尝试合并图片",
      option: ["合并为摘录", "合并为评论"]
    },
    {
      type: cellViewType.buttonWithInput,
      label: "批量重命名标题",
      key: "renameSelected",
      help: "注意事项及具体输入格式见顶上帮助信息"
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
  renameSelected({ content, nodes }) {
    // 如果是矩形拖拽选中，则为从左到右，从上至下的顺序
    // 如果单个选中，则为选中的顺序
    content = /^\s*".*"\s*$/.test(content) ? `(/^.*$/g, ${content})` : content
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
  changeFillSelected({ content, nodes }) {
    const index = Number(content)
    for (const node of nodes) {
      excerptNotes(node).forEach(note => {
        note.fillIndex = index
      })
    }
  },
  changeColorSelected({ content, nodes }) {
    const index = Number(content)
    for (const node of nodes) {
      excerptNotes(node).forEach(note => {
        note.colorIndex = index - 1
      })
    }
  },
  mergeTextSelected({ content, nodes }) {
    const option = Number(content)
    for (const node of nodes) {
      const allText = getAllText(node)
      // MN 这个里的 API 名称设计的有毛病
      const linkComments: textComment[] = []
      // 从后往前删，记录链接，最后恢复
      while (node.comments.length) {
        const comment = node.comments[node.comments.length - 1]
        if (
          comment.type == "TextNote" &&
          comment.text.includes("marginnote3app")
        ) {
          linkComments.push(comment)
        }
        node.removeCommentByIndex(node.comments.length - 1)
      }
      switch (option) {
        case 0:
          node.excerptText = allText
          break
        case 1:
          node.excerptText = ""
          node.appendTextComment(allText)
      }
      linkComments.forEach(linkComment => {
        node.appendTextComment(linkComment.text)
      })
    }
  },
  filterCards({ nodes, content }) {
    // 0 判断标题 1 判断整个内容
    const option = Number(content.split("😎")[1] ?? 1)
    const regs = string2RegArray(content.split("😎")[0])
    const customSelectedNodes = nodes.filter(node => {
      const title = node.noteTitle ?? ""
      const content = `${title}\n${getAllText(node)}`
      return regs.every(reg => reg.test(option ? content : title))
    })
    if (customSelectedNodes.length) {
      HUDController.show("您需要的卡片已选中，请继续操作")
      return customSelectedNodes
    } else {
      showHUD("未找到符合的卡片")
      return []
    }
  }
}

export { config, util, action }
