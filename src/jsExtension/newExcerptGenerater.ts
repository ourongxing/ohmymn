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

export const newTitleText = async (text: string, note: MbBookNote) => {
  const { quickSwitch } = self.profile.ohmymn
  // 返回摘录
  if (quickSwitch.includes(QuickSwitch.autostandardize))
    text = autostandardize.standardizeText(text)
  if (quickSwitch.includes(QuickSwitch.autolist)) text = autolist.listText(text)
  if (quickSwitch.includes(QuickSwitch.autoreplace))
    text = autoreplace.replaceText(text)

  // 返回标题
  if (quickSwitch.includes(QuickSwitch.autocomplete)) {
    const result = await autocomplete.getCompletedWord(text)
    if (result) return result
  }

  const standardizeTitle = (title: string) =>
    autostandardize.toTitleCase(title).replace(/\*\*/g, "")

  if (quickSwitch.includes(QuickSwitch.anotherautodef)) {
    const result = anotherautodef.getDefTitle(text)
    if (result)
      return {
        title: standardizeTitle(result.title),
        text: result.text
      }
  }

  if (quickSwitch.includes(QuickSwitch.anotherautotitle)) {
    const result = anotherautotitle.getTitle(text, note)
    if (result)
      return {
        title: standardizeTitle(result.title),
        text: ""
      }
  }

  return {
    text,
    title: undefined
  }
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
