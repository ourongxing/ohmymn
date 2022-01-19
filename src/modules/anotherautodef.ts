import { addFlags, string2ReplaceParam } from "utils/input"
import { getAllText } from "utils/note"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"
import { unique } from "utils"
import { extractArray } from "utils/custom"

const { label, option, intro, link } = lang.module.anotherautodef
const enum AutoDefPreset {
  CustomExtract,
  CustomSplit
}

const config: IConfig = {
  name: "AnotherAutoDef",
  intro,
  link,
  settings: [
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: option.preset,
      label: label.preset
    },
    {
      key: "customExtractTitle",
      type: cellViewType.input,
      bind: ["preset", 0],
      label: label.custom_extract_title,
      link
    },
    {
      key: "customDefLink",
      type: cellViewType.input,
      bind: ["preset", 1],
      label: label.custom_def_link,
      link
    },
    {
      key: "onlyDesc",
      type: cellViewType.switch,
      label: label.only_desc
    },
    {
      key: "toTitleLink",
      type: cellViewType.switch,
      label: label.to_title_link
    },
    {
      key: "customSplit",
      type: cellViewType.input,
      label: label.custom_split,
      link
    }
  ],
  actions: [
    {
      type: cellViewType.buttonWithInput,
      label: label.extract_title,
      option: option.extract_title,
      key: "extractTitle"
    }
  ]
}

const util = {
  toTitleLink(text: string) {
    const reg = /[、,，\[\]()（）\/【】「」《》«»]+|或者?|[简又]?称(之?为)?/g
    const { customSplit } = self.profileTemp.regArray
    const regs = customSplit ? customSplit[0] : []
    regs.push(reg)
    regs.forEach(reg => {
      text = text.replace(reg, "😎")
    })
    const defs = text
      .split("😎")
      .filter(item => item)
      .map(item => item.trim())
    if (defs.length > 1) return unique(defs).join("; ")
    else return false
  },

  getDefTitle(text: string) {
    const { preset, onlyDesc, toTitleLink } = self.profile.anotherautodef
    for (const set of preset)
      switch (set) {
        case AutoDefPreset.CustomExtract: {
          const { customExtractTitle: params } = self.profileTemp.replaceParam
          if (!params) continue
          let fnKey = 0
          const allTitles = unique(
            params
              .filter(param => param.regexp.test(text))
              .map(param => {
                // 有 1 则为1
                if (fnKey == 0) fnKey = param.fnKey
                param.regexp = addFlags(param.regexp, "g")
                return text
                  .match(param.regexp)!
                  .map(item => item.replace(param.regexp, param.newSubStr))
              })
              .flat()
          )
          if (allTitles.length)
            return {
              title: allTitles.join("; "),
              text: fnKey ? "" : text
            }
          break
        }
        case AutoDefPreset.CustomSplit:
          const { customDefLink } = self.profileTemp.regArray
          if (!customDefLink) continue
          const regs = customDefLink[0]
          for (const reg of regs)
            if (reg.test(text)) {
              const [def, desc] = text
                .split(reg)
                .filter(item => item)
                .map(item => item.trim())
              const titleLink = util.toTitleLink(def)
              return {
                title: toTitleLink && titleLink ? titleLink : def,
                text: onlyDesc ? desc : text
              }
            }
          break
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
            const [def, desc] = text
              .split(reg)
              .filter(item => item)
              .map(item => item.trim())
            const titleLink = util.toTitleLink(def)
            return {
              title: toTitleLink && titleLink ? titleLink : def,
              text: onlyDesc ? desc : text
            }
          }
          break
        }
      }
  }
}
const enum ExtractTitle {
  UseAutoDef
}
const action: IActionMethod = {
  extractTitle({ nodes, content, option }) {
    if (option == ExtractTitle.UseAutoDef) {
      nodes.forEach(node => {
        const text = getAllText(node)
        if (text) {
          const result = util.getDefTitle(text)
          if (result) node.noteTitle = result.title
        }
      })
    } else if (content) {
      const params = string2ReplaceParam(content)
      nodes.forEach(node => {
        const text = getAllText(node)
        const allTitles = extractArray(text, params)
        if (allTitles.length) node.noteTitle = allTitles.join("; ")
      })
    }
  }
}
export { config, util, action }
