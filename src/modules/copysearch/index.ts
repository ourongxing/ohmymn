import { Addon } from "@/const"
import { renderTemplateOfNodeProperties } from "@/jsExtension/nodeProperties"
import { IGlobalProfile, IDocProfile } from "@/profile"
import { IConfig, ISettingInput, MbBookNote } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { checkPlainText } from "@/utils/checkInput"
import { openUrl, showHUD } from "@/utils/common"
import { reverseEscape, escapeDoubleQuote } from "@/utils/input"
import { getExcerptText } from "@/utils/note"
import popup from "@/utils/popup"
import { WhichPartofCard, MultipleTitlesExcerpt } from "./enum"
import { lang } from "./lang"

const { link, intro, lable, option, help, hud } = lang

const configs: IConfig<"copysearch"> = {
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
      type: CellViewType.InlineInput,
      check({ input }) {
        checkPlainText(input)
      }
    },
    {
      help: lable.custom_copy,
      type: CellViewType.Input,
      key: "customContent",
      link,
      check({ input }) {
        checkPlainText(input)
      }
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
        bind: [["showSearchEngine", 1]],
        check({ input }) {
          if (!input.includes("{{keyword}}")) throw hud.no_keyword
        }
      }
    }) as ISettingInput<(IGlobalProfile & IDocProfile)["copysearch"]>[])
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "searchCardInfo",
      label: lable.search_card_info,
      option: option.search_engine,
      async method({ nodes, option }) {
        if (nodes.length == 1) {
          const { whichPartofCard } = self.globalProfile.copysearch
          const text = (await utils.getContentofOneCard(
            nodes[0],
            whichPartofCard[0]
          )) as string
          text && utils.search(text, option)
        } else {
          const { separatorSymbols, whichPartofCard } =
            self.globalProfile.copysearch
          let opt = whichPartofCard[0]
          if (whichPartofCard[0] === WhichPartofCard.Choose) {
            opt = await utils.selectPartIndexOfCard(lang.option.muiltple_cards)
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
      async method({ nodes, option }) {
        if (nodes.length == 1) {
          const text = (await utils.getContentofOneCard(
            nodes[0],
            option
          )) as string
          text && utils.copy(text)
        } else {
          const { separatorSymbols } = self.globalProfile.copysearch
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
      method({ text, option }) {
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
    const { multipleTitles, multipleExcerpts } = self.globalProfile.copysearch
    if (k.length === 0) return undefined
    switch (type === "title" ? multipleTitles[0] : multipleExcerpts[0]) {
      case MultipleTitlesExcerpt.All: {
        const r = k.join(type === "title" ? "; " : "\n")
        return origin ? [r] : k.join(r)
      }
      case MultipleTitlesExcerpt.First:
        return origin ? [k[0]] : k[0]
      default:
        if (origin) return k
        return k.length === 1 ? k[0] : await utils.selectPartOfCard(k)
    }
  },
  getCustomContent(node: MbBookNote) {
    const { customContent } = self.globalProfile.copysearch
    if (!customContent) return undefined
    const template = reverseEscape(`${escapeDoubleQuote(customContent)}`, true)
    return renderTemplateOfNodeProperties(node, template)
  },
  async selectPartOfCard(parts: string[], message = lang.choose_you_want) {
    const { option } = await popup(
      {
        title: Addon.title,
        message,
        buttons: parts,
        multiLine: true,
        canCancel: false
      },
      ({ buttonIndex }) => ({
        option: buttonIndex
      })
    )
    return parts[option]
  },
  async selectPartIndexOfCard(parts: string[], message = lang.choose_you_want) {
    const { option } = await popup(
      {
        title: Addon.title,
        message,
        buttons: parts,
        multiLine: true,
        canCancel: false
      },
      ({ buttonIndex }) => ({
        option: buttonIndex
      })
    )
    return option
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
        else return await utils.selectPartOfCard(list)
      }
    }
  },
  getContentofMuiltCards(nodes: MbBookNote[], option: number) {
    switch (option) {
      case 0: {
        const { multipleTitles } = self.globalProfile.copysearch
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
        const { multipleTitles } = self.globalProfile.copysearch
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
    } = self.globalProfile.copysearch
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

export default { configs, utils }
