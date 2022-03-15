import { getExcerptNotes } from "utils/note"
import { regFlag, string2ReplaceParam } from "utils/input"
import { isHalfWidth, SerialCode } from "utils/text"
import type { IConfig } from "typings"
import { cellViewType } from "typings/enum"
import { lang } from "./lang"
import { ActionKey, AutoListPreset, ListSelected } from "./enum"
import { profilePreset } from "profile"

const { intro, option, label, link, help } = lang
const profileTemp = {
  ...profilePreset.autolist
}

const configs: IConfig<typeof profileTemp, typeof ActionKey> = {
  name: "AutoList",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: label.on
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
      help: help.custom_list,
      bind: [["preset", 0]],
      link
    }
  ],
  actions4card: [
    {
      type: cellViewType.buttonWithInput,
      label: label.list_selected,
      key: "listSelected",
      option: option.list_selected,
      method: ({ nodes, content, option }) => {
        if (option == ListSelected.UseAutoList) {
          nodes.forEach(node => {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) note.excerptText = utils.main(text)
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
  ]
}

const utils = {
  // 匹配到就在前面或后面添加换行
  main(text: string): string {
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

const autolist = { configs, utils }
export default autolist
