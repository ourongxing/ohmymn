import { renderTemplateOfNodeProperties } from "~/jsExtension/nodeProperties"
import { MbBookNote } from "~/typings"
import { unique } from "~/utils"
import { regFlag, ReplaceParam } from "~/utils/input"
import { TitleLinkSplit, AutoDefPreset } from "./typings"

function split2MuiltTitles(text: string) {
  if (!self.globalProfile.anotherautodef.toTitleLink) return [text]
  const regGroups: RegExp[][] = []
  const { titleLinkSplit } = self.globalProfile.anotherautodef
  const { customTitleSplit } = self.tempProfile.regArray
  if (titleLinkSplit.includes(TitleLinkSplit.Custom) && customTitleSplit)
    regGroups.push(...customTitleSplit)
  if (titleLinkSplit.includes(TitleLinkSplit.Default))
    regGroups.push([/或者?|[简又]?称(?:之?为)?/g])
  if (titleLinkSplit.includes(TitleLinkSplit.Punctuation)) {
    regGroups.push([/[、。,，‘’“”"『』()（）【】「」《》«»\/\[\]]/g])
  }

  const defs = regGroups
    .reduce((acc, regGroup) => {
      if (!regGroup.length) return acc
      const mainReg = regGroup[0]
      const matched = text.match(mainReg)
      if (matched && regGroup.slice(1).every(k => k.test(matched[0]))) {
        return acc.replace(regFlag.add(mainReg, "g"), "😎")
      } else return acc
    }, text)
    .split("😎")
    .reduce((acc, k) => {
      k = k.trim()
      if (k) acc.push(k)
      return acc
    }, [] as string[])
  return defs.length > 1 ? unique(defs) : [text]
}

export function extractTitle(
  note: MbBookNote,
  text: string,
  params?: ReplaceParam[]
) {
  if (!text) return
  const { preset } = self.globalProfile.anotherautodef
  if (params === undefined && preset.includes(AutoDefPreset.CustomExtract)) {
    params = self.tempProfile.replaceParam.customExtractTitle
  }
  if (!params?.length) return
  let flag = 0
  const allTitles = params.reduce((acc, cur) => {
    const { newSubStr, fnKey } = cur
    let { regexp } = cur
    regexp = regFlag.add(regexp, "g")
    if (regexp.test(text)) {
      if (flag === 0) flag = fnKey
      acc.push(
        ...text
          .match(regexp)!
          .map(k =>
            k.replace(regexp, renderTemplateOfNodeProperties(note, newSubStr))
          )
      )
    }
    return acc
  }, [] as string[])
  if (allTitles.length)
    return {
      title: unique(allTitles),
      text: flag ? "" : text
    }
}

export function customSplit(text: string, regGloups?: RegExp[][]) {
  if (!text) return
  if (regGloups === undefined) {
    const { customDefLink } = self.tempProfile.regArray
    regGloups = customDefLink
  }
  if (!regGloups?.length) return
  for (const regGroup of regGloups) {
    if (!regGroup.length) continue
    let isReverse = false
    // 下次执行正则就没了
    let mainReg = regGroup[0]
    // 使用 y 来表示定义项在后面的情况，则 y 失效，应该很少人会用到 y
    if (mainReg.sticky) {
      mainReg = regFlag.remove(mainReg, "y")
      isReverse = true
    }
    const matched = text.match(mainReg)
    if (matched && regGroup.slice(1).every(k => k.test(matched[0]))) {
      let [def, desc] = text.split(mainReg).filter(k => k)
      // 交换顺序
      if (isReverse) [def, desc] = [desc, def]
      return {
        title: split2MuiltTitles(def),
        text: desc
      }
    }
  }
}

export function splitExcerptTitles(text: string, regGloups?: RegExp[][]) {
  if (!text) return
  const { preset } = self.globalProfile.anotherautodef
  for (const set of preset) {
    switch (set) {
      case AutoDefPreset.CustomTitleSplit: {
        const ret = customSplit(text, regGloups)
        if (ret) return ret
        break
      }
      case 2:
      case 3:
      case 4:
      case 5:
      case 6: {
        const reg = [
          /[：:]/,
          /[一—]{2}/,
          /[,，]\s*(?:通常|一般)*是指?/,
          /(?:通常|一般)*是指?\s*[,，]/,
          /(?:通常|一般)*是指/
        ][set - 2]
        if (reg.test(text)) {
          const [def, desc] = text.split(reg)
          return {
            title: split2MuiltTitles(def),
            text: desc
          }
        }
        break
      }
      // 以下为定义项在后面的情况
      case 7:
      case 8: {
        const reg = [/[,，].*称之?为/, /(?:通常|一般)?被?称之?为/][set - 7]
        if (reg.test(text)) {
          const [desc, def] = text.split(reg)
          return {
            title: split2MuiltTitles(def),
            text: desc
          }
        }
        break
      }
    }
  }
}
