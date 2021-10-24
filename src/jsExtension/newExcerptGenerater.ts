import { util as autostandardize } from "addons/autostandardize"
import { util as autolist } from "addons/autolist"
import { util as autoreplace } from "addons/autoreplace"
import { util as autocomplete } from "addons/autocomplete"
import { util as anotherautotitle } from "addons/anotherautotitle"
import { util as anotherautodef } from "addons/anotherautodef"
import { on, profile } from "profile"

export const genTitleText = async (
  text: string
): Promise<{ title?: string; text: string }> => {
  // 处理摘录
  for (const addon of profile.ohmymn.quickSwitch) {
    switch (addon) {
      case on.autostandardize:
        text = autostandardize.standardizeText(text)
        break
      case on.autolist:
        text = autolist.listText(text)
        break
      case on.autoreplace:
        text = autoreplace.replaceText(text)
        break
    }
  }

  // 返回标题
  for (const addon of profile.ohmymn.quickSwitch) {
    switch (addon) {
      case on.autocomplete: {
        const result = await autocomplete.checkGetWord(text)
        if (result) return result
        break
      }
      case on.anotherautodef: {
        const result = anotherautodef.checkGetDefTitle(text)
        if (result)
          return {
            title: profile.autostandardize.toTitleCase
              ? autostandardize.toTitleCase(result.title)
              : result.title,
            text: result.text
          }
        break
      }
    }
  }

  // autotitle 始终最后执行
  if (profile.ohmymn.quickSwitch.includes(on.anotherautotitle)) {
    const result = anotherautotitle.checkGetTitle(text)
    if (result)
      return {
        title: profile.autostandardize.toTitleCase
          ? autostandardize.toTitleCase(result.title)
          : result.title,
        text: ""
      }
  }
  return { text }
}
