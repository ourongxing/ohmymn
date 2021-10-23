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
      option: ["xxx :—— yyy"],
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
    return text
      .replace(reg, "😎")
      .split("😎")
      .filter(item => item)
      .join("；")
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
        case 0: {
          const reg = /^(.+)\s*[——:：]+\s*(.+)$/
          if (reg.test(text)) {
            const [def, desc] = text.split(reg).filter(item => item)
            return {
              title: profile.anotherautodef.toTitleLink
                ? util.toTitleLink(def)
                : def,
              text: profile.anotherautodef.onlyDesc ? desc : text
            }
          }
          break
        }
      }
  }
}
const action: IActionMethod = {
  extractTitle({ nodes, content }) {
    const params = content.includes("😎") ? [] : string2ReplaceParam(content)
    for (const node of nodes) {
      const text = getAllText(node)
      if (!text) continue
      if (content.includes("😎")) {
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
