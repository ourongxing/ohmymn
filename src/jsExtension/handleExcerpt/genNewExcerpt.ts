import { MbBookNote, MN, removeHighlight } from "marginnote"
import { autoUtils } from "~/merged"
import { DragMerge, HasTitleThen } from "~/modules/addon/typings"
import { cacheTransformer } from "~/profile"

export async function customOCR() {
  const imgBase64 = MN.currentDocumentController
    .imageFromFocusNote()
    .base64Encoding()
  if (autoUtils.customOCR)
    for (const util of autoUtils.customOCR) {
      const res = await util({ imgBase64 })
      if (res) return res
    }
}

async function genTitles(note: MbBookNote, text: string) {
  if (autoUtils.generateTitles) {
    for (const util of autoUtils.generateTitles) {
      const r = await util({ note, text })
      if (r) return r
    }
  }
}

export async function genCommentTag(note: MbBookNote, text: string) {
  const retVal = {
    comments: [] as string[],
    tags: [] as string[]
  }
  if (autoUtils.generateComments) {
    for (const util of autoUtils.generateComments) {
      const res = await util({ note, text })
      if (res) retVal.comments.push(...res)
    }
  }
  if (autoUtils.generateTags) {
    for (const util of autoUtils.generateTags) {
      const res = await util({ note, text })
      if (res) retVal.tags.push(...res)
    }
  }
  return retVal
}

export async function genTitleTextCommentTag(param: {
  note: MbBookNote
  text: string
  nodeNote: MbBookNote
  isComment: boolean
}) {
  const { note, text, nodeNote, isComment } = param
  const nodeTitle = nodeNote.noteTitle?.split(/\s*[;；]\s*/) ?? []
  const { hasTitleThen, dragMerge } = self.globalProfile.addon
  const { cacheTitle } = self.notebookProfile.additional
  let generatedTitles: string[] | undefined = undefined
  let modifiedText: string | undefined = undefined
  let insertIndex: undefined | number = undefined

  const retVal = {
    text,
    title: [] as string[],
    comments: [] as string[],
    tags: [] as string[]
  }

  if (autoUtils.modifyExcerptText) {
    for (const util of autoUtils.modifyExcerptText) {
      const res = await util({ note, text: retVal.text })
      if (res) retVal.text = res
    }
    modifiedText = retVal.text
  }

  if (
    isComment &&
    (dragMerge[0] === DragMerge.NotGenTitle ||
      (dragMerge[0] !== DragMerge.NotGenTitle &&
        nodeTitle.length !== 0 &&
        hasTitleThen[0] === HasTitleThen.NotTurnTitle))
  ) {
  } else {
    let res = await genTitles(note, retVal.text)
    if (!res && isComment && dragMerge[0] === DragMerge.AlwaysTurnTitle) {
      res = {
        title: [retVal.text],
        text: ""
      }
    }
    if (res?.title.length) {
      generatedTitles = res.title
      retVal.text = res.text
      retVal.comments = [...(res?.comments ?? []), ...retVal.comments]
      const cache = cacheTitle[self.noteid]
      if (self.excerptStatus.isModify && nodeTitle.length && cache?.length) {
        // 记录当前笔记产生的所有旧标题的索引
        const indexList = nodeTitle.reduce((acc, k, i) => {
          // 加到数组头部，因为后面删除时索引会变
          cache.some(h => cacheTransformer.tell(h, k)) && acc.unshift(i)
          return acc
        }, [] as number[])
        if (indexList.length) {
          insertIndex = indexList[indexList.length - 1]
          indexList.forEach(k => {
            nodeTitle.splice(k, 1)
          })
        }
      }
    }
    if (generatedTitles?.length) {
      cacheTitle[self.noteid] = generatedTitles.map(k => cacheTransformer.to(k))
      if (isComment) {
        if (hasTitleThen[0] === HasTitleThen.MergeTitle) {
          if (insertIndex !== undefined) {
            retVal.title = [...nodeTitle]
            retVal.title.splice(insertIndex, 0, ...generatedTitles)
          } else {
            retVal.title = [...nodeTitle, ...generatedTitles]
          }
        } else if (hasTitleThen[0] === HasTitleThen.OverrideTitle) {
          retVal.title = [...generatedTitles]
        }
      } else {
        if (insertIndex !== undefined) {
          retVal.title = [...nodeTitle]
          retVal.title.splice(insertIndex, 0, ...generatedTitles)
        } else {
          retVal.title = [...nodeTitle, ...generatedTitles]
        }
      }
    }
  }

  if (retVal.text || modifiedText) {
    let temp = retVal.text
    if (!temp && modifiedText) temp = modifiedText
    const { tags, comments } = await genCommentTag(note, temp)
    retVal.tags.push(...tags)
    retVal.comments.push(...comments)
  }

  return retVal
}

export async function modifyTitles(titles: string[]) {
  if (self.excerptStatus.isModify) titles = titles.map(k => removeHighlight(k))
  if (autoUtils.modifyTitles)
    for (const util of autoUtils.modifyTitles) {
      const res = await util({ titles })
      if (res) titles = res
    }
  return titles
}

export async function genColorStyle(note: MbBookNote) {
  if (autoUtils.modifyStyle)
    for (const util of autoUtils.modifyStyle) {
      const res = await util({ note })
      if (res) return res
    }
}
