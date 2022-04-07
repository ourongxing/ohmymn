import { MbBookNote } from "typings"
import { utils } from "synthesizer"
import { HasTitleThen } from "modules/addon/enum"
import { MN } from "const"
import { removeHighlight } from "utils/note"
import { cacheTransformer } from "utils/profile"

export const customOCR = async () => {
  const imgBase64 = MN.studyController()
    .readerController.currentDocumentController.imageFromFocusNote()
    .base64Encoding()
  if (utils.customOCR)
    for (const util of utils.customOCR) {
      const res = await util(imgBase64)
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
  const { hasTitleThen } = self.profile.addon
  const { cacheTitle } = self.docProfile.additional
  const comments: string[] = []
  const tags: string[] = []

  const newText = await (async text => {
    if (utils.modifyExcerptText)
      for (const util of utils.modifyExcerptText) {
        const res = await util(note, text)
        if (res) text = res
      }
    return text
  })(text)

  if (utils.generateComments)
    for (const util of utils.generateComments) {
      const res = await util(note, text)
      if (res) comments.push(...res)
    }

  if (utils.generateTags)
    for (const util of utils.generateTags) {
      const res = await util(note, text)
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
    if (utils.generateTitles)
      for (const util of utils.generateTitles) {
        const res = await util(note, text)
        if (res) return res
      }
  })(newText)

  if (!res) return defaultRet

  res.title = await (async title => {
    if (self.isModify) title = title.map(k => removeHighlight(k))
    if (utils.modifyTitles)
      for (const util of utils.modifyTitles) {
        const res = await util(title)
        if (res) title = res
      }
    return title
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
      title: newTitles,
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

export const newTag = async (note: MbBookNote, text: string) => {
  if (!text) return
}

export const newColorStyle = async (note: MbBookNote) => {
  if (utils.modifyStyle)
    for (const util of utils.modifyStyle) {
      const res = await util(note)
      if (res) return res
    }
}
