import { QuickSwitch } from "synthesizer"
import { util as autotag } from "addons/autotag"
import { util as autolist } from "addons/autolist"
import { util as autoreplace } from "addons/autoreplace"
import { util as autocomplete } from "addons/autocomplete"
import { util as anotherautodef } from "addons/anotherautodef"
import { util as autostandardize } from "addons/autostandardize"
import { util as anotherautotitle } from "addons/anotherautotitle"

export const newTitleText = async (
  text: string
): Promise<{ title?: string; text: string }> => {
  const { quickSwitch } = self.profile.ohmymn
  // 处理摘录
  for (const addon of quickSwitch) {
    switch (addon) {
      case QuickSwitch.autostandardize:
        text = autostandardize.standardizeText(text)
        break
      case QuickSwitch.autolist:
        text = autolist.listText(text)
        break
      case QuickSwitch.autoreplace:
        text = autoreplace.replaceText(text)
        break
    }
  }

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
    const result = anotherautotitle.getTitle(text)
    if (result)
      return {
        title: standardizeTitle(result.title),
        text: ""
      }
  }

  return { text }
}

export const newTagStyle = (
  text: string
): {
  tags?: string[]
  color?: number
  fill?: number
} => {
  const { quickSwitch } = self.profile.ohmymn
  if (quickSwitch.includes(QuickSwitch.autotag)) {
    return {
      tags: autotag.getTag(text)
    }
  }
  return {}
}
