import { reverseEscape } from "utils/input"
import { isHalfWidth, countWord } from "utils/text"
import type { ICheckMethod, IConfig } from "typings"
import { CellViewType } from "typings/enum"
import { lang } from "./lang"
import { AutoTitlePreset } from "./enum"
import { profilePreset } from "profile"
import { checkRegArrayFromMNLink } from "utils/checkInput"

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
      key: "wordCount",
      type: CellViewType.Input,
      bind: [["preset", 1]],
      help: label.word_count
    },
    {
      key: "customBeTitle",
      type: CellViewType.Input,
      help: help.custom_be_title,
      bind: [["preset", 0]],
      link
    },
    {
      key: "changeTitleNoLimit",
      type: CellViewType.Switch,
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

const checker: ICheckMethod<PickByValue<typeof profileTemp, string>> = (
  input,
  key
) => {
  switch (key) {
    case "wordCount": {
      input = reverseEscape(input)
      if (
        Array.isArray(input) &&
        input.length == 2 &&
        input.every(item => Number.isInteger(item))
      ) {
      } else throw "格式错误"
      break
    }
    case "customBeTitle":
      checkRegArrayFromMNLink(input)
    default:
      return undefined
  }
}

const anotherautotitle = { configs, utils, checker }
export default anotherautotitle