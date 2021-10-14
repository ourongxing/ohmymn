import { util as autostandardize } from "addons/autostandardize"
import { util as autolist } from "addons/autolist"
import { util as autoreplace } from "addons/autoreplace"
import { util as autocomplete } from "addons/autocomplete"
import { util as anotherautotitle } from "addons/anotherautotitle"
import { profile } from "profile"

export const genTitleText = async (
  text: string
): Promise<{ title?: string; text: string }> => {
  if (profile.autostandardize.on) text = autostandardize.standardizeText(text)
  if (profile.autolist.on) text = autolist.listText(text)
  if (profile.autoreplace.on) text = autoreplace.replaceText(text)

  // 判断是否能成为标题
  // autotitle 优先级应该是最低的
  if (profile.autocomplete.on) {
    const result = await autocomplete.checkGetWord(text)
    if (result) return result
  }
  if (profile.anotherautotitle.on) {
    const result = anotherautotitle.checkGetTitle(text)
    // 可以作为标题
    if (result) return { text, title: result.title }
  }
  return { text }
}
