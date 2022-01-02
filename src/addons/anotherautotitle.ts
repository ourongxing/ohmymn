import { profile } from "profile"
import { log } from "utils/common"
import { reverseEscape, string2RegArray } from "utils/input"
import { isHalfWidth, countWord } from "utils/text"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"

const option = {
  hasTitleThen: ["作为摘录", "标题链接", "覆盖标题"],
  preset: ["自定义", "字数限制", "不含有点号"],
  switchTitle: ["切换为不存在的", "交换标题和摘录"]
}

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
  intro: "更强大的自动转换标题插件",
  settings: [
    {
      key: "hasTitleThen",
      type: cellViewType.select,
      label: "标题存在，继续摘录",
      help: "也要先满足预设条件",
      option: option.hasTitleThen
    },
    {
      key: "changeTitleNoLimit",
      type: cellViewType.switch,
      label: "拓宽标题摘录不受限制"
    },
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: option.preset,
      label: "选择需要的预设"
    },
    {
      key: "wordCount",
      type: cellViewType.inlineInput,
      label: "设定最多字数"
    },
    {
      key: "customBeTitle",
      type: cellViewType.input,
      label: "自定义，点击查看具体格式",
      link: "https://busiyi.notion.site/AnotherAutoTitle-bef78c75901e4895b4fa2d03d83c48d6"
    }
  ],
  actions: [
    {
      type: cellViewType.button,
      label: "切换摘录或标题",
      key: "switchTitle",
      option: option.switchTitle,
      help: "当两者都存在时请使用「交换标题和摘录」"
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
          log("实际字数：" + actualNum, "autotitle")
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
