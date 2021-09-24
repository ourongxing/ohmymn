import { profile } from "profile"
import { excerptNotes } from "utils/note"
import { showHUD } from "utils/common"
import { string2ReplaceParam } from "utils/input"

const config: IConfig = {
  name: "AutoReplace",
  intro: "自动替换摘录中的某些错误",
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: "摘录时自动执行",
    },
    {
      key: "customReplace",
      type: cellViewType.input,
      help: "自定义，点击查看具体格式",
      link: "https://busiyi.notion.site/AutoReplace-23df00035c97436e88a863925a08e57f",
    },
  ],
  actions: [
    {
      type: cellViewType.buttonWithInput,
      label: "批量替换摘录文字",
      key: "replaceSelected",
      help: "具体输入格式见顶上帮助信息",
    },
  ],
}

const util = {
  replaceText(text: string) {
    if (profile.autoreplace.customReplace) {
      const params = string2ReplaceParam(profile.autoreplace.customReplace)
      let _text = text
      for (const item of params) {
        _text = _text.replace(item.regexp, item.newSubStr)
      }
      if (text != _text) return _text
    }
    return text
  },
}

const action: IActionMethod = {
  replaceSelected({ content, nodes }) {
    // 检查输入正确性
    try {
      const params = string2ReplaceParam(content)
      for (const node of nodes) {
        const notes = excerptNotes(node)
        for (const note of notes) {
          const text = note.excerptText
          if (text) {
            let _text = text
            for (const item of params) {
              _text = _text.replace(item.regexp, item.newSubStr)
            }
            if (text !== _text) note.excerptText = _text
          }
        }
      }
    } catch {
      showHUD("输入错误")
    }
  },
}
export default { config, util, action }
