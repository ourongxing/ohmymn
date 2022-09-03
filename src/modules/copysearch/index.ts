import { IGlobalProfile, IDocProfile } from "~/profile/defaultProfile"
import { ISettingInput } from "~/typings"
import { CellViewType } from "~/typings/enum"
import {
  getSerialInfo,
  reverseEscape,
  escapeDoubleQuote,
  checkPlainText
} from "~/utils"
import { selectIndex, copy } from "~/sdk"
import { defineConfig } from "~/profile"
import { WhichPartofCard } from "./typings"
import { lang } from "./lang"
import { getContentofOneCard, search, getContentofMuiltCards } from "./utils"
import { Addon } from "~/addon"

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
      key: "modifySymbols",
      type: CellViewType.Input,
      help: "选中多张卡片时，为每张卡片的内容添加前后修饰，默认添加序号和换行（$&代表每一段），点击查看自定义方法。",
      link: "https://ohmymn.vercel.app/guide/modules/copysearch.html#%E5%A4%9A%E5%BC%A0%E5%8D%A1%E7%89%87",
      check({ input }) {
        checkPlainText(input)
        if (!input.includes("$&")) throw "缺少 $&"
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
        bind: ["showSearchEngine", true],
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
          const { modifySymbols, whichPartofCard } =
            self.globalProfile.copysearch
          let opt = whichPartofCard[0]
          const [front, behind] = reverseEscape(
            `${escapeDoubleQuote(modifySymbols)}`,
            true
          ).split("$&")
          if (whichPartofCard[0] === WhichPartofCard.Choose) {
            opt = await selectIndex(
              lang.option.muiltple_cards,
              Addon.title,
              lang.choose_you_want
            )
          } else opt -= 1
          const contentList = getContentofMuiltCards(nodes, opt)

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
      label: lable.copy_card_info,
      option: option.which_partof_card,
      async method({ nodes, option }) {
        if (nodes.length == 1) {
          const text = (await getContentofOneCard(nodes[0], option)) as string
          text && copy(text)
        } else {
          const { modifySymbols } = self.globalProfile.copysearch
          const [front, behind] = reverseEscape(
            `${escapeDoubleQuote(modifySymbols)}`,
            true
          ).split("$&")
          const contentList = getContentofMuiltCards(nodes, option)
          contentList?.length &&
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
      label: lable.search_text,
      option: option.search_engine,
      method({ text, option }) {
        text && search(text, option)
      }
    }
  ]
})
