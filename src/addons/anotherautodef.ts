import { profile } from "profile"
import { string2RegArray, string2ReplaceParam } from "utils/input"
import { getAllText } from "utils/note"
import { cellViewType, IActionMethod, IConfig } from "types/Addon"

const config: IConfig = {
  name: "AnotherAutoDef",
  intro:
    "提取被定义项或任意内容为标题或标题链接\n定义 = 被定义项 + 定义联项 + 定义项",
  settings: [
    {
      key: "onlyDesc",
      type: cellViewType.switch,
      label: "摘录仅保留定义项"
    },
    {
      key: "toTitleLink",
      type: cellViewType.switch,
      label: "别名转为标题链接"
    },
    {
      key: "customSplitName",
      type: cellViewType.input,
      label: "自定义别名分词，点击查看具体格式",
      link: "https://busiyi.notion.site/AnotherAutoDef-13910b3b225743dcb72b29eabcc81e22"
    },
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: [
        "自定义提取内容",
        "自定义定义联项",
        "xxx : yyy",
        "xxx —— yyy",
        "xxx ，是(指) yyy",
        "xxx 是(指)，yyy",
        "xxx 是指 yyy",
        "* xxx 是 yyy"
      ],
      label: "选择需要的预设"
    },
    {
      key: "customSplit",
      type: cellViewType.input,
      label: "自定义定义联项，点击查看具体格式",
      link: "https://busiyi.notion.site/AnotherAutoDef-13910b3b225743dcb72b29eabcc81e22"
    },
    {
      key: "customDefTitle",
      type: cellViewType.input,
      label: "自定义提取内容，点击查看具体格式",
      link: "https://busiyi.notion.site/AnotherAutoDef-13910b3b225743dcb72b29eabcc81e22"
    }
  ],
  actions: [
    {
      type: cellViewType.buttonWithInput,
      label: "提取卡片中的内容为标题",
      option: ["使用 AutoDef 中的配置", "确定"],
      key: "extractTitle"
    }
  ]
}

const util = {
  toTitleLink(text: string) {
    const reg = /[、,，\[\]()（）\/【】「」《》«»]+|或者?|[简又]?称(之?为)?/g
    const { customSplitName } = profile.anotherautodef
    const regs = customSplitName ? string2RegArray(customSplitName) : []
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
    const { preset, onlyDesc, toTitleLink, customSplit, customDefTitle } =
      profile.anotherautodef
    for (const set of preset)
      switch (set) {
        case 0:
          if (!customDefTitle) break
          const params = string2ReplaceParam(customDefTitle)
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
          if (!customSplit) break
          const regs = string2RegArray(customSplit)
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
        case 7: {
          const reg = /是/
          if (reg.test(text)) {
            const [def, desc] = text.split(reg).filter(item => item)
            // 由于这个容易误触发，所以限定条件，必须是有别名才可以
            const titleLink = util.toTitleLink(def)
            if (titleLink)
              return {
                title: toTitleLink ? titleLink : def,
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
