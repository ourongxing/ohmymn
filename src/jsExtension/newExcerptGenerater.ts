import { MbBookNote } from "typings"
import { utils } from "synthesizer"
import { HasTitleThen } from "modules/addon/enum"
import { MN } from "const"
import { removeHighlight } from "utils/note"

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

export const newTitleText = async (
  text: string,
  nodeTitle: string[] | undefined,
  isComment: boolean
) => {
  const { hasTitleThen } = self.profile.addon
  const { cacheExcerptTitle } = self.docProfile.additional

  const newText = await (async text => {
    if (utils.modifyExcerptText)
      for (const util of utils.modifyExcerptText) {
        const res = await util(text)
        if (res) text = res
      }
    return text
  })(text)

  const defaultRet = { text: newText, title: undefined }
  if (
    isComment &&
    nodeTitle?.length &&
    hasTitleThen[0] === HasTitleThen.NoChange
  )
    return defaultRet

  const res = await (async text => {
    if (utils.generateTitles)
      for (const util of utils.generateTitles) {
        const res = await util(text)
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
    const [oldTitles, unchanged] = (() => {
      if (self.isModify && cacheExcerptTitle[self.noteid]) {
        // If you are modifying, compare the original title first, divide the original title into changed and unchanged ones,
        // delete the changed ones and keep the unchanged ones
        const [unchanged, changed] = cacheExcerptTitle[self.noteid]!.reduce(
          (acc, cur) => {
            if (res.title.includes(cur)) acc[0].push(cur)
            else acc[1].push(cur)
            return acc
          },
          [[], []] as string[][]
        )
        return [nodeTitle.filter(k => !changed.includes(k)), unchanged]
      } else return [nodeTitle, []]
    })()
    // Filter new titles without duplicating previous ones
    const newTitles = res.title.filter(k => !oldTitles.includes(k))
    // Cache new title
    cacheExcerptTitle[self.noteid] = [...unchanged, ...newTitles]
    return {
      text: res.text,
      title: [...oldTitles, ...newTitles]
    }
  }
  cacheExcerptTitle[self.noteid] = res.title
  return res
}

export const newTag = async (text: string) => {
  if (utils.generateTags)
    for (const util of utils.generateTags) {
      const res = await util(text)
      if (res) return res
    }
}

export const newColorStyle = async (note: MbBookNote) => {
  if (utils.modifyStyle)
    for (const util of utils.modifyStyle) {
      const res = await util(note)
      if (res) return res
    }
}
