import { profile } from "profile"
import { excerptNotes } from "utils/note"
import { string2ReplaceParam } from "utils/input"
import { isHalfWidth } from "utils/text"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"

const { help, intro, option, label, link } = lang.addon.autolist
export const enum AutoListPreset {
  Custom,
  ChoiceQuestion,
  ChineseNumber,
  Semicolon,
  Period
}

const enum ListSelected {
  AsAutoList
}

const config: IConfig = {
  name: "AutoList",
  intro,
  settings: [
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: option.preset,
      label: label.preset
    },
    {
      key: "customList",
      type: cellViewType.input,
      label: label.custom_list,
      link
    }
  ],
  actions: [
    {
      type: cellViewType.buttonWithInput,
      label: label.list_selected,
      key: "listSelected",
      help: help.list_selected,
      option: option.list_selected
    }
  ]
}

const util = {
  // 匹配到就在前面或后面添加换行
  listText(text: string): string {
    if (isHalfWidth(text)) return text
    const { preset, customList } = profile.autolist
    for (const set of preset) {
      switch (set) {
        case AutoListPreset.Custom:
          if (!customList) break
          const params = string2ReplaceParam(customList)
          let _text = text
          params.forEach(param => {
            _text = _text.replace(param.regexp, param.newSubStr).trim()
          })
          if (text != _text) text = _text
          break
        case AutoListPreset.ChoiceQuestion:
        case AutoListPreset.ChineseNumber: {
          const regs = [
            /\s*([ABCD][.、]+)/g,
            /\s*([其第][一二三四五六七八九十][、，])/g
          ]
          const reg = regs[set - 1]
          const _text = text.replace(reg, "\n$1").trimStart()
          if (text.match(reg)?.length ?? 0 > 1) text = _text
          break
        }
        case AutoListPreset.Semicolon:
        case AutoListPreset.Period: {
          const regs = [/([;；])\s*/g, /(。)\s*/g]
          const reg = regs[set - 3]
          const _text = text.replace(reg, "$1\n").trimEnd()
          if (text.match(reg)?.length ?? 0 > 1) text = _text
          break
        }
      }
    }
    return text.replace(/\n{2,}/g, "\n").trim()
  }
}
const action: IActionMethod = {
  listSelected({ nodes, content, option }) {
    if (option !== ListSelected.AsAutoList && !content) return
    const params =
      option === ListSelected.AsAutoList ? [] : string2ReplaceParam(content)
    for (const node of nodes) {
      const notes = excerptNotes(node)
      for (const note of notes) {
        const text = note.excerptText
        if (!text) continue
        let _text = text
        if (option === ListSelected.AsAutoList) _text = util.listText(text)
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
