import { Addon } from "~/addon"
import { renderTemplateOfNodeProperties } from "~/JSExtension/fetchNodeProperties"
import type { NodeNote } from "marginnote"
import { select, openURL, showHUD, removeHighlight } from "marginnote"
import { reverseEscape, escapeDoubleQuote } from "~/utils"
import { MultipleTitlesExcerpt, WhichPartofCard } from "./typings"
import lang from "./lang"

async function getTitleExcerpt(
  k: string[],
  type: "title" | "excerpt",
  origin = false
) {
  const { multipleTitles, multipleExcerpts } = self.globalProfile.copysearch
  if (k.length === 0) return undefined
  switch (type === "title" ? multipleTitles[0] : multipleExcerpts[0]) {
    case MultipleTitlesExcerpt.All: {
      const r = k.join(type === "title" ? "; " : "\n")
      return origin ? [r] : k.join(r)
    }
    case MultipleTitlesExcerpt.First:
      return origin ? [k[0]] : k[0]
    default:
      if (origin) return k
      return k.length === 1
        ? k[0]
        : (await select(k, Addon.title, lang.choose_you_want)).value
  }
}

function getCustomContent(node: NodeNote, type: "copy" | "search") {
  const { customContent, customSearchContent } = self.globalProfile.copysearch
  const custom = type === "copy" ? customContent : customSearchContent
  if (!custom) return undefined
  const template = reverseEscape(`${escapeDoubleQuote(custom)}`, true)
  return renderTemplateOfNodeProperties(node, template)
}

export async function getContentofOneCard(
  node: NodeNote,
  option: number,
  type: "copy" | "search"
) {
  const titles = node.titles
  const excerptText = node.excerptsText.map(k => removeHighlight(k))
  const customContent = getCustomContent(node, type)
  switch (option) {
    case WhichPartofCard.Title: {
      const res =
        ((await getTitleExcerpt(titles, "title")) as string) ??
        ((await getTitleExcerpt(excerptText, "excerpt")) as string) ??
        customContent
      if (res) return res
      break
    }
    case WhichPartofCard.Excerpt: {
      const res =
        ((await getTitleExcerpt(excerptText, "excerpt")) as string) ??
        customContent
      if (res) return res
      break
    }
    case WhichPartofCard.Custom: {
      const res = customContent
      if (res) return res
      break
    }
    default: {
      const list = [
        ...((await getTitleExcerpt(titles, "title", true)) ?? []),
        ...((await getTitleExcerpt(excerptText, "excerpt", true)) ?? [])
      ]
      if (customContent) list.push(customContent)
      if (list.length === 1) return list[0]
      else return (await select(list, Addon.title, lang.choose_you_want)).value
    }
  }
}
export function getContentofMuiltCards(
  nodes: NodeNote[],
  option: number,
  type: "copy" | "search"
) {
  switch (option) {
    case 0: {
      const { multipleTitles } = self.globalProfile.copysearch
      return nodes.reduce((acc, cur) => {
        const t = cur.titles
        if (!t.length) return acc
        if (multipleTitles[0] === MultipleTitlesExcerpt.First) acc.push(...t)
        else acc.push(...t)
        return acc
      }, [] as string[])
    }
    case 1: {
      const { multipleTitles } = self.globalProfile.copysearch
      return nodes.reduce((acc, cur) => {
        const l = cur.excerptsText.map(k => removeHighlight(k))
        if (!l.length) return acc
        if (multipleTitles[0] === MultipleTitlesExcerpt.First) acc.push(l[0])
        else acc.push(l.join("\n"))
        return acc
      }, [] as string[])
    }
    default:
      return nodes.reduce((acc, cur) => {
        const t = getCustomContent(cur, type)
        t && acc.push(t)
        return acc
      }, [] as string[])
  }
}
export async function search(text: string, option: number) {
  const {
    searchAcademic,
    searchChineseText,
    searchEnglishText,
    searchOtherText,
    searchQuestion,
    searchTranslation,
    searchWord
  } = self.globalProfile.copysearch
  const searchEngine = [
    searchChineseText,
    searchEnglishText,
    searchWord,
    searchTranslation,
    searchAcademic,
    searchQuestion,
    searchOtherText
  ][option]
  if (searchEngine)
    openURL(searchEngine.replace("{{keyword}}", encodeURIComponent(text)))
  else showHUD(lang.no_search_engine_url, 2)
}
