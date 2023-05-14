import { CellViewType } from "~/typings"
import { defineConfig } from "~/profile"
import { serialSymbols, reverseEscape, doc } from "~/utils"
import lang from "./lang"
import { ChangeStyle } from "./typings"
import { modifyStyle } from "./utils"
import { undoGroupingWithRefresh } from "marginnote"

const colors = lang.$color17.map((color, index) =>
  index ? serialSymbols.hollow_circle_number[index - 1] + " " + color : color
)

export default defineConfig({
  name: "AutoStyle",
  key: "autostyle",
  intro: lang.intro,
  link: doc("autostyle"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
      auto: {
        modifyStyle({ note }) {
          return modifyStyle(note, true)
        }
      }
    },
    {
      key: "preset",
      type: CellViewType.MuiltSelect,
      option: lang.preset.$option4,
      label: lang.preset.label
    },
    {
      key: "showArea",
      type: CellViewType.Switch,
      bind: ["preset", 0],
      label: lang.show_area
    },
    {
      key: "wordCountArea",
      type: CellViewType.Input,
      bind: ["preset", 0],
      help: lang.word_count_area.help,
      check({ input }) {
        input = reverseEscape(input)
        if (!Array.isArray(input)) throw lang.word_count_area.input_array
        if (input.length !== 3) throw lang.word_count_area.input_three_number
        if (input.some(item => !Number.isInteger(item)))
          throw lang.enter_positive
      }
    },
    {
      key: "defaultTextExcerptColor",
      type: CellViewType.Select,
      label: lang.default_text_excerpt_color,
      option: colors
    },
    {
      key: "defaultTextExcerptStyle",
      type: CellViewType.Select,
      label: lang.default_text_excerpt_style,
      option: lang.$style4
    },
    {
      key: "defaultPicExcerptColor",
      type: CellViewType.Select,
      label: lang.default_pic_excerpt_color,
      option: colors
    },
    {
      key: "defaultPicExcerptStyle",
      type: CellViewType.Select,
      label: lang.default_pic_excerpt_style,
      option: lang.$style4
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: lang.change_color.label,
      key: "changeColor",
      option: lang.change_color.$option2,
      help: lang.change_color.help,
      method({ content, nodes, option }) {
        undoGroupingWithRefresh(() => {
          if (option === ChangeStyle.UseAutoStyle) {
            for (const node of nodes) {
              node.notes.forEach(note => {
                const { color } = modifyStyle(note)
                if (color !== undefined)
                  note.colorIndex = color !== -1 ? color : 12
              })
            }
          } else if (content) {
            const color = Number(content) - 1
            for (const node of nodes) {
              node.notes.forEach(note => {
                note.colorIndex = color
              })
            }
          }
        })
      },
      check({ input }) {
        const index = Number(input)
        if (!Number.isInteger(index)) throw lang.enter_positive
        if (index > 16 || index < 1) throw lang.change_color.out_of_range
      }
    },
    {
      type: CellViewType.Button,
      label: lang.change_style.lable,
      key: "changeStyle",
      option: lang.change_style.$option4,
      method({ option, nodes }) {
        undoGroupingWithRefresh(() => {
          if (option === ChangeStyle.UseAutoStyle) {
            for (const node of nodes) {
              node.notes.forEach(note => {
                const { style } = modifyStyle(note)
                if (style !== undefined) note.fillIndex = style
              })
            }
          } else {
            const style = option - 1
            for (const node of nodes) {
              node.notes.forEach(note => {
                note.fillIndex = style
              })
            }
          }
        })
      }
    }
  ]
})
