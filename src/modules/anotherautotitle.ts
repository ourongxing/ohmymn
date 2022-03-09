import { reverseEscape } from "utils/input"
import { isHalfWidth, countWord } from "utils/text"
import { cellViewType, IConfig } from "types/Addon"
import lang from "lang"

const { option, intro, help, link, label } = lang.module.anotherautotitle

const config: IConfig = {
  name: "AnotherAutoTitle",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: lang.module.more.auto
    },
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
  actions: []
}
export const enum AutoTitlePreset {
  Custom,
  WordLimit,
  NoPunctuation
}

const util = {
  /**
   * @param text 先去除划重点
   */
  getTitle(text: string) {
    const { preset, wordCount } = self.profile.anotherautotitle
    const newTitle = (() => {
      for (const set of preset) {
        switch (set) {
          case AutoTitlePreset.Custom:
            const { customBeTitle: regGroup } = self.profileTemp.regArray
            if (!regGroup) continue
            if (regGroup.some(regs => regs.every(reg => reg.test(text))))
              return text
            break
          case AutoTitlePreset.WordLimit:
            if (!wordCount) continue
            const [zh, en] = reverseEscape(wordCount) as number[]
            if (countWord(text) <= (isHalfWidth(text) ? en : zh)) return text
            break
          case AutoTitlePreset.NoPunctuation:
            const reg = /[。.、？?！!，,；;：:]/
            if (!reg.test(text)) return text
        }
      }
    })()
    if (newTitle)
      return {
        text: "",
        title: [newTitle]
      }
  }
}
export { config, util }
