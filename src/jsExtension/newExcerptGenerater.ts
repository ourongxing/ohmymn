import { MbBookNote } from "typings"
import { utils } from "synthesizer"
import { HasTitleThen } from "modules/addon/enum"

export const newTitleText = async (
  text: string,
  nodeTitle: string[] | undefined,
  isComment: boolean
) => {
  const { hasTitleThen } = self.profile.addon
  const { cacheExcerptTitle } = self.docProfile.additional

  const newText = await (async text => {
    if (utils.text)
      for (const util of utils.text) {
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
    if (utils.title)
      for (const util of utils.title) {
        const res = await util(text)
        if (res) return res
      }
  })(newText)

  if (!res) return defaultRet

  // 规范化英文标题
  // if (isON("autostandardize") && self.profile.autostandardize.standardizeTitle)
  //   res.title = res.title.map(k => autostandardize.toTitleCase(k))

  if (nodeTitle?.length && hasTitleThen[0] === HasTitleThen.TitleLink) {
    const [oldTitle, stillUsingTitle] = (() => {
      if (self.isModify && cacheExcerptTitle[self.noteid]) {
        // 如果是在修改，要先对比原标题，将原来的标题分为改变了的和不变的，改变了的就删除，不变的就保留
        const [stillUsing, deprecated] = cacheExcerptTitle[self.noteid]!.reduce(
          (acc, cur) => {
            if (res.title.includes(cur)) acc[0].push(cur)
            else acc[1].push(cur)
            return acc
          },
          [[], []] as string[][]
        )
        return [nodeTitle.filter(k => !deprecated.includes(k)), stillUsing]
      } else return [nodeTitle, []]
    })()
    // 筛选出新的标题，不与以前的标题重复
    const newTitle = res.title.filter(k => !oldTitle.includes(k))
    // 保存每次新的标题
    cacheExcerptTitle[self.noteid] = [...stillUsingTitle, ...newTitle]
    return {
      text: res.text,
      title: [...oldTitle, ...newTitle]
    }
  }
  cacheExcerptTitle[self.noteid] = res.title
  return res
}

export const newTag = async (text: string) => {
  if (utils.tag)
    for (const util of utils.tag) {
      const res = await util(text)
      if (res) return res
    }
}

export const newColorStyle = async (note: MbBookNote) => {
  if (utils.style)
    for (const util of utils.style) {
      const res = await util(note)
      if (res) return res
    }
}
