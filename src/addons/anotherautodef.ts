import { profile } from "profile"
import { isHalfWidth } from "utils/text"

const config: IConfig = {
  name: "AnotherAutoDef",
  intro: "提取定义为标题链接",
  link: "https://github.com/ourongxing/ohmymn",
  settings: [
    {
      key: "on",
      type: cellViewType.switch,
      label: "摘录时自动执行"
    },
    {
      key: "firstLetterCaps",
      type: cellViewType.switch,
      label: "首字母大写"
    },
    {
      key: "preset",
      type: cellViewType.muiltSelect,
      option: ["标准"],
      label: "选择需要的预设"
    },
    {
      key: "customDefTitle",
      type: cellViewType.input,
      label: "自定义，点击查看具体格式",
      link: "https://busiyi.notion.site/AnotherAutoTitle-bef78c75901e4895b4fa2d03d83c48d6"
    }
  ],
  actions: []
}

const util = {
  checkGetDefTitle(text: string) {
    const preset = profile.anotherautodef.preset
    if (preset.includes(0)) {
      const reg = /[、\[\]()（）\/【】「」《》«»]+|或者?|[简又]?称(之?为)?/g
      const titles = text
        .replace(reg, "😎")
        .split("😎")
        .filter(item => item)
      if (titles.length) {
        return {
          title: titles.join(
            titles.every(item => isHalfWidth(item)) ? "; " : "；"
          )
        }
      }
    }
  }
}
const action = {}
export { config, util, action }
