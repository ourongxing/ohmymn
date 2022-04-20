import { IGlobalProfile, IDocProfile } from "@/profile"
import { ISettingInput } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { checkPlainText } from "@/utils/checkInput"
import { copy, defineConfig } from "@/utils/common"
import { reverseEscape, escapeDoubleQuote } from "@/utils/input"
import { WhichPartofCard } from "./typings"
import { lang } from "./lang"
import {
  getContentofOneCard,
  search,
  selectPartIndexOfCard,
  getContentofMuiltCards
} from "./utils"

const { link, intro, lable, option, help, hud } = lang

export default defineConfig({
  name: "CopySearch",
  key: "copysearch",
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
        help: option.search_engine[i],
        key: k,
        bind: ["showSearchEngine", 1],
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
          const text = (await getContentofOneCard(
            nodes[0],
            whichPartofCard[0]
          )) as string
          text && search(text, option)
        } else {
          const { separatorSymbols, whichPartofCard } =
            self.globalProfile.copysearch
          let opt = whichPartofCard[0]
          if (whichPartofCard[0] === WhichPartofCard.Choose) {
            opt = await selectPartIndexOfCard(lang.option.muiltple_cards)
          } else opt -= 1
          const contentList = getContentofMuiltCards(nodes, opt)
          contentList?.length &&
            search(
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
          const text = (await getContentofOneCard(nodes[0], option)) as string
          text && copy(text)
        } else {
          const { separatorSymbols } = self.globalProfile.copysearch
          const contentList = getContentofMuiltCards(nodes, option)
          contentList?.length &&
            copy(
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
        text && search(text, option)
      }
    }
  ]
})
