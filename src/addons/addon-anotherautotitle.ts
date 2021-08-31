import profile from "profile"
import { log, string2ReplaceParam } from "utils/public"

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
      help: "拓宽作为标题的摘录，不受规则限制\n直接转为标题",
      key: "changeTitleNoLimit",
      type: cellViewType.switch,
      label: "拓宽标题摘录不受限制"
    },
    {
      help: "以下情况会在摘录时自动转换为标题",
      key: "isWord",
      type: cellViewType.switch,
      label: "是单词",
    },
    {
      help: "点号指 。、？?！!，,；;：:",
      key: "noPunctuation",
      type: cellViewType.switch,
      label: "不含有点号"
    },
    {
      key: "wordCount",
      type: cellViewType.inlineInput,
      label: "字数不超过",
    },
    {
      key: "customTitle",
      type: cellViewType.input,
      help: "自定义，点击查看具体格式",
      link: "https://busiyi.notion.site/AnotherAutoTitle-bef78c75901e4895b4fa2d03d83c48d6"
    }
  ],
  actions: [
    {
      type: cellViewType.button,
      label: '切换摘录或标题',
      key: 'switchTitleorExcerpt',
    },
  ]
}

const util = {
  checkGetTitle(text: string): string | boolean {
    const anotherautotitle = profile.anotherautotitle
    if (anotherautotitle.customTitle) {
      const params = string2ReplaceParam(anotherautotitle.customTitle)
      let _text = text
      let flag = false
      for (const item of params) {
        // 匹配到了就说明可以作为标题，然后传回 replace 的结果
        if (!flag && _text.match(item.regexp)) flag = true
        _text = _text.replace(item.regexp, item.replace)
      }
      if (flag) return _text
    }
    // 没有标点符号
    if (anotherautotitle.noPunctuation) {
      const reg = RegExp(/[。.、？?！!，,；;：:]/)
      if (!reg.test(text)) return text
    }
    if (anotherautotitle.isWord) {
      if (/^[a-zA-Z]+$/.test(text)) return text
    }
    // 字数达标
    if (anotherautotitle.wordCount && Number(anotherautotitle.wordCount) > text.length)
      return text
    return false
  },
}
const action: IActionMethod = {
  switchTitleorExcerpt({ nodes }) {
    for (const note of nodes) {
      const title = note.noteTitle ?? ""
      const text = note.excerptText ?? ""
      // 只允许存在一个
      if ((title || text) && !(title && text)) {
        // 去除划重点留下的 ****
        note.noteTitle = text.replace(/\*\*(.*?)\*\*/g, "$1")
        note.excerptText = title
      } else if (title == text) {
        // 如果摘录与标题相同，MN 只显示标题，此时我们必然想切换到摘录
        note.noteTitle = ""
      }
    }
  },

}
export default { config, util, action }
