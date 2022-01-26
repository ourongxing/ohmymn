import { reverseEscape } from "utils/input"
import { isHalfWidth, countWord } from "utils/text"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"
import { MbBookNote } from "types/MarginNote"

const { option, intro, help, link, label } = lang.module.anotherautotitle

const config: IConfig = {
  name: "AnotherAutoTitle",
  intro,
  link,
  settings: [
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: option.preset,
      label: label.preset
    },
    {
      key: "wordCount",
      type: cellViewType.input,
      bind: [["preset", 1]],
      label: label.word_count
    },
    {
      key: "customBeTitle",
      type: cellViewType.input,
      label: label.custom_be_title,
      bind: [["preset", 0]],
      link
    },
    {
      key: "changeTitleNoLimit",
      type: cellViewType.switch,
      label: label.change_title_no_limit,
      help: help.change_title_no_limit
    }
  ],
  actions: [
    {
      key: "switchTitle",
      type: cellViewType.button,
      label: label.switch_title,
      option: option.switch_title,
      help: help.switch_title
    }
  ]
}
export const enum AutoTitlePreset {
  Custom,
  WordLimit,
  NoPunctuation
}

const util = {
  isBroadened(oldStr: string, newStr: string) {
    return (
      oldStr &&
      oldStr.length >= 2 &&
      (newStr.startsWith(oldStr) || newStr.endsWith(oldStr))
    )
  },
  getTitle(text: string, note: MbBookNote) {
    const { preset, wordCount, changeTitleNoLimit } =
      self.profile.anotherautotitle
    if (
      changeTitleNoLimit &&
      note.noteTitle &&
      this.isBroadened(note.noteTitle, text)
    ) {
      return {
        title: text
      }
    }

    for (const set of preset) {
      switch (set) {
        case AutoTitlePreset.Custom:
          const { customBeTitle: regGroup } = self.profileTemp.regArray
          if (!regGroup) continue
          if (regGroup.some(regs => regs.every(reg => reg.test(text))))
            return {
              title: text
            }
          break
        case AutoTitlePreset.WordLimit:
          if (!wordCount) continue
          const [zh, en] = reverseEscape(wordCount) as number[]
          if (countWord(text) <= (isHalfWidth(text) ? en : zh))
            return {
              title: text
            }
          break
        case AutoTitlePreset.NoPunctuation:
          const reg = /[。.、？?！!，,；;：:]/
          if (!reg.test(text))
            return {
              title: text
            }
      }
    }
  }
}

export const enum SwitchTitle {
  ToNonexistent,
  Exchange
}

const action: IActionMethod = {
  switchTitle({ nodes, option }) {
    for (const note of nodes) {
      const title = note.noteTitle ?? ""
      const text = note.excerptText ? note.excerptText.replace(/\*\*/g, "") : ""
      switch (option) {
        case SwitchTitle.ToNonexistent:
          // 只允许存在一个
          if ((title || text) && !(title && text)) {
            note.noteTitle = text
            note.excerptText = title
          } else if (title == text) note.noteTitle = ""
          break
        case SwitchTitle.Exchange:
          note.noteTitle = text
          note.excerptText = title
          break
      }
    }
  }
}

export { config, util, action }
