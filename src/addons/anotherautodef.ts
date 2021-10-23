import { profile } from "profile"
import { log } from "utils/common"
import { string2ReplaceParam } from "utils/input"
import { getAllText } from "utils/note"

const config: IConfig = {
  name: "AnotherAutoDef",
  intro:
    "提取定义或任意内容为标题或标题链接。目前\n该功能处于预览版本，只提供无冲突的预设",
  link: "https://github.com/ourongxing/ohmymn",
  settings: [
    {
      key: "onlyDesc",
      type: cellViewType.switch,
      label: "仅保留描述内容"
    },
    {
      key: "toTitleLink",
      type: cellViewType.switch,
      label: "别名转为标题链接"
    },
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: ["xxx : yyy", "xxx —— yyy", "xxx 是指 yyy", "xxx ，是(指) yyy"],
      label: "选择需要的预设"
    },
    {
      key: "customDefTitle",
      type: cellViewType.input,
      label: "自定义，点击查看具体格式",
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
    const reg = /[、\[\]()（）\/【】「」《》«»]+|或者?|[简又]?称(之?为)?/g
    const defs = text
      .replace(reg, "😎")
      .split("😎")
      .filter(item => item)
    if (defs.length > 1) return defs.join("；")
    else return false
  },
  checkGetDefTitle(text: string) {
    if (profile.anotherautodef.customDefTitle) {
      const params = string2ReplaceParam(profile.anotherautodef.customDefTitle)
      for (const item of params) {
        if (item.regexp.test(text)) {
          const title = text.replace(item.regexp, item.newSubStr)
          return {
            title,
            text: ["", text][item.fnKey]
          }
        }
      }
    }
    const preset = profile.anotherautodef.preset
    for (const set of preset)
      switch (set) {
        case 0:
        case 1:
        case 2:
        case 3: {
          const reg = [/[：:]/, /[一\-—]{1,2}/, /[,，]\s*是指?/, /是指/][set]
          if (reg.test(text)) {
            const [def, desc] = text
              .split(reg)
              .filter(item => item)
              .map(item => item.trim())
            const titleLink = util.toTitleLink(def)
            return {
              title:
                profile.anotherautodef.toTitleLink && titleLink
                  ? titleLink
                  : def,
              text: profile.anotherautodef.onlyDesc ? desc : text
            }
          }
          break
        }
        case 3: {
          const reg = /是/
          if (reg.test(text)) {
            const [def, desc] = text.split(reg).filter(item => item)
            // 由于这个容易误触发，所以限定条件，必须是有别名才可以
            const titleLink = util.toTitleLink(def)
            if (titleLink)
              return {
                title: profile.anotherautodef.toTitleLink ? titleLink : def,
                text: profile.anotherautodef.onlyDesc ? desc : text
              }
          }
          break
        }
      }
  }
}
const action: IActionMethod = {
  extractTitle({ nodes, content, option }) {
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
