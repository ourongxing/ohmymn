import { MbBookNote } from "typings"
import { util as autotag } from "modules/autotag"
import { util as autolist } from "modules/autolist"
import { util as autostyle } from "modules/autostyle"
import { util as autoreplace } from "modules/autoreplace"
import { util as autocomplete } from "modules/autocomplete"
import { util as anotherautodef } from "modules/anotherautodef"
import { util as autostandardize } from "modules/autostandardize"
import { util as anotherautotitle } from "modules/anotherautotitle"
import { AutoModuleKey, QuickSwitch } from "synthesizer"
import { HasTitleThen } from "modules/ohmymn"
import { removeHighlight } from "utils/note"

export const newTitleText = async (
  text: string,
  noteid: string,
  nodeTitle: string[] | undefined,
  isModify: boolean,
  isComment: boolean
) => {
  const { quickSwitch, hasTitleThen } = self.profile.ohmymn

  const isON = (key: AutoModuleKey) =>
    quickSwitch.includes(QuickSwitch[key]) && self.profile[key]!.on

  const { cacheExcerptTitle } = self.docProfile.additional

  // 处理摘录的方法，返回 text
  const utilText = [
    ["autostandardize", autostandardize.standardizeText],
    ["autolist", autolist.listText],
    ["autoreplace", autoreplace.replaceText]
  ] as [AutoModuleKey, (text: string) => string][]

  const newText = utilText.reduce(
    (acc, cur) => (isON(cur[0]) ? cur[1](acc) : acc),
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
    if (isON("autocomplete")) {
      // 排除划重点的影响
      const newText = isModify ? removeHighlight(text) : text
      const res = await autocomplete.getCompletedWord(newText)
      if (res) return res
    }
    if (isON("anotherautodef")) {
      const res = anotherautodef.getDefTitle(text)
      if (res) {
        if (isModify) res.title = res.title.map(k => removeHighlight(k))
        return res
      }
    }
    if (isON("anotherautotitle")) {
      const { changeTitleNoLimit } = self.profile.anotherautotitle
      const newText = isModify ? removeHighlight(text) : text
      if (changeTitleNoLimit && isModify && cacheExcerptTitle[noteid])
        return {
          title: [newText],
          text: ""
        }
      const res = anotherautotitle.getTitle(newText)
      if (res) return res
    }
  })(newText)

  if (!res) return defaultRet

  // 规范化英文标题
  if (isON("autostandardize") && self.profile.autostandardize.standardizeTitle)
    res.title = res.title.map(k => autostandardize.toTitleCase(k))

  if (nodeTitle?.length && hasTitleThen[0] === HasTitleThen.TitleLink) {
    const [oldTitle, stillUsingTitle] = (() => {
      if (isModify && cacheExcerptTitle[noteid]) {
        // 如果是在修改，要先对比原标题，将原来的标题分为改变了的和不变的，改变了的就删除，不变的就保留
        const [stillUsing, deprecated] = cacheExcerptTitle[noteid]!.reduce(
          (acc, cur) => {
            if (res.title.includes(cur)) acc[0].push(cur)
            else acc[1].push(cur)
            return acc
          },
          [[], []] as string[][]
        )
        return [nodeTitle.filter(k => !deprecated.includes(k)), stillUsing]
      } else return [nodeTitle, []]
    })()
    // 筛选出新的标题，不与以前的标题重复
    const newTitle = res.title.filter(k => !oldTitle.includes(k))
    // 保存每次新的标题
    cacheExcerptTitle[noteid] = [...stillUsingTitle, ...newTitle]
    return {
      text: res.text,
      title: [...oldTitle, ...newTitle]
    }
  }
  cacheExcerptTitle[noteid] = res.title
  return res
}

export const newTag = (text: string) => {
  if (
    self.profile.ohmymn.quickSwitch.includes(QuickSwitch.autotag) &&
    self.profile.autotag.on
  )
    return autotag.getTag(text)
}

export const newColorStyle = (note: MbBookNote) => {
  if (
    self.profile.ohmymn.quickSwitch.includes(QuickSwitch.autostyle) &&
    self.profile.autostyle.on
  )
    return autostyle.getColorStyle(note)
}
