import { CellViewType } from "~/typings/enum"
import { defineConfig } from "~/defaultProfile"
import { removeHighlight } from "~/sdk"
import {
  checkRegArrayFromMNLink,
  reverseEscape,
  countWord,
  notCJK
} from "~/utils"
import { lang } from "./lang"
import { AutoTitlePreset } from "./typings"
const { option, intro, help, link, label, check } = lang

function turn2Title(text: string) {
  const { preset, wordCount, changeTitleNoLimit } =
    self.globalProfile.anotherautotitle
  const { cacheTitle } = self.notebookProfile.additional
  if (self.isModify) text = removeHighlight(text)
  if (changeTitleNoLimit && self.isModify && cacheTitle[self.noteid])
    return {
      title: [text],
      text: ""
    }
  const newTitle = (() => {
    for (const set of preset) {
      switch (set) {
        case AutoTitlePreset.Custom:
          const { customBeTitle: regGroup } = self.tempProfile.regArray
          if (!regGroup) continue
          if (regGroup.some(regs => regs.every(reg => reg.test(text))))
            return text
          break
        case AutoTitlePreset.WordLimit:
          if (!wordCount) continue
          const [zh, en] = reverseEscape(wordCount) as number[]
          if (countWord(text) <= (notCJK(text) ? en : zh)) return text
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

export default defineConfig({
  name: "Another AutoTitle",
  key: "anotherautotitle",
  intro,
  link,
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: label.on,
      auto: {
        generateTitles: {
          index: 999,
          method({ text }) {
            return turn2Title(text)
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
      key: "wordCount",
      type: CellViewType.Input,
      bind: ["preset", 1],
      help: label.word_count,
      check({ input }) {
        input = reverseEscape(input)
        if (!Array.isArray(input)) throw check.input_array
        if (input.length !== 2) throw check.input_three_number
        if (input.some(item => !Number.isInteger(item)))
          throw check.enter_positive
      }
    },
    {
      key: "customBeTitle",
      type: CellViewType.Input,
      help: help.custom_be_title,
      bind: ["preset", 0],
      link: "https://ohmymn.vercel.app/guide/modules/anotherautotitle.html#自定义",
      check({ input }) {
        checkRegArrayFromMNLink(input)
      }
    },
    {
      key: "changeTitleNoLimit",
      type: CellViewType.Switch,
      label: label.change_title_no_limit,
      help: help.change_title_no_limit
    }
  ]
})
