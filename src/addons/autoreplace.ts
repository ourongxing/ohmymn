import { profile } from "profile"
import { excerptNotes } from "utils/note"
import { string2ReplaceParam } from "utils/input"

const config: IConfig = {
  name: "AutoReplace",
  intro: "自动替换摘录中的某些错误",
  settings: [
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: ["自定义"],
      label: "选择需要的预设"
    },
    {
      key: "customReplace",
      type: cellViewType.input,
      label: "自定义，点击查看具体格式",
      link: "https://busiyi.notion.site/AutoReplace-23df00035c97436e88a863925a08e57f"
    }
  ],
  actions: [
    {
      type: cellViewType.buttonWithInput,
      label: "批量替换摘录文字",
      key: "replaceSelected",
      help: "具体输入格式见顶上帮助信息",
      option: ["使用 AutoReplace 的配置", "确定"]
    }
  ]
}

const util = {
  replaceText(text: string) {
    const preset = profile.autoreplace.preset
    for (const set of preset) {
      switch (set) {
        case 0:
          if (!profile.autoreplace.customReplace) break
          const params = string2ReplaceParam(profile.autoreplace.customReplace)
          let _text = text
          params.forEach(param => {
            _text = _text.replace(param.regexp, param.newSubStr)
          })
          if (text != _text) text = _text
      }
    }
    return text
  }
}

const action: IActionMethod = {
  replaceSelected({ content, nodes, option }) {
    if (option !== 0 && !content) return
    const params = option === 0 ? [] : string2ReplaceParam(content)
    for (const node of nodes) {
      const notes = excerptNotes(node)
      for (const note of notes) {
        const text = note.excerptText
        if (!text) continue
        let _text = text
        if (option === 0) _text = util.replaceText(text)
        else
          params.forEach(param => {
            _text = _text.replace(param.regexp, param.newSubStr)
          })
        if (text !== _text) note.excerptText = _text
      }
    }
  }
}
export { config, util, action }
