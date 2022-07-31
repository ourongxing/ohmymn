import { renderTemplateOfNodeProperties } from "~/jsExtension/nodeProperties"
import { MbBookNote } from "~/typings"
import { unique } from "~/utils"
import { regFlag } from "~/utils/input"
import { TitleLinkSplit, AutoDefPreset } from "./typings"

export function toTitleLink(text: string) {
  if (!self.globalProfile.anotherautodef.toTitleLink) return [text]
  const regs: RegExp[] = []
  const { titleLinkSplit } = self.globalProfile.anotherautodef
  const { customTitleSplit } = self.tempProfile.regArray
  if (titleLinkSplit.includes(TitleLinkSplit.Custom) && customTitleSplit)
    regs.push(...customTitleSplit[0])
  if (titleLinkSplit.includes(TitleLinkSplit.Default))
    regs.push(/或者?|[简又]?称(?:之?为)?/g)
  if (titleLinkSplit.includes(TitleLinkSplit.Punctuation)) {
    regs.push(/[、。,，‘’“”"『』()（）【】「」《》«»\/\[\]]/g)
  }

  const defs = regs
    .reduce((acc, reg) => acc.replace(regFlag.add(reg, "g"), "😎"), text)
    .split("😎")
    .reduce((acc, k) => {
      k = k.trim()
      if (k) acc.push(k)
      return acc
    }, [] as string[])
  return defs.length > 1 ? unique<string>(defs) : [text]
}

export function splitExtractTitles(note: MbBookNote, text: string) {
  const { preset, onlyDesc } = self.globalProfile.anotherautodef
  for (const set of preset)
    switch (set) {
      case AutoDefPreset.CustomExtract: {
        const { customExtractTitle: params } = self.tempProfile.replaceParam
        if (!params) continue
        let flag = 0
        const allTitles = unique(
          params.reduce((acc, cur) => {
            const { newSubStr, fnKey } = cur
            let { regexp } = cur
            if (flag === 0) flag = fnKey
            regexp = regFlag.add(regexp, "g")
            if (regexp.test(text)) {
              acc.push(
                ...text
                  .match(regexp)!
                  .map(k =>
                    k.replace(
                      regexp,
                      renderTemplateOfNodeProperties(note, newSubStr)
                    )
                  )
              )
            }
            return acc
          }, [] as string[])
        )
        if (allTitles.length)
          return {
            title: allTitles,
            text: flag ? "" : text
          }
        break
      }
      case AutoDefPreset.CustomTitleSplit: {
        const { customDefLink } = self.tempProfile.regArray
        if (!customDefLink) continue
        const regs = customDefLink.flat()
        for (let reg of regs) {
          let isReverse = false
          // 使用 y 来表示定义项在后面的情况，则 y 失效，应该很少人会用到 y
          if (reg.sticky) {
            reg = regFlag.remove(reg, "y")
            isReverse = true
          }
          if (reg.test(text)) {
            let [def, desc] = text.split(reg).filter(k => k)
            // 交换顺序
            if (isReverse) [def, desc] = [desc, def]
            return {
              title: toTitleLink(def),
              text: onlyDesc ? desc : text
            }
          }
        }
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
            title: toTitleLink(def),
            text: onlyDesc ? desc : text
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
            title: toTitleLink(def),
            text: onlyDesc ? desc : text
          }
        }
        break
      }
    }
}
