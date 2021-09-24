import { utils } from "addons/synthesizer"
import { profile } from "profile"

export const genTitleText = async (
  text: string
): Promise<{ title?: string; text: string }> => {
  if (profile.autostandardize.on)
    text = utils.autostandardize.standardizeText(text)
  if (profile.autolist.on) text = utils.autolist.listText(text)
  if (profile.autoreplace.on) text = utils.autoreplace.replaceText(text)

  // 判断是否能成为标题
  // autotitle 优先级应该是最低的
  if (profile.autocomplete.on) {
    const result = await utils.autocomplete.checkGetWord(text)
    if (result) return result
  }
  if (profile.anotherautotitle.on) {
    const result = utils.anotherautotitle.checkGetTitle(text)
    // 可以作为标题
    if (result) return result
  }
  return { text }
}
