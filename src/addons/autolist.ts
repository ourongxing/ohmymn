import { profile } from "profile"
import { excerptNotes } from "utils/note"
import { log } from "utils/common"
import { string2ReplaceParam } from "utils/input"

const config: IConfig = {
  name: "AutoList",
  intro: "针对有序号的文本，自动换行",
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: "摘录时自动执行"
    },
    {
      key: "multipleChoiceEnhance",
      type: cellViewType.switch,
      label: "选择题增强"
    },
    {
      key: "wrapWhenSemicolon",
      type: cellViewType.switch,
      label: "见分号换行"
    },
    {
      key: "customList",
      type: cellViewType.input,
      label: "自定义，点击查看具体格式",
      link: "https://busiyi.notion.site/AutoList-4c52b2607225450f913a6bfaba1f15ec"
    }
  ],
  actions: [
    {
      type: cellViewType.buttonWithInput,
      label: "序列摘录自动换行",
      key: "listSelected",
      help: "具体输入格式见顶上帮助信息",
      option: ["使用 AutoList 的配置"]
    }
  ]
}

const util = {
  // 匹配到就在前面或后面添加换行
  listText(text: string): string {
    const autolist = profile.autolist
    if (autolist.customList) {
      const params = string2ReplaceParam(autolist.customList)
      let _text = text
      for (const item of params) {
        _text = _text.replace(item.regexp, item.newSubStr)
      }
      if (text != _text) return _text.trim()
    }
    if (autolist.wrapWhenSemicolon) {
      // 有空格
      const _text = text.replace(/([;；])\s*/g, "$1\n")
      if (text != _text) return _text.trimEnd()
    }
    if (autolist.multipleChoiceEnhance) {
      if (/^[\w,.]*$/.test(text)) return text
      let _text = text.replace(
        /\s*([ABCDabcd][.、\s]*)/g,
        (match: string) => "\n" + match.trimStart().toUpperCase()
      )
      if (text != _text) return _text.trimStart()
    }
    return text
  }
}
const action: IActionMethod = {
  listSelected({ nodes, content }) {
    const params = content != "😎" ? string2ReplaceParam(content) : []
    for (const node of nodes) {
      const notes = excerptNotes(node)
      for (const note of notes) {
        const text = note.excerptText
        if (!text) continue
        let _text = text
        if (content == "😎") _text = util.listText(text)
        else
          params.forEach(param => {
            _text = _text.replace(param.regexp, param.newSubStr)
          })
        if (text !== _text) note.excerptText = _text
      }
    }
  }
}

export default { config, util, action }
