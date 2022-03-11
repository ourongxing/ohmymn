import { getExcerptNotes } from "utils/note"
import { regFlag, string2ReplaceParam } from "utils/input"
import { isHalfWidth, SerialCode } from "utils/text"
import type { IActionMethod4Card, IConfig, Methods } from "typings"
import { cellViewType } from "typings/enum"
import lang from "lang"

const { intro, option, label, link } = lang.module.autolist
const configs: IConfig = {
  name: "AutoList",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: lang.module.more.auto
    },
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
  actions4card: [
    {
      type: cellViewType.buttonWithInput,
      label: label.list_selected,
      key: "listSelected",
      option: option.list_selected
    }
  ]
}

export const enum AutoListPreset {
  Custom,
  Letter
}

const utils = {
  // 匹配到就在前面或后面添加换行
  listText(text: string): string {
    const { preset } = self.profile.autolist
    for (const set of preset) {
      switch (set) {
        case AutoListPreset.Custom:
          const { customList: params } = self.profileTemp.replaceParam
          if (!params) continue
          text = params.reduce((acc, param) => {
            param.regexp = regFlag.add(param.regexp, "g")
            const len = acc.match(param.regexp)?.length
            // 必须有两个满足条件才生效
            return len && len > 1
              ? acc.replace(param.regexp, param.newSubStr)
              : acc
          }, text)
          break
        case AutoListPreset.Letter:
          if (isHalfWidth(text)) continue
          const param: [RegExp, string] = [/\s*([A-Za-z][.、，,])/g, "\n$1"]
          const len = text.match(param[0])?.length
          if (len && len > 1) text = text.replace(param[0], param[1])
          break
        default: {
          const params: [RegExp, string][] = [
            [
              new RegExp(
                `\s*([其第]?[${SerialCode.chinese_number}]{1,2}[.、，,])|\s*([其第][${SerialCode.chinese_number}]{1,2}是?[.、，,]?)`,
                "g"
              ),
              "\n$1$2"
            ],
            [
              /\s*([\(（【\[]?\s*[0-9]{1,2}\s*[\)）\]】]?[.、，,])|\s*([\(（【\[]\s*[0-9]{1,2}\s*[\)）\]】][.、，,]?)/g,
              "\n$1$2"
            ]
          ]
          const param = params[set - 2]
          const len = text.match(param[0])?.length
          if (len && len > 1) text = text.replace(param[0], param[1])
          break
        }
      }
    }
    return text.replace(/\n{2,}/g, "\n").trim()
  }
}

enum ListSelected {
  UseAutoList
}
const actions4card: Methods<IActionMethod4Card> = {
  listSelected({ nodes, content, option }) {
    if (option == ListSelected.UseAutoList) {
      nodes.forEach(node => {
        getExcerptNotes(node).forEach(note => {
          const text = note.excerptText
          if (text) note.excerptText = utils.listText(text)
        })
      })
    } else if (content) {
      const params = string2ReplaceParam(content)
      nodes.forEach(node => {
        getExcerptNotes(node).forEach(note => {
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

export { configs, utils, actions4card }
