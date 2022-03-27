import { lang } from "./lang"
import type { IConfig, MbBookNote, ISettingInput, ICheckMethod } from "typings"
import { CellViewType, UIAlertViewStyle } from "typings/enum"
import { openUrl, popup, showHUD } from "utils/common"
import { escapeDoubleQuote, reverseEscape } from "utils/input"
import { getExcerptText } from "utils/note"
import { byteSlice } from "utils/text"
import { ActionKey, MultipleTitlesExcerpt, WhichPartofCard } from "./enum"
import { IDocProfile, IProfile } from "profile"
import { Addon } from "const"
import { checkPlainText } from "utils/checkInput"
import { renderTemplateOfNodeProperties } from "jsExtension/nodeProperties"
const { link, intro, lable, option, help, hud } = lang

const configs: IConfig<
  (IProfile & IDocProfile)["copysearch"],
  typeof ActionKey
> = {
  name: "CopySearch",
  intro,
  link,
  settings: [
    {
      label: lable.which_partof_card,
      key: "whichPartofCard",
      type: CellViewType.Select,
      option: option.which_partof_card,
      help: help.which_partof_card
    },
    {
      label: lable.multiple_titles,
      key: "multipleTitles",
      type: CellViewType.Select,
      option: option.multiple_titles
    },
    {
      label: lable.multiple_excerpts,
      key: "multipleExcerpts",
      type: CellViewType.Select,
      option: option.multiple_excerpts
    },
    {
      label: lable.separator_symbols_multiple_card,
      help: help.separator_symbols_multiple_card,
      key: "separatorSymbols",
      type: CellViewType.InlineInput
    },
    {
      help: lable.custom_copy,
      key: "customContent",
      link,
      type: CellViewType.Input
    },
    {
      label: lable.show_search_engine,
      key: "showSearchEngine",
      type: CellViewType.Switch,
      link,
      help: help.show_search_engine
    },
    ...([
      "searchChineseText",
      "searchEnglishText",
      "searchWord",
      "searchTranslation",
      "searchAcademic",
      "searchQuestion",
      "searchOtherText"
    ].map((k, i) => {
      return {
        type: CellViewType.Input,
        help: `${i === 2 || i === 3 ? help.cur_doc_effect : ""}${
          option.search_engine[i]
        }`,
        key: k,
        bind: [["showSearchEngine", 1]]
      }
    }) as ISettingInput<(IProfile & IDocProfile)["copysearch"]>[])
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "searchCardInfo",
      label: lable.search_card_info,
      option: option.search_engine,
      method: async ({ nodes, option }) => {
        if (nodes.length == 1) {
          const { whichPartofCard } = self.profile.copysearch
          const text = (await utils.getContentofOneCard(
            nodes[0],
            whichPartofCard[0]
          )) as string
          text && utils.search(text, option)
        } else {
          const { separatorSymbols, whichPartofCard } = self.profile.copysearch
          let opt = whichPartofCard[0]
          if (whichPartofCard[0] === WhichPartofCard.Choose) {
            opt = (await utils.choosePartofCard(
              lang.option.muiltple_cards,
              "",
              true
            )) as number
          } else opt -= 1
          const contentList = utils.getContentofMuiltCards(nodes, opt)
          contentList?.length &&
            utils.search(
              contentList.join(
                reverseEscape(`${escapeDoubleQuote(separatorSymbols)}`, true)
              ),
              option
            )
        }
      }
    },
    {
      type: CellViewType.Button,
      key: "copyCardInfo",
      label: lable.copy_card_info,
      option: option.which_partof_card,
      method: async ({ nodes, option }) => {
        if (nodes.length == 1) {
          const text = (await utils.getContentofOneCard(
            nodes[0],
            option
          )) as string
          text && utils.copy(text)
        } else {
          const { separatorSymbols } = self.profile.copysearch
          const contentList = utils.getContentofMuiltCards(nodes, option)
          contentList?.length &&
            utils.copy(
              contentList.join(
                reverseEscape(`${escapeDoubleQuote(separatorSymbols)}`, true)
              )
            )
        }
      }
    }
  ],
  actions4text: [
    {
      type: CellViewType.Button,
      key: "searchText",
      label: lable.search_text,
      option: option.search_engine,
      method: ({ text, option }) => {
        text && utils.search(text, option)
      }
    }
  ]
}

const utils = {
  async getTitleExcerpt(
    k: string[],
    type: "title" | "excerpt",
    origin = false
  ) {
    const { multipleTitles, multipleExcerpts } = self.profile.copysearch
    if (k.length === 0) return undefined
    switch (type === "title" ? multipleTitles[0] : multipleExcerpts[0]) {
      case MultipleTitlesExcerpt.All: {
        const r = k.join(type === "title" ? "; " : "\n")
        if (origin) return [r]
        return k.join(r)
      }
      case MultipleTitlesExcerpt.First:
        if (origin) return [k[0]]
        return k[0]
      default:
        if (origin) return k
        return k.length === 1
          ? k[0]
          : ((await utils.choosePartofCard(k)) as string)
    }
  },
  getCustomContent(node: MbBookNote) {
    const { customContent } = self.profile.copysearch
    if (!customContent) return undefined
    const template = reverseEscape(`"${escapeDoubleQuote(customContent)}"`)
    return renderTemplateOfNodeProperties(node, template)
  },
  async choosePartofCard(
    parts: string[],
    tip = lang.choose_you_want,
    index = false
  ) {
    const { option } = await popup(
      Addon.title,
      tip,
      UIAlertViewStyle.Default,
      parts.map(k => byteSlice(k.replace("\n", ""), 0, 40)),
      (alert: UIAlertView, buttonIndex: number) => ({
        option: buttonIndex
      })
    )
    return index ? option! : parts[option!]
  },
  async getContentofOneCard(node: MbBookNote, option: number) {
    const titles = node.noteTitle?.split(/\s*[;；]\s*/) ?? []
    const excerptText = getExcerptText(node, false).ocr
    const customContent = utils.getCustomContent(node)
    switch (option) {
      case WhichPartofCard.Title: {
        const res =
          ((await utils.getTitleExcerpt(titles, "title")) as string) ??
          ((await utils.getTitleExcerpt(excerptText, "excerpt")) as string) ??
          customContent
        if (res) return res
        break
      }
      case WhichPartofCard.Excerpt: {
        const res =
          ((await utils.getTitleExcerpt(excerptText, "excerpt")) as string) ??
          ((await utils.getTitleExcerpt(titles, "title")) as string) ??
          customContent
        if (res) return res
        break
      }
      case WhichPartofCard.Custom: {
        const res =
          customContent ??
          ((await utils.getTitleExcerpt(titles, "title")) as string) ??
          ((await utils.getTitleExcerpt(excerptText, "excerpt")) as string)
        if (res) return res
        break
      }
      default: {
        const list = [
          ...((await utils.getTitleExcerpt(titles, "title", true)) ?? []),
          ...((await utils.getTitleExcerpt(excerptText, "excerpt", true)) ?? [])
        ]
        if (customContent) list.push(customContent)
        if (list.length === 1) return list[0]
        else return await utils.choosePartofCard(list)
      }
    }
  },
  getContentofMuiltCards(nodes: MbBookNote[], option: number) {
    switch (option) {
      case 0: {
        const { multipleTitles } = self.profile.copysearch
        return nodes.reduce((acc, cur) => {
          const t = cur.noteTitle
          if (!t) return acc
          if (multipleTitles[0] === MultipleTitlesExcerpt.First)
            acc.push(t.split(/\s*[;；]\s*/)[0])
          else acc.push(t)
          return acc
        }, [] as string[])
      }
      case 1: {
        const { multipleTitles } = self.profile.copysearch
        return nodes.reduce((acc, cur) => {
          const l = getExcerptText(cur, false).ocr
          if (!l.length) return acc
          if (multipleTitles[0] === MultipleTitlesExcerpt.First) acc.push(l[0])
          else acc.push(l.join("\n"))
          return acc
        }, [] as string[])
      }
      default:
        return nodes.reduce((acc, cur) => {
          const t = utils.getCustomContent(cur)
          t && acc.push(t)
          return acc
        }, [] as string[])
    }
  },
  async search(text: string, option: number) {
    const {
      searchAcademic,
      searchChineseText,
      searchEnglishText,
      searchOtherText,
      searchQuestion
    } = self.profile.copysearch
    const { searchTranslation, searchWord } = self.docProfile.copysearch
    const searchEngine = [
      searchChineseText,
      searchEnglishText,
      searchWord,
      searchTranslation,
      searchAcademic,
      searchQuestion,
      searchOtherText
    ][option]
    if (searchEngine) openUrl(searchEngine.replace("{{keyword}}", text))
    else showHUD(hud.no_search_engine_url, 2)
  },
  copy(text: string) {
    UIPasteboard.generalPasteboard().string = text.trim()
    showHUD(hud.copy_seccess)
  }
}

const checker: ICheckMethod<
  PickByValue<(IProfile & IDocProfile)["copysearch"], string>
> = (input, key) => {
  switch (key) {
    case "searchChineseText":
    case "searchEnglishText":
    case "searchWord":
    case "searchTranslation":
    case "searchAcademic":
    case "searchQuestion":
    case "searchOtherText":
      if (!input.includes("{{keyword}}")) throw hud.no_keyword
      break
    case "customContent":
    case "separatorSymbols":
      checkPlainText(input)
      break
    default:
      return undefined
  }
}

const copysearch = { configs, utils, checker }
export default copysearch
