import { MN } from "@/const"
import { HasTitleThen } from "@/modules/addon/typings"
import { autoUtils } from "@/synthesizer"
import { MbBookNote } from "@/typings"
import { unique } from "@/utils"
import { removeHighlight } from "@/utils/note"
import { cacheTransformer } from "@/utils/profile"

export const customOCR = async () => {
  const imgBase64 = MN.studyController()
    .readerController.currentDocumentController.imageFromFocusNote()
    .base64Encoding()
  if (autoUtils.customOCR)
    for (const util of autoUtils.customOCR) {
      const res = await util({ imgBase64 })
      if (res) return res
    }
}

export const newTitleTextCommentTag = async (param: {
  note: MbBookNote
  text: string
  nodeTitle: string[] | undefined
  isComment: boolean
}) => {
  const { note, text, nodeTitle, isComment } = param
  const { hasTitleThen } = self.globalProfile.addon
  const { cacheTitle } = self.notebookProfile.additional
  const comments: string[] = []
  const tags: string[] = []

  const newText = await (async text => {
    if (autoUtils.modifyExcerptText)
      for (const util of autoUtils.modifyExcerptText) {
        const res = await util({ note, text })
        if (res) text = res
      }
    return text
  })(text)

  if (autoUtils.generateComments)
    for (const util of autoUtils.generateComments) {
      const res = await util({ note, text })
      if (res) comments.push(...res)
    }

  if (autoUtils.generateTags)
    for (const util of autoUtils.generateTags) {
      const res = await util({ note, text })
      if (res) tags.push(...res)
    }

  const defaultRet = { text: newText, title: [] as string[], comments, tags }

  if (
    isComment &&
    nodeTitle?.length &&
    hasTitleThen[0] === HasTitleThen.NoChange
  )
    return defaultRet

  const res = await (async text => {
    if (autoUtils.generateTitles)
      for (const util of autoUtils.generateTitles) {
        const res = await util({ note, text })
        if (res)
          return {
            ...res,
            comments: res.comments ? res.comments.filter(k => k) : []
          }
      }
  })(newText)

  if (!res) return defaultRet

  res.title = await (async titles => {
    if (self.isModify) titles = titles.map(k => removeHighlight(k))
    if (autoUtils.modifyTitles)
      for (const util of autoUtils.modifyTitles) {
        const res = await util({ titles })
        if (res) titles = res
      }
    return titles
  })(res.title)

  if (nodeTitle?.length && hasTitleThen[0] === HasTitleThen.TitleLink) {
    const newTitles = (() => {
      if (self.isModify && cacheTitle[self.noteid]) {
        const cached = cacheTitle[self.noteid]
        // 记录当前笔记产生的所有旧标题的索引
        const index = nodeTitle.reduce((acc, k, i) => {
          cached?.some(h => cacheTransformer.tell(h, k)) && acc.unshift(i)
          return acc
        }, [] as number[])
        index.forEach((k, i) => {
          if (i === index.length - 1) {
            nodeTitle.splice(k, 1, ...res.title)
          } else nodeTitle.splice(k, 1)
        })
        return nodeTitle
      } else return [...nodeTitle, ...res.title]
    })()
    cacheTitle[self.noteid] = res.title.map(k => cacheTransformer.to(k))
    return {
      text: res.text,
      title: unique(newTitles),
      comments: res.comments?.length
        ? [...res.comments, ...comments]
        : comments,
      tags
    }
  }
  cacheTitle[self.noteid] = res.title.map(k => cacheTransformer.to(k))
  return {
    ...res,
    comments: res.comments?.length ? [...res.comments, ...comments] : comments,
    tags
  }
}

export const newColorStyle = async (note: MbBookNote) => {
  if (autoUtils.modifyStyle)
    for (const util of autoUtils.modifyStyle) {
      const res = await util({ note })
      if (res) return res
    }
}
