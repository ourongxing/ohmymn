import type { IActionMethod4Card, IConfig, Methods } from "typings"
import { cellViewType } from "typings/enum"
import { lang } from "./lang"
import { getExcerptNotes, getNoteById, removeHighlight } from "utils/note"
import { MbBookNote } from "typings"
import { countWord, isHalfWidth, SerialCode } from "utils/text"
import { reverseEscape } from "utils/input"
import { showHUD } from "utils/common"

const { help, intro, option, label, link } = lang

const colors = option.color.map((color, index) =>
  index ? SerialCode.hollow_circle_number[index - 1] + " " + color : color
)

const configs: IConfig = {
  name: "AutoStyle",
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
      key: "showArea",
      type: cellViewType.switch,
      bind: [["preset", 0]],
      label: label.show_area
    },
    {
      key: "wordCountArea",
      type: cellViewType.input,
      bind: [["preset", 0]],
      label: label.word_count_area
    },
    {
      key: "defaultTextExcerptColor",
      type: cellViewType.select,
      label: label.default_text_excerpt_color,
      option: colors
    },
    {
      key: "defaultTextExcerptStyle",
      type: cellViewType.select,
      label: label.default_text_excerpt_style,
      option: option.style
    },
    {
      key: "defaultPicExcerptColor",
      type: cellViewType.select,
      label: label.default_pic_excerpt_color,
      option: colors
    },
    {
      key: "defaultPicExcerptStyle",
      type: cellViewType.select,
      label: label.default_pic_excerpt_style,
      option: option.style
    }
  ],
  actions4card: [
    {
      type: cellViewType.buttonWithInput,
      label: label.change_color,
      key: "changeColor",
      option: option.change_color,
      help: help.change_color
    },
    {
      type: cellViewType.button,
      label: label.change_style,
      key: "changeStyle",
      option: option.change_style
    }
  ]
}

export const enum AutoStylePreset {
  StyleByWordCountAndArea,
  ColorFollowCard,
  ColorFollowBrother,
  ColorFollowParents
}

const utils = {
  getExcerptArea(note: MbBookNote) {
    const [x1, y1, x2, y2] = (
      reverseEscape(`[${note.startPos},${note.endPos}]`) as number[]
    ).map(item => Number(item))
    return Math.floor(Math.abs((x1 - x2) * (y2 - y1)) / 100)
  },
  getColorStyle(note: MbBookNote) {
    // 就跟随卡片 => 跟随兄弟节点 => 跟随父节点 => 默认 => 不动
    const {
      preset,
      showArea,
      wordCountArea,
      defaultPicExcerptColor,
      defaultPicExcerptStyle,
      defaultTextExcerptColor,
      defaultTextExcerptStyle
    } = self.profile.autostyle

    const color = note.excerptPic
      ? defaultPicExcerptColor[0] !== 0
        ? defaultPicExcerptColor[0] - 1
        : undefined
      : defaultTextExcerptColor[0] !== 0
      ? defaultTextExcerptColor[0] - 1
      : undefined

    const style = note.excerptPic
      ? defaultPicExcerptStyle[0] !== 0
        ? defaultPicExcerptStyle[0] - 1
        : undefined
      : defaultTextExcerptStyle[0] !== 0
      ? defaultTextExcerptStyle[0] - 1
      : undefined

    const res = {
      color,
      style
    }

    const nodeNote = note.groupNoteId ? getNoteById(note.groupNoteId) : note
    if (
      preset.includes(AutoStylePreset.StyleByWordCountAndArea) &&
      wordCountArea
    ) {
      const [zh, en, area] = reverseEscape(wordCountArea) as number[]
      if (note.excerptPic) {
        const actualArea = utils.getExcerptArea(note)
        if (actualArea > area) res.style = 2
        if (showArea) showHUD(lang.area + ": " + actualArea)
        // 0 线框+填充 1 填充 2 线框
      } else if (note.excerptText) {
        // 排除划重点的影响
        const text = removeHighlight(note.excerptText)
        if (countWord(text) > (isHalfWidth(text) ? en : zh)) res.style = 2
      }
    }

    for (const set of preset)
      switch (set) {
        case AutoStylePreset.ColorFollowCard:
          if (note.groupNoteId) {
            res.color = nodeNote.colorIndex
            return res
          }
          break
        case AutoStylePreset.ColorFollowBrother:
          const len = nodeNote.parentNote?.childNotes?.length
          if (len && len > 1) {
            res.color = nodeNote.parentNote.childNotes[0].colorIndex
            return res
          }
          break
        case AutoStylePreset.ColorFollowParents:
          if (nodeNote.parentNote) {
            res.color = nodeNote.parentNote.colorIndex
            return res
          }
      }
    return res
  }
}

enum ChangeStyle {
  UseAutoStyle
}

const actions4card: Methods<IActionMethod4Card> = {
  changeColor({ content, nodes, option }) {
    if (option === ChangeStyle.UseAutoStyle) {
      for (const node of nodes) {
        getExcerptNotes(node).forEach(note => {
          const { color } = utils.getColorStyle(note)
          if (color !== undefined) note.colorIndex = color !== -1 ? color : 12
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
  changeStyle({ option, nodes }) {
    if (option === ChangeStyle.UseAutoStyle) {
      for (const node of nodes) {
        getExcerptNotes(node).forEach(note => {
          const { style } = utils.getColorStyle(note)
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

export { configs, utils, actions4card }
