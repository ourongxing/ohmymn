import { profile } from "profile"
import { excerptNotes } from "utils/note"
import { string2ReplaceParam } from "utils/input"
import { isHalfWidth } from "utils/text"

const config: IConfig = {
  name: "AutoList",
  intro: "针对序列文本，自动换行，仅适配中文",
  settings: [
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: ["选择题", "句首中文编号", "句末分号", "句末句号"],
      label: "选择需要的预设"
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
      label: "序列摘录换行",
      key: "listSelected",
      help: "具体输入格式见顶上帮助信息",
      option: ["使用 AutoList 的配置", "确定"]
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
      params.forEach(param => {
        _text = _text.replace(param.regexp, param.newSubStr).trim()
      })
      if (text != _text) text = _text
    }
    const preset = profile.autolist.preset
    for (const set of preset) {
      switch (set) {
        case 0: {
          if (isHalfWidth(text)) return text
          const _text = text.replace(/\s*([ABCD][.、]+)/g, "\n$1").trimStart()
          if (text.match(/\s*([ABCD][.、\s]+)/g)?.length ?? 0 > 1) text = _text
          break
        }
        case 1: {
          if (isHalfWidth(text)) return text
          const reg = /\s*([其第][一二三四五六七八][、，])/g
          const _text = text.replace(reg, "\n$1").trimStart()
          if (text.match(reg)?.length ?? 0 > 1) text = _text
          break
        }
        case 2: {
          const _text = text.replace(/([;；])\s*/g, "$1\n").trimEnd()
          if (text.match(/([;；])\s*/g)?.length ?? 0 > 1) text = _text
          break
        }
        case 3: {
          const reg = new RegExp(`(${isHalfWidth(text) ? "." : "。"})\s*`, "g")
          const _text = text.replace(reg, "$1\n").trimEnd()
          if (text.match(reg)?.length ?? 0 > 1) text = _text
          break
        }
      }
    }
    return text.trim().replace(/\n{2,}/g, "\n")
  }
}
const action: IActionMethod = {
  listSelected({ nodes, content, option }) {
    const params = option === 0 ? [] : string2ReplaceParam(content)
    for (const node of nodes) {
      const notes = excerptNotes(node)
      for (const note of notes) {
        const text = note.excerptText
        if (!text) continue
        let _text = text
        if (option === 0) _text = util.listText(text)
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
