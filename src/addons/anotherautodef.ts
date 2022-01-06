import { profile } from "profile"
import { string2RegArray, string2ReplaceParam } from "utils/input"
import { getAllText } from "utils/note"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"
import lang from "lang"

const { label, option, intro, link } = lang.addon.anotherautodef
const config: IConfig = {
  name: "AnotherAutoDef",
  intro,
  settings: [
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
    },
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: option.preset,
      label: label.preset
    },
    {
      key: "customDefLink",
      type: cellViewType.input,
      label: label.custom_def_link,
      link
    },
    {
      key: "customExtractTitle",
      type: cellViewType.input,
      label: label.custom_extract_title,
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
    const { customSplit } = profile.anotherautodef
    const regs = customSplit ? string2RegArray(customSplit)[0] : []
    regs.push(reg)
    regs.forEach(reg => {
      text = text.replace(reg, "😎")
    })
    const defs = text
      .split("😎")
      .filter(item => item)
      .map(item => item.trim())
    if (defs.length > 1) return defs.join("; ")
    else return false
  },

  checkGetDefTitle(text: string) {
    const { preset, onlyDesc, toTitleLink, customDefLink, customExtractTitle } =
      profile.anotherautodef
    for (const set of preset)
      switch (set) {
        case 0:
          if (!customExtractTitle) break
          const params = string2ReplaceParam(customExtractTitle)
          for (const item of params) {
            if (item.regexp.test(text)) {
              const title = text.replace(item.regexp, item.newSubStr)
              return {
                title,
                text: [text, ""][item.fnKey]
              }
            }
          }
          break
        case 1:
          if (!customDefLink) break
          const regs = string2RegArray(customDefLink)[0]
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
const action: IActionMethod = {
  extractTitle({ nodes, content, option }) {
    if (option !== 0 && !content) return
    const params = option === 0 ? [] : string2ReplaceParam(content)
    for (const node of nodes) {
      const text = getAllText(node)
      if (!text) continue
      if (option === 0) {
        const result = util.checkGetDefTitle(text)
        if (result) node.noteTitle = result.title
      } else
        for (const item of params) {
          if (item.regexp.test(text)) {
            const newTitle = text.replace(item.regexp, item.newSubStr)
            if (newTitle) node.noteTitle = newTitle
            continue
          }
        }
    }
  }
}
export { config, util, action }
