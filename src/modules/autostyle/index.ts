import { CellViewType } from "~/typings/enum"
import { defineConfig } from "~/profile"
import { reverseEscape } from "~/utils/input"
import { getExcerptNotes } from "~/utils/note"
import { SerialCode } from "~/utils/text"
import { lang } from "./lang"
import { ChangeStyle } from "./typings"
import { modifyStyle } from "./utils"

const { help, intro, option, label, link, check } = lang

const colors = option.color.map((color, index) =>
  index ? SerialCode.hollow_circle_number[index - 1] + " " + color : color
)

export default defineConfig({
  name: "AutoStyle",
  key: "autostyle",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      auto: {
        modifyStyle({ note }) {
          return modifyStyle(note)
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
      key: "showArea",
      type: CellViewType.Switch,
      bind: ["preset", 0],
      label: label.show_area
    },
    {
      key: "wordCountArea",
      type: CellViewType.Input,
      bind: ["preset", 0],
      help: label.word_count_area,
      check({ input }) {
        input = reverseEscape(input)
        if (!Array.isArray(input)) throw check.input_array
        if (input.length !== 3) throw check.input_three_number
        if (input.some(item => !Number.isInteger(item)))
          throw lang.check.enter_positive
      }
    },
    {
      key: "defaultTextExcerptColor",
      type: CellViewType.Select,
      label: label.default_text_excerpt_color,
      option: colors
    },
    {
      key: "defaultTextExcerptStyle",
      type: CellViewType.Select,
      label: label.default_text_excerpt_style,
      option: option.style
    },
    {
      key: "defaultPicExcerptColor",
      type: CellViewType.Select,
      label: label.default_pic_excerpt_color,
      option: colors
    },
    {
      key: "defaultPicExcerptStyle",
      type: CellViewType.Select,
      label: label.default_pic_excerpt_style,
      option: option.style
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: label.change_color,
      key: "changeColor",
      option: option.change_color,
      help: help.change_color,
      method({ content, nodes, option }) {
        if (option === ChangeStyle.UseAutoStyle) {
          for (const node of nodes) {
            getExcerptNotes(node).forEach(note => {
              const { color } = modifyStyle(note)
              if (color !== undefined)
                note.colorIndex = color !== -1 ? color : 12
            })
          }
        } else if (content) {
          const color = Number(content) - 1
          for (const node of nodes) {
            getExcerptNotes(node).forEach(note => {
              note.colorIndex = color
            })
          }
        }
      },
      check({ input }) {
        const index = Number(input)
        if (!Number.isInteger(index)) throw check.enter_positive
        if (index > 16 || index < 1) throw check.out_of_range
      }
    },
    {
      type: CellViewType.Button,
      label: label.change_style,
      key: "changeStyle",
      option: option.change_style,
      method({ option, nodes }) {
        if (option === ChangeStyle.UseAutoStyle) {
          for (const node of nodes) {
            getExcerptNotes(node).forEach(note => {
              const { style } = modifyStyle(note)
              if (style !== undefined) note.fillIndex = style
            })
          }
        } else {
          const style = option - 1
          for (const node of nodes) {
            getExcerptNotes(node).forEach(note => {
              note.fillIndex = style
            })
          }
        }
      }
    }
  ]
})
