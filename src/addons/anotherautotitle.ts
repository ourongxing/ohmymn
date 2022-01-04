import { profile } from "profile"
import { reverseEscape, string2RegArray } from "utils/input"
import { isHalfWidth, countWord } from "utils/text"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"

const { option, intro, help, link, label } = lang.addon.anotherautotitle

export const enum HasTitleThen {
  ExpertText,
  TitleLink,
  OverrideTitle
}

export const enum AutoTitlePreset {
  Custom,
  WordLimit,
  NoPunctuation
}
export const enum SwitchTitle {
  ToNonexistent,
  Exchange
}

const config: IConfig = {
  name: "AnotherAutoTitle",
  intro,
  settings: [
    {
      key: "hasTitleThen",
      type: cellViewType.select,
      label: label.has_title_then,
      help: help.has_title_then,
      option: option.has_title_then
    },
    {
      key: "changeTitleNoLimit",
      type: cellViewType.switch,
      label: label.change_title_no_limit
    },
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: option.preset,
      label: label.preset
    },
    {
      key: "wordCount",
      type: cellViewType.inlineInput,
      label: label.word_count
    },
    {
      key: "customBeTitle",
      type: cellViewType.input,
      label: label.custom_be_title,
      link
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

const util = {
  checkGetTitle(text: string) {
    const { preset, wordCount, customBeTitle } = profile.anotherautotitle
    for (const set of preset) {
      switch (set) {
        case AutoTitlePreset.Custom:
          if (!customBeTitle) break
          const regs = string2RegArray(customBeTitle)
          // 全部匹配到才转为标题
          if (regs.every(reg => reg.test(text)))
            return {
              title: text
            }
          break
        case AutoTitlePreset.NoPunctuation:
          if (!wordCount) break
          const limitedNum = reverseEscape(wordCount)
          const actualNum = countWord(text)
          const isTitle =
            typeof limitedNum == "number"
              ? actualNum <= limitedNum
              : isHalfWidth(text)
              ? actualNum <= limitedNum[1]
              : actualNum <= limitedNum[0]
          if (isTitle)
            return {
              title: text
            }
          break
        case AutoTitlePreset.WordLimit:
          const reg = /[。.、？?！!，,；;：:]/
          if (!reg.test(text))
            return {
              title: text
            }
      }
    }
  }
}
const action: IActionMethod = {
  switchTitle({ nodes, option }) {
    for (const note of nodes) {
      const title = note.noteTitle ?? ""
      const text = note.excerptText ? note.excerptText.replace(/\*\*/g, "") : ""
      switch (<SwitchTitle>option) {
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
