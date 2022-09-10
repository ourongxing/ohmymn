import { CellViewType } from "~/enum"
import { defineConfig } from "~/profile"
import { Addon } from "~/addon"
import { getExcerptNotes, isfileExists, readJSON } from "~/sdk"
import { OpenCC } from "~/modules/autosimplify/opencc"

export function simplifyText(text: string) {
  if (!Addon.OpenCC) {
    if (!isfileExists(Addon.path + "/simplified.json")) {
      throw "simplified.json not found"
    }
    Addon.OpenCC = new OpenCC(readJSON(Addon.path + "/simplified.json"))
  }
  // 大陆台湾香港
  const { taiwanIdiom, variant } = self.globalProfile.autosimplify
  const ret = (() => {
    if (variant[0] === 1) {
      if (taiwanIdiom) return Addon.OpenCC.taiwanToSimplifiedWithPhrases(text)
      else return Addon.OpenCC.taiwanToSimplified(text)
    } else if (variant[0] === 2) return Addon.OpenCC.hongKongToSimplified(text)
    else return Addon.OpenCC.traditionalToSimplified(text)
  })()
  const { customSimplify: params } = self.tempProfile.replaceParam
  return (
    params?.reduce(
      (acc, param) => acc.replace(param.regexp, param.newSubStr),
      ret
    ) ?? ret
  )
}

export default defineConfig({
  name: "AutoSimplify",
  key: "autosimplify",
  intro: "自动转换为简体中文",
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: "摘录时自动执行",
      help: "【当前文档】",
      auto: {
        modifyExcerptText: {
          index: 20,
          method({ text }) {
            return simplifyText(text)
          }
        }
      }
    },
    {
      key: "variant",
      type: CellViewType.Select,
      label: "异体字转换",
      option: ["中国大陆", "中国台湾", "中国香港"]
    },
    {
      key: "taiwanIdiom",
      type: CellViewType.Switch,
      label: "台湾特殊用词转换",
      bind: ["variant", 1]
    },
    {
      key: "customSimplify",
      type: CellViewType.Input,
      help: "自定义转换，点击查看自定义方法"
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: "转换为简体中文",
      key: "simplifyCard",
      option: ["摘录和标题", "仅摘录", "仅标题"],
      method: ({ nodes, option }) => {
        nodes.forEach(node => {
          if (option == 0 || option == 1) {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) note.excerptText = simplifyText(text)
            })
          }
          if ((option == 0 || option == 2) && node.noteTitle) {
            node.noteTitle = simplifyText(node.noteTitle)
          }
        })
      }
    }
  ]
})
