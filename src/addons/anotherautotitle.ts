import { profile } from "profile"
import { log } from "utils/common"
import { reverseEscape, string2RegArray } from "utils/input"
import { isHalfWidth, wordCount } from "utils/text"

const config: IConfig = {
  name: "AnotherAutoTitle",
  intro: "更强大的自动转换标题插件",
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: "摘录时自动执行"
    },
    {
      key: "mergeTitle",
      type: cellViewType.switch,
      label: "摘录自动合并为标题"
    },
    {
      key: "changeTitleNoLimit",
      type: cellViewType.switch,
      label: "拓宽标题摘录不受限制"
    },
    {
      help: "以下情况会在摘录时自动转换为标题",
      key: "wordCount",
      type: cellViewType.inlineInput,
      label: "字数不超过"
    },
    {
      help: "点号指 。.、？?！!，,；;：:",
      key: "noPunctuation",
      type: cellViewType.switch,
      label: "不含有点号"
    },
    {
      key: "custom",
      type: cellViewType.input,
      label: "自定义，点击查看具体格式",
      link: "https://busiyi.notion.site/AnotherAutoTitle-bef78c75901e4895b4fa2d03d83c48d6"
    }
  ],
  actions: [
    {
      type: cellViewType.button,
      label: "切换摘录或标题",
      key: "switchTitleorExcerpt",
      option: ["常规互相切换", "交换标题和摘录"],
      help: "常规切换为不存在的那一个"
    }
  ]
}

const util = {
  checkGetTitle(text: string): {} | boolean {
    const anotherautotitle = profile.anotherautotitle
    if (anotherautotitle.custom) {
      const regs = string2RegArray(anotherautotitle.custom)
      // 全部匹配到才转为标题
      if (regs.every(reg => reg.test(text)))
        return {
          title: text
        }
    }
    // 没有点号
    if (anotherautotitle.noPunctuation) {
      const reg = RegExp(/[。.、？?！!，,；;：:]/)
      if (!reg.test(text))
        return {
          title: text
        }
    }
    // 字数达标
    if (anotherautotitle.wordCount) {
      const limitedNum = reverseEscape(anotherautotitle.wordCount)
      const actualNum = wordCount(text)
      log("实际字数：" + actualNum, "autotitle")
      const isTitle =
        typeof limitedNum == "number"
          ? actualNum <= limitedNum
          : isHalfWidth(text)
          ? actualNum <= limitedNum[1]
          : actualNum <= limitedNum[0]
      if (isTitle)
        return {
          title: text
        }
    }
    return false
  }
}
const action: IActionMethod = {
  switchTitleorExcerpt({ nodes, content }) {
    const option = Number(content)
    for (const note of nodes) {
      const title = note.noteTitle ?? ""
      const text = note.excerptText
        ? note.excerptText.replace(/\*\*(.*?)\*\*/g, "$1")
        : ""
      switch (option) {
        // option: [ "常规互相切换", "交换标题和摘录"],
        case 0:
          // 只允许存在一个
          if ((title || text) && !(title && text)) {
            note.noteTitle = text
            note.excerptText = title
          } else if (title == text) note.noteTitle = ""
          break
        case 1:
          note.noteTitle = text
          note.excerptText = title
          break
      }
    }
  }
}
export default { config, util, action }
