import { CellViewType } from "~/typings"
import { defineConfig } from "~/profile"
import { removeHighlight } from "marginnote"
import {
  checkRegArrayFromMNLink,
  reverseEscape,
  countWord,
  notCJK,
  doc
} from "~/utils"
import lang from "./lang"
import { AutoTitlePreset } from "./typings"

function turn2Title(text: string) {
  const { preset, wordCount } = self.globalProfile.anotherautotitle
  if (self.excerptStatus.isModify) text = removeHighlight(text)
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
  intro: lang.intro,
  link: doc("anotherautotitle"),
  settings: [
    {
      key: "on",
      type: CellViewType.Switch,
      label: lang.on,
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
      option: lang.preset.$option3,
      label: lang.preset.label
    },
    {
      key: "customBeTitle",
      type: CellViewType.Input,
      help: lang.custom_be_title.help,
      bind: ["preset", 0],
      link: lang.custom_be_title.link,
      check({ input }) {
        checkRegArrayFromMNLink(input)
      }
    },
    {
      key: "wordCount",
      type: CellViewType.Input,
      bind: ["preset", 1],
      help: lang.word_count.help,
      check({ input }) {
        input = reverseEscape(input)
        if (!Array.isArray(input)) throw lang.word_count.input_array
        if (input.length !== 2) throw lang.word_count.input_three_number
        if (input.some(item => !Number.isInteger(item)))
          throw lang.word_count.enter_positive
      }
    }
  ]
})
