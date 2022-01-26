import { excerptNotes } from "utils/note"
import { string2ReplaceParam } from "utils/input"
import { isHalfWidth } from "utils/text"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"

const { help, intro, option, label, link } = lang.module.autolist
export const enum AutoListPreset {
  Custom,
  ChoiceQuestion,
  ChineseNumber,
  Semicolon,
  Period
}
const config: IConfig = {
  name: "AutoList",
  intro,
  link,
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
      bind: [["preset", 0]],
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
    const { preset } = self.profile.autolist
    for (const set of preset) {
      switch (set) {
        case AutoListPreset.Custom:
          const { customList: params } = self.profileTemp.replaceParam
          if (!params) continue
          text = params.reduce(
            (acc, param) => acc.replace(param.regexp, param.newSubStr),
            text
          )
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

const enum ListSelected {
  UseAutoList
}

const action: IActionMethod = {
  listSelected({ nodes, content, option }) {
    if (option == ListSelected.UseAutoList) {
      nodes.forEach(node => {
        excerptNotes(node).forEach(note => {
          const text = note.excerptText
          if (text) note.excerptText = util.listText(text)
        })
      })
    } else if (content) {
      const params = string2ReplaceParam(content)
      nodes.forEach(node => {
        excerptNotes(node).forEach(note => {
          const text = note.excerptText
          if (text)
            note.excerptText = params.reduce(
              (acc, params) => acc.replace(params.regexp, params.newSubStr),
              text
            )
        })
      })
    }
  }
}

export { config, util, action }
