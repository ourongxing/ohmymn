import { renderTemplateOfNodeProperties } from "@/jsExtension/nodeProperties"
import { IConfig, MbBookNote } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { string2ReplaceParam } from "@/utils/input"
import { getExcerptNotes } from "@/utils/note"
import { lang } from "./lang"
import { ReplaceSelected, AutoReplacePreset } from "./typings"

const { intro, link, label, option, help } = lang

const configs: IConfig<"autoreplace"> = {
  name: "AutoReplace",
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
      key: "customReplace",
      type: CellViewType.Input,
      help: help.custom_replace,
      bind: [["preset", 0]],
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
              if (text) note.excerptText = utils.main(node, text)
            })
          })
        } else if (content) {
          const params = string2ReplaceParam(content)
          nodes.forEach(node => {
            getExcerptNotes(node).forEach(note => {
              const text = note.excerptText
              if (text)
                note.excerptText = params.reduce(
                  (acc, params) =>
                    acc.replace(
                      params.regexp,
                      renderTemplateOfNodeProperties(node, params.newSubStr)
                    ),
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
  main(note: MbBookNote, text: string) {
    const { preset } = self.globalProfile.autoreplace
    for (const set of preset) {
      switch (set) {
        case AutoReplacePreset.Custom:
          const { customReplace: params } = self.tempProfile.replaceParam
          if (!params) continue
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
}

const autoreplace = { configs, utils }
export default autoreplace
