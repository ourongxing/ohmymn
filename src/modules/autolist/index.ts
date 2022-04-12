import { IConfig, MbBookNote } from "@/typings"
import { CellViewType } from "@/typings/enum"
import {
  checkReplaceParamFromMNLink,
  checkReplaceParam
} from "@/utils/checkInput"
import { string2ReplaceParam, regFlag } from "@/utils/input"
import { getExcerptNotes } from "@/utils/note"
import { isHalfWidth, SerialCode } from "@/utils/text"
import { lang } from "./lang"
import { ListSelected, AutoListPreset } from "./typings"

const { intro, option, label, link, help } = lang

const configs: IConfig<"autolist"> = {
  name: "AutoList",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: option.preset,
      label: label.preset
    },
    {
      key: "customList",
      type: CellViewType.Input,
      help: help.custom_list,
      bind: [["preset", 0]],
      link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: label.list_selected,
      key: "listSelected",
      option: option.list_selected,
      method({ nodes, content, option }) {
        if (option == ListSelected.UseAutoList) {
          nodes.forEach(node => {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) note.excerptText = utils.main(note, text)
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
      },
      check({ input }) {
        checkReplaceParam(input)
      }
    }
  ]
}

const utils = {
  // 匹配到就在前面或后面添加换行
  main(note: MbBookNote, text: string): string {
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
              /\s*([\(（【\[]?\s*[0-9]{1,2}\s*[\)）\]】]?[.、，,]\D)|\s*([\(（【\[]\s*[0-9]{1,2}\s*[\)）\]】][.、，,]?)/g,
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

export default { configs, utils }
