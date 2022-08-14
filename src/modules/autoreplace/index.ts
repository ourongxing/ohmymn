import { renderTemplateOfNodeProperties } from "~/jsExtension/nodeProperties"
import { MbBookNote } from "~/typings"
import { CellViewType } from "~/typings/enum"
import { defineConfig } from "~/profile"
import { escapeDoubleQuote, string2ReplaceParam } from "~/utils/input"
import { getExcerptNotes } from "~/utils/note"
import { lang } from "./lang"
import { ReplaceSelected, AutoReplacePreset } from "./typings"

const { intro, link, label, option, help } = lang

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
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
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
      option: option.preset,
      label: label.preset
    },
    {
      key: "customReplace",
      type: CellViewType.Input,
      help: help.custom_replace,
      bind: ["preset", 0],
      link
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: label.replace_selected,
      key: "replaceSelected",
      option: option.replace_selected,
      method: ({ content, nodes, option }) => {
        if (option == ReplaceSelected.UseAutoReplace) {
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
