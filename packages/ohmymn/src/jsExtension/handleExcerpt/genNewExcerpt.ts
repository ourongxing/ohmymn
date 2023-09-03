import type { MbBookNote, NodeNote } from "marginnote"
import { removeHighlight } from "marginnote"
import { autoUtils } from "~/coreModule"
import { DragMerge, HasTitleThen } from "~/modules/addon/typings"
import { cacheTransformer } from "~/profile"

export async function customOCR() {
  const utils = autoUtils.customOCR?.filter(k => k.status())
  if (utils?.length) {
    const imgBase64 = MN.currentDocumentController
      .imageFromFocusNote()
      .base64Encoding()
    for (const util of utils) {
      const res = await util.method({ imgBase64 })
      if (res) return res
    }
    MN.log("Custom OCR over", "ocr")
  }
}

async function genTitles(note: MbBookNote, node: NodeNote, text: string) {
  const utils = autoUtils.generateTitles?.filter(k => k.status())
  if (utils?.length) {
    for (const util of utils) {
      const r = await util.method({ note, node, text })
      if (r) return r
    }
  }
}

export async function genCommentTag(
  note: MbBookNote,
  node: NodeNote,
  text: string
) {
  const retVal = {
    comments: [] as string[],
    tags: [] as string[]
  }
  const genCommentsUtils = autoUtils.generateComments?.filter(k => k.status())
  const genTagsUtils = autoUtils.generateTags?.filter(k => k.status())
  if (genCommentsUtils?.length) {
    for (const util of genCommentsUtils) {
      const res = await util.method({ note, node, text })
      if (res) retVal.comments.push(...res)
    }
  }
  if (genTagsUtils?.length) {
    for (const util of genTagsUtils) {
      const res = await util.method({ note, node, text })
      if (res) retVal.tags.push(...res)
    }
  }
  return retVal
}

export async function genTitleTextCommentTag(param: {
  note: MbBookNote
  text: string
  node: NodeNote
  isComment: boolean
}) {
  const { note, text, node, isComment } = param
  const nodeTitle = node.titles
  const { hasTitleThen, dragMerge } = self.globalProfile.addon
  const { cacheTitle } = self.notebookProfile.additional
  let generatedTitles: string[] | undefined = undefined
  let modifiedText = text
  let insertIndex: undefined | number = undefined

  const retVal = {
    text,
    title: [] as string[],
    comments: [] as string[],
    tags: [] as string[]
  }

  const utils = autoUtils.modifyExcerptText?.filter(k => k.status())
  if (utils?.length) {
    for (const util of utils) {
      const res = await util.method({ node, note, text: retVal.text })
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
    let res = await genTitles(note, node, retVal.text)
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
      const cache = cacheTitle[self.excerptStatus.noteid]
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
      cacheTitle[self.excerptStatus.noteid] = generatedTitles.map(k =>
        cacheTransformer.to(k)
      )
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
    const { tags, comments } = await genCommentTag(note, node, temp)
    retVal.tags.push(...tags)
    retVal.comments.push(...comments)
  }

  return retVal
}

export async function modifyTitles(titles: string[]) {
  if (self.excerptStatus.isModify) titles = titles.map(k => removeHighlight(k))
  const utils = autoUtils.modifyTitles?.filter(k => k.status())
  if (utils?.length)
    for (const util of utils) {
      const res = await util.method({ titles })
      if (res) titles = res
    }
  return titles
}

export async function genColorStyle(note: MbBookNote) {
  const utils = autoUtils.modifyStyle?.filter(k => k.status())
  if (utils?.length)
    for (const util of utils) {
      const res = await util.method({ note })
      if (res) return res
    }
}
