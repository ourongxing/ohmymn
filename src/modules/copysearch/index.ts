import { lang } from "./lang"
import type { IConfig, MbBookNote, ISettingInput, ICheckMethod } from "typings"
import { CellViewType, UIAlertViewStyle } from "typings/enum"
import { openUrl, popup, showHUD } from "utils/common"
import { escapeDoubleQuote, reverseEscape } from "utils/input"
import { getExcerptText } from "utils/note"
import { isHalfWidth } from "utils/text"
import { ActionKey, CopySearchCardInfo, MultipleTitlesExcerpt } from "./enum"
import { docProfilePreset, profilePreset } from "profile"
import { Addon } from "const"
import { checkPlainText } from "utils/checkInput"
import Mustache from "mustache"
import getNodeProperties from "jsExtension/nodeProperties"
const { link, intro, lable, option, help, hud } = lang

const profileTemp = {
  ...profilePreset.copysearch,
  ...docProfilePreset.copysearch
}

const configs: IConfig<typeof profileTemp, typeof ActionKey> = {
  name: "CopySearch",
  intro,
  link,
  settings: [
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
      label: lable.which_search_engine,
      key: "whichSearchEngine",
      type: CellViewType.Select,
      option: option.which_search_engine
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
        help: `${i === 2 || i === 3 ? "【当前文档有效】" : ""}${
          option.which_search_engine[i + 1]
        }`,
        key: k,
        bind: [["showSearchEngine", 1]]
      }
    }) as ISettingInput<typeof profileTemp>[])
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "searchCardInfo",
      label: lable.search_card_info,
      option: option.search_card_info,
      method: async ({ nodes, option }) => {
        if (nodes.length == 1) {
          const text = await utils.getContentForOneCard(nodes[0], option)
          text && utils.search(text)
        } else {
          const { separatorSymbols } = self.profile.copysearch
          const contents = utils.getContentForMuiltCards(nodes, option)
          contents?.length &&
            utils.search(
              contents.join(
                reverseEscape(`"${escapeDoubleQuote(separatorSymbols)}"`)
              )
            )
        }
      }
    },
    {
      type: CellViewType.Button,
      key: "copyCardInfo",
      label: lable.copy_card_info,
      option: option.copy_card_info,
      method: async ({ nodes, option }) => {
        if (nodes.length == 1) {
          const text = await utils.getContentForOneCard(nodes[0], option)
          text && utils.copy(text)
        } else {
          const { separatorSymbols } = self.profile.copysearch
          const contents = utils.getContentForMuiltCards(nodes, option)
          contents?.length &&
            utils.copy(
              contents.join(
                reverseEscape(`"${escapeDoubleQuote(separatorSymbols)}"`)
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
      label: "使用 CopySearch 搜索",
      option: ["搜索文字", "搜索图片(base64)"],
      method: ({ text, imgBase64, option }) => {
        if (option) {
          console.log(imgBase64)
        } else console.log(text)
      }
    }
  ]
}

const utils = {
  async chooseYouWantText(arr: string[], type: "title" | "excerpt") {
    const { option } = await popup(
      Addon.title,
      hud.choose_you_want(type === "title"),
      UIAlertViewStyle.Default,
      arr.map(k => {
        k = k.replace(/\n/g, "")
        const limit = isHalfWidth(k) ? 30 : 15
        return k.length > limit ? k.slice(0, limit) + " ..." : k
      }),
      (alert: UIAlertView, buttonIndex: number) => ({
        option: buttonIndex
      })
    )
    return option!
  },
  async getContentForOneCard(node: MbBookNote, option: number) {
    const { multipleExcerpts, multipleTitles } = self.profile.copysearch
    if (option == CopySearchCardInfo.Title) {
      if (!node.noteTitle) {
        showHUD(hud.not_get_title)
        return ""
      }
      const title = node.noteTitle.split(/\s*[;；]\s*/)
      switch (multipleTitles[0]) {
        case MultipleTitlesExcerpt.All:
          return node.noteTitle
        case MultipleTitlesExcerpt.First:
          return title[0]
        case MultipleTitlesExcerpt.Choose:
          return title[
            title.length > 1 ? await utils.chooseYouWantText(title, "title") : 0
          ]
      }
    } else if (option === CopySearchCardInfo.Excerpt) {
      const excerptText = getExcerptText(node, false)
      if (!excerptText.length) {
        showHUD(hud.not_get_excerpt)
        return ""
      }
      switch (multipleExcerpts[0]) {
        case MultipleTitlesExcerpt.All:
          return excerptText.join("\n")
        case MultipleTitlesExcerpt.First:
          return excerptText[0]
        case MultipleTitlesExcerpt.Choose:
          return excerptText[
            excerptText.length > 1
              ? await utils.chooseYouWantText(excerptText, "excerpt")
              : 0
          ]
      }
    } else return utils.getCustomContent(node)
  },
  getContentForMuiltCards(nodes: MbBookNote[], option: number) {
    switch (option) {
      case CopySearchCardInfo.Title:
        return nodes.reduce((acc, cur) => {
          const t = cur.noteTitle
          t && acc.push(t)
          return acc
        }, [] as string[])
      case CopySearchCardInfo.Excerpt:
        return nodes.reduce((acc, cur) => {
          const t = getExcerptText(cur, false).join("\n")
          t && acc.push(t)
          return acc
        }, [] as string[])
      case CopySearchCardInfo.Custom:
        return nodes.reduce((acc, cur) => {
          const t = utils.getCustomContent(cur)
          t && acc.push(t)
          return acc
        }, [] as string[])
    }
  },
  async search(text: string) {
    const chooseYouWantEngine = async (engines: string[]) => {
      const { option } = await popup(
        Addon.title,
        hud.choose_search_engine,
        UIAlertViewStyle.Default,
        engines,
        (alert: UIAlertView, buttonIndex: number) => ({
          option: buttonIndex
        })
      )
      return option!
    }
    const {
      searchAcademic,
      searchChineseText,
      searchEnglishText,
      searchOtherText,
      searchQuestion,
      whichSearchEngine
    } = self.profile.copysearch
    const { searchTranslation, searchWord } = self.docProfile.copysearch
    // option: ["选择", "中文", "英文", "词典", "翻译", "学术", "问题", "其他"]
    const searchEngines = [
      searchChineseText,
      searchEnglishText,
      searchWord,
      searchTranslation,
      searchAcademic,
      searchQuestion,
      searchOtherText
    ]
    const searchEngine = [
      whichSearchEngine[0] === 0
        ? searchEngines[
            await chooseYouWantEngine(option.which_search_engine.slice(1))
          ]
        : "",
      ...searchEngines
    ][whichSearchEngine[0]]

    searchEngine && openUrl(searchEngine.replace("{{keyword}}", text))
  },
  getCustomContent(node: MbBookNote) {
    const { customContent } = self.profile.copysearch
    if (!customContent) return ""
    console.log("执行了吗")
    const template = reverseEscape(`"${escapeDoubleQuote(customContent)}"`)
    console.log(template)
    const res = Mustache.render(template, getNodeProperties(node))
    console.log(res)
    return res
  },
  copy(text: string) {
    UIPasteboard.generalPasteboard().string = text.trim()
    showHUD(hud.copy_seccess)
  }
}

const checker: ICheckMethod<typeof profileTemp> = (input, key) => {
  switch (key) {
    case "searchChineseText":
    case "searchEnglishText":
    case "searchWord":
    case "searchTranslation":
    case "searchAcademic":
    case "searchQuestion":
    case "searchOtherText":
      if (!input.includes("{{keyword}}")) throw "没有输入 {{keyword}}"
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