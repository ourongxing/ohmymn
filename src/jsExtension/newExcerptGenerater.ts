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
import { unique } from "utils"

export const newTitleText = async (text: string, nodeNote: MbBookNote) => {
  const { quickSwitch, hasTitleThen } = self.profile.ohmymn
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
  const defaultRet = { text: newText, title: "" }
  // 卡片标题
  const nodeTitle = nodeNote.noteTitle
  if (nodeTitle && hasTitleThen[0] === HasTitleThen.NoChange) return defaultRet

  // 生成标题的方法，有返回值就结束，返回 {title,text} | undefine
  const result = await (async text => {
    if (quickSwitch.includes(QuickSwitch.autocomplete)) {
      const result = await autocomplete.getCompletedWord(text)
      if (result) return result
    }
    if (quickSwitch.includes(QuickSwitch.anotherautodef)) {
      const result = anotherautodef.getDefTitle(text)
      if (result) return result
    }
    if (quickSwitch.includes(QuickSwitch.anotherautotitle)) {
      const result = anotherautotitle.getTitle(text, nodeTitle)
      if (result) return result
    }
  })(newText)

  if (!result) return defaultRet
  // 规范化英文标题
  if (self.profile.autostandardize.standardizeTitle)
    result.title = autostandardize.toTitleCase(result.title)
  if (nodeTitle && hasTitleThen[0] === HasTitleThen.TitleLink) {
    return {
      text: result.text,
      title: unique(`${nodeTitle}; ${result.title}`.split(/[;；]\x20*/)).join(
        "; "
      )
    }
  }
  return result
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
