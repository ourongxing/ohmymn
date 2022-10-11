import { getExcerptNotes, MbBookNote } from "marginnote"
import { renderTemplateOfNodeProperties } from "~/jsExtension/nodeProperties"
import { defineConfig } from "~/profile"
import { CellViewType } from "~/typings"
import { doc, escapeDoubleQuote, string2ReplaceParam } from "~/utils"
import { lang } from "./lang"
import { AutoReplacePreset, ReplaceCard } from "./typings"

function replaceText(note: MbBookNote, text: string) {
  const { preset } = self.globalProfile.autoreplace
  for (const set of preset) {
    switch (set) {
      case AutoReplacePreset.Custom:
        const { customReplace: params } = self.tempProfile.replaceParam
        if (!params?.length) continue
        text = params.reduce(
          (acc, param) =>
            acc.replace(
              param.regexp,
              renderTemplateOfNodeProperties(note, param.newSubStr)
            ),
          text
        )
    }
  }
  return text
}

export default defineConfig({
  name: "AutoReplace",
  key: "autoreplace",
  intro: lang.intro,
  link: doc("autoreplace"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        modifyExcerptText: {
          index: 999,
          method({ note, text }) {
            return replaceText(note, text)
          }
        }
      }
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: lang.preset.$option1,
      label: lang.preset.label
    },
    {
      key: "customReplace",
      type: CellViewType.Input,
      help: lang.custom_replace.help,
      bind: ["preset", 0],
      link: lang.custom_replace.link
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: lang.replace_selected.label,
      key: "replaceCard",
      option: lang.replace_selected.$option2,
      method: ({ content, nodes, option }) => {
        if (option == ReplaceCard.UseAutoReplace) {
          nodes.forEach(node => {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) note.excerptText = replaceText(node, text)
            })
          })
        } else if (content) {
          content = /^\(.*\)$/.test(content)
            ? content
            : `(/^.*$/gs, "${escapeDoubleQuote(content)}")`
          const params = string2ReplaceParam(content)
          nodes.forEach(node => {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text) {
                note.excerptText = params.reduce((acc, params) => {
                  return acc.replace(
                    params.regexp,
                    renderTemplateOfNodeProperties(node, params.newSubStr)
                  )
                }, text)
              }
            })
          })
        }
      }
    }
  ]
})
