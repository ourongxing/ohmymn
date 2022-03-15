import { reverseEscape } from "utils/input"
import { isHalfWidth, countWord } from "utils/text"
import type { IConfig } from "typings"
import { cellViewType } from "typings/enum"
import { lang } from "./lang"
import { AutoTitlePreset } from "./enum"
import { profilePreset } from "profile"

const { option, intro, help, link, label } = lang

const profileTemp = {
  ...profilePreset.anotherautotitle
}

const configs: IConfig<typeof profileTemp, AnyProperty<string>> = {
  name: "Another AutoTitle",
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
      key: "wordCount",
      type: cellViewType.input,
      bind: [["preset", 1]],
      label: label.word_count
    },
    {
      key: "customBeTitle",
      type: cellViewType.input,
      help: help.custom_be_title,
      bind: [["preset", 0]],
      link
    },
    {
      key: "changeTitleNoLimit",
      type: cellViewType.switch,
      label: label.change_title_no_limit,
      help: help.change_title_no_limit
    }
  ]
}

const utils = {
  main(text: string) {
    const { preset, wordCount, changeTitleNoLimit } =
      self.profile.anotherautotitle
    const { cacheExcerptTitle } = self.docProfile.additional
    if (changeTitleNoLimit && self.isModify && cacheExcerptTitle[self.noteid])
      return {
        title: [text],
        text: ""
      }
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
        title: [newTitle],
        text: ""
      }
  }
}

const anotherautotitle = { configs, utils }
export default anotherautotitle
