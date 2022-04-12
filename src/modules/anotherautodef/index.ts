import { renderTemplateOfNodeProperties } from "@/jsExtension/nodeProperties"
import { IConfig, MbBookNote } from "@/typings"
import { CellViewType } from "@/typings/enum"
import { unique } from "@/utils"
import {
  checkReplaceParamFromMNLink,
  checkRegArrayFromMNLink,
  checkReplaceParam
} from "@/utils/checkInput"
import { string2ReplaceParam, regFlag } from "@/utils/input"
import { getAllText, removeHighlight } from "@/utils/note"
import { lang } from "./lang"
import { ExtractTitle, TitleLinkSplit, AutoDefPreset } from "./typings"

const { label, option, intro, link, help } = lang

const configs: IConfig<"anotherautodef"> = {
  name: "Another AutoDef",
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
      key: "customExtractTitle",
      type: CellViewType.Input,
      bind: [["preset", 0]],
      help: help.custom_extract_title,
      link,
      check({ input }) {
        checkReplaceParamFromMNLink(input)
      }
    },
    {
      key: "customDefLink",
      type: CellViewType.Input,
      bind: [["preset", 1]],
      help: help.custom_def_link,
      link,
      check({ input }) {
        checkRegArrayFromMNLink(input)
      }
    },
    {
      key: "onlyDesc",
      type: CellViewType.Switch,
      label: label.only_desc
    },
    {
      key: "toTitleLink",
      type: CellViewType.Switch,
      label: label.to_title_link
    },
    {
      type: CellViewType.MuiltSelect,
      key: "titleLinkSplit",
      label: label.title_link_split,
      option: option.title_link_split,
      bind: [["toTitleLink", 1]]
    },
    {
      key: "customTitleSplit",
      type: CellViewType.Input,
      help: help.custom_title_split,
      bind: [
        ["toTitleLink", 1],
        ["titleLinkSplit", 0]
      ],
      link,
      check({ input }) {
        checkRegArrayFromMNLink(input)
      }
    }
  ],
  actions4card: [
    {
      type: CellViewType.ButtonWithInput,
      label: label.extract_title,
      option: option.extract_title,
      key: "extractTitle",
      method: ({ nodes, content, option }) => {
        if (option == ExtractTitle.UseAutoDef) {
          const { customExtractTitle } = self.profile.anotherautodef
          const params = customExtractTitle
            ? string2ReplaceParam(customExtractTitle)
            : false
          nodes.forEach(node => {
            const allTitles: string[] = []
            const res = utils.main(node, node.excerptText ?? "")
            if (res) {
              const { text, title } = res
              allTitles.push(...title)
              node.excerptText = text
            }
            if (params) {
              const text = getAllText(node)
              allTitles.push(
                ...extractArray(
                  text,
                  params.map(k => ({
                    ...k,
                    newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
                  }))
                )
              )
            }
            if (allTitles.length)
              node.noteTitle = removeHighlight(unique(allTitles).join("; "))
          })
        } else if (content) {
          const params = string2ReplaceParam(content)
          nodes.forEach(node => {
            const text = getAllText(node)
            const allTitles = extractArray(
              text,
              params.map(k => ({
                ...k,
                newSubStr: renderTemplateOfNodeProperties(node, k.newSubStr)
              }))
            )
            if (allTitles.length)
              node.noteTitle = removeHighlight(allTitles.join("; "))
          })
        }
      },
      check({ input }) {
        checkReplaceParam(input)
      }
    }
  ]
}

const utils = {
  toTitleLink(text: string) {
    if (!self.profile.anotherautodef.toTitleLink) return [text]
    const regs: RegExp[] = []
    const { titleLinkSplit } = self.profile.anotherautodef
    const { customTitleSplit } = self.profileTemp.regArray
    if (titleLinkSplit.includes(TitleLinkSplit.Custom) && customTitleSplit)
      regs.push(...customTitleSplit[0])
    if (titleLinkSplit.includes(TitleLinkSplit.Default))
      regs.push(/或者?|[简又]?称(?:之?为)?/g)
    if (titleLinkSplit.includes(TitleLinkSplit.Punctuation)) {
      regs.push(/[、。,，‘’“”"『』()（）【】「」《》«»\/\[\]]/g)
    }

    const defs = regs
      .reduce((acc, reg) => acc.replace(regFlag.add(reg, "g"), "😎"), text)
      .split("😎")
      .reduce((acc, k) => {
        k = k.trim()
        if (k) acc.push(k)
        return acc
      }, [] as string[])
    return defs.length > 1 ? unique<string>(defs) : [text]
  },

  main(note: MbBookNote, text: string) {
    const { preset, onlyDesc } = self.profile.anotherautodef
    for (const set of preset)
      switch (set) {
        case AutoDefPreset.CustomExtract: {
          const { customExtractTitle: params } = self.profileTemp.replaceParam
          if (!params) continue
          let flag = 0
          const allTitles = unique(
            params.reduce((acc, cur) => {
              const { newSubStr, fnKey } = cur
              let { regexp } = cur
              if (flag === 0) flag = fnKey
              regexp = regFlag.add(regexp, "g")
              if (regexp.test(text)) {
                acc.push(
                  ...text
                    .match(regexp)!
                    .map(k =>
                      k.replace(
                        regexp,
                        renderTemplateOfNodeProperties(note, newSubStr)
                      )
                    )
                )
              }
              return acc
            }, [] as string[])
          )
          if (allTitles.length)
            return {
              title: allTitles,
              text: flag ? "" : text
            }
          break
        }
        case AutoDefPreset.CustomTitleSplit: {
          const { customDefLink } = self.profileTemp.regArray
          if (!customDefLink) continue
          const regs = customDefLink.flat()
          for (let reg of regs) {
            let isReverse = false
            // 使用 y 来表示定义项在后面的情况，则 y 失效，应该很少人会用到 y
            if (reg.sticky) {
              reg = regFlag.remove(reg, "y")
              isReverse = true
            }
            if (reg.test(text)) {
              let [def, desc] = text.split(reg).filter(k => k)
              // 交换顺序
              if (isReverse) [def, desc] = [desc, def]
              return {
                title: utils.toTitleLink(def),
                text: onlyDesc ? desc : text
              }
            }
          }
          break
        }
        case 2:
        case 3:
        case 4:
        case 5:
        case 6: {
          const reg = [
            /[：:]/,
            /[一—]{2}/,
            /[,，]\s*(?:通常|一般)*是指?/,
            /(?:通常|一般)*是指?\s*[,，]/,
            /(?:通常|一般)*是指/
          ][set - 2]
          if (reg.test(text)) {
            const [def, desc] = text.split(reg)
            return {
              title: utils.toTitleLink(def),
              text: onlyDesc ? desc : text
            }
          }
          break
        }
        // 以下为定义项在后面的情况
        case 7:
        case 8: {
          const reg = [/[,，].*称之?为/, /(?:通常|一般)?被?称之?为/][set - 7]
          if (reg.test(text)) {
            const [desc, def] = text.split(reg)
            return {
              title: utils.toTitleLink(def),
              text: onlyDesc ? desc : text
            }
          }
          break
        }
      }
  }
}

export default { configs, utils }
