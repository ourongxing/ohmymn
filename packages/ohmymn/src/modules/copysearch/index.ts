import { copy, select } from "marginnote"
import { Addon } from "~/addon"
import type { IDocProfile, IGlobalProfile } from "~/profile"
import { defineConfig } from "~/profile"
import type { ISettingInput } from "~/typings"
import { CellViewType } from "~/typings"
import {
  checkPlainText,
  doc,
  escapeDoubleQuote,
  getSerialInfo,
  reverseEscape
} from "~/utils"
import lang from "./lang"
import { WhichPartofCard } from "./typings"
import { getContentofMuiltCards, getContentofOneCard, search } from "./utils"

export default defineConfig({
  name: "CopySearch",
  key: "copysearch",
  intro: lang.intro,
  link: doc("copysearch"),
  settings: [
    {
      label: lang.which_partof_card.label,
      key: "whichPartofCard",
      type: CellViewType.Select,
      option: lang.which_partof_card.$option4,
      help: lang.which_partof_card.help
    },
    {
      label: lang.multiple_titles.label,
      key: "multipleTitles",
      type: CellViewType.Select,
      option: lang.multiple_titles.$option3
    },
    {
      label: lang.multiple_excerpts.label,
      key: "multipleExcerpts",
      type: CellViewType.Select,
      option: lang.multiple_excerpts.$option3
    },
    {
      key: "modifySymbols",
      type: CellViewType.Input,
      help: lang.modify_symbols.help,
      link: lang.modify_symbols.link,
      check({ input }) {
        checkPlainText(input)
        if (!input.includes("$&")) throw "缺少 $&"
      }
    },
    {
      help: lang.custom_copy.help,
      type: CellViewType.Input,
      key: "customContent",
      link: lang.custom_copy.link,
      check({ input }) {
        checkPlainText(input)
      }
    },
    {
      help: lang.custom_search.help,
      type: CellViewType.Input,
      key: "customSearchContent",
      link: lang.custom_search.link,
      check({ input }) {
        checkPlainText(input)
      }
    },
    {
      label: lang.show_search_engine.$label2,
      key: "showSearchEngine",
      type: CellViewType.Expland
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
        help: lang.$search_engine7[i],
        key: k,
        bind: ["showSearchEngine", true],
        check({ input }) {
          if (!input.includes("{{keyword}}")) throw lang.no_keyword
        }
      }
    }) as ISettingInput<(IGlobalProfile & IDocProfile)["copysearch"]>[])
  ],
  actions4card: [
    {
      type: CellViewType.Button,
      key: "searchCardInfo",
      label: lang.search_card_info,
      option: lang.$search_engine7,
      async method({ nodes, option }) {
        if (nodes.length == 1) {
          const { whichPartofCard } = self.globalProfile.copysearch
          const text = (await getContentofOneCard(
            nodes[0],
            whichPartofCard[0],
            "search"
          )) as string
          text && search(text, option)
        } else {
          const { modifySymbols, whichPartofCard } =
            self.globalProfile.copysearch
          let opt = whichPartofCard[0]
          const [front, behind] = reverseEscape(
            `${escapeDoubleQuote(modifySymbols)}`,
            true
          ).split("$&")
          if (whichPartofCard[0] === WhichPartofCard.Choose) {
            const { index } = await select(
              lang.muiltple_cards.$option3,
              Addon.title,
              lang.choose_you_want
            )
            opt = index
          } else opt -= 1
          const contentList = getContentofMuiltCards(nodes, opt, "search")
          contentList?.length &&
            search(
              ((arr: string[]) => {
                if (/%\[.+\]/.test(front)) {
                  const serialArr = getSerialInfo(front, arr.length)
                  return arr
                    .map((k, i) => front.replace(/%\[(.+)\]/, serialArr[i]) + k)
                    .join(behind)
                }
                return arr.map(k => front + k).join(behind)
              })(contentList),
              option
            )
        }
      }
    },
    {
      type: CellViewType.Button,
      key: "copyCardInfo",
      label: lang.copy_card_info,
      option: lang.which_partof_card.$option4,
      async method({ nodes, option }) {
        if (nodes.length == 1) {
          const text = (await getContentofOneCard(
            nodes[0],
            option,
            "copy"
          )) as string
          copy(text)
        } else {
          const { modifySymbols } = self.globalProfile.copysearch
          const [front, behind] = reverseEscape(
            `${escapeDoubleQuote(modifySymbols)}`,
            true
          ).split("$&")
          const contentList = getContentofMuiltCards(nodes, option, "copy")
          copy(
            ((arr: string[]) => {
              if (/%\[.+\]/.test(front)) {
                const serialArr = getSerialInfo(front, arr.length)
                return arr
                  .map((k, i) => front.replace(/%\[(.+)\]/, serialArr[i]) + k)
                  .join(behind)
              }
              return arr.map(k => front + k).join(behind)
            })(contentList)
          )
        }
      }
    }
  ],
  actions4text: [
    {
      type: CellViewType.Button,
      key: "searchText",
      label: lang.search_text,
      option: lang.$search_engine7,
      method({ text, option }) {
        text && search(text, option)
      }
    }
  ]
})
