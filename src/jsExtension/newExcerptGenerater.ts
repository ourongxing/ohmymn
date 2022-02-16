import { QuickSwitch } from "synthesizer"
import { MbBookNote } from "types/MarginNote"
import { util as autotag } from "modules/autotag"
import { util as autolist } from "modules/autolist"
import { util as autostyle } from "modules/autostyle"
import { util as autoreplace } from "modules/autoreplace"
import { util as autocomplete } from "modules/autocomplete"
import { util as anotherautodef } from "modules/anotherautodef"
import { util as autostandardize } from "modules/autostandardize"
import { util as anotherautotitle } from "modules/anotherautotitle"
import { HasTitleThen } from "modules/ohmymn"

export const newTitleText = async (
  text: string,
  noteid: string,
  nodeTitle: string[] | undefined,
  isModify: boolean,
  isComment: boolean
) => {
  const { quickSwitch, hasTitleThen } = self.profile.ohmymn
  const { cacheExcerptTitle } = self.docProfile.additional
  // 处理摘录的方法，返回 text
  const utilText = [
    [QuickSwitch.autostandardize, autostandardize.standardizeText],
    [QuickSwitch.autolist, autolist.listText],
    [QuickSwitch.autoreplace, autoreplace.replaceText]
  ] as [QuickSwitch, (text: string) => string][]

  const newText = utilText.reduce(
    (acc, cur) => (quickSwitch.includes(cur[0]) ? cur[1](acc) : acc),
    text
  )
  const defaultRet = { text: newText, title: undefined }
  // 卡片标题
  if (
    isComment &&
    nodeTitle?.length &&
    hasTitleThen[0] === HasTitleThen.NoChange
  )
    return defaultRet

  // 生成标题的方法，有返回值就结束，返回 {title,text} | undefine
  const res = await (async text => {
    if (quickSwitch.includes(QuickSwitch.autocomplete)) {
      const res = await autocomplete.getCompletedWord(text)
      if (res) return res
    }
    if (quickSwitch.includes(QuickSwitch.anotherautodef)) {
      const res = anotherautodef.getDefTitle(text)
      if (res) return res
    }
    if (quickSwitch.includes(QuickSwitch.anotherautotitle)) {
      const { changeTitleNoLimit } = self.profile.anotherautotitle
      if (isModify && changeTitleNoLimit)
        return {
          title: [text],
          text: ""
        }
      const res = anotherautotitle.getTitle(text)
      if (res) return res
    }
  })(newText)

  if (!res) return defaultRet

  // 规范化英文标题
  if (self.profile.autostandardize.standardizeTitle)
    res.title = res.title.map(k => autostandardize.toTitleCase(k))

  if (nodeTitle?.length && hasTitleThen[0] === HasTitleThen.TitleLink) {
    // 删除以前的
    const oldTitle = (() => {
      if (isModify && cacheExcerptTitle[noteid])
        return nodeTitle.filter(k => !cacheExcerptTitle[noteid]!.includes(k))
      else return nodeTitle
    })()
    // 筛选出新的标题，不与以前的标题重复
    const newTitle = res.title.filter(k => !oldTitle.includes(k))
    // 保存每次新的标题
    cacheExcerptTitle[noteid] = newTitle
    return {
      text: res.text,
      title: [...oldTitle, ...newTitle]
    }
  }
  cacheExcerptTitle[noteid] = res.title
  return res
}

export const newTag = (text: string) => {
  const { quickSwitch } = self.profile.ohmymn
  if (quickSwitch.includes(QuickSwitch.autotag)) return autotag.getTag(text)
}

export const newColorStyle = (note: MbBookNote) => {
  const { quickSwitch } = self.profile.ohmymn
  if (quickSwitch.includes(QuickSwitch.autostyle))
    return autostyle.getColorStyle(note)
}
