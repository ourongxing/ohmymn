import { MN } from "~/const"
import { IGlobalProfile } from "~/profile"
import { noteComment } from "~/typings"

/**
 * @param link Card link (UUID)
 * @returns ID of note or the linked card value
 */
export const getMNLinkValue = (link: string) => {
  const noteid = link.replace("marginnote3app://note/", "")
  if (noteid === link) return link
  const node = MN.db.getNoteById(noteid)
  if (node && node.childNotes?.length) {
    const x = node.childNotes.reduce((acc, cur) => {
      const firstComment = cur.comments[0] as noteComment
      if (
        cur.colorIndex !== 13 &&
        firstComment.type === "TextNote" &&
        firstComment.text
      )
        return [...acc, firstComment.text]
      return acc
    }, [] as string[])
    if (x.length) return x.join(";")
  } else return undefined
}

export const checkNewVerProfile = (
  profile: IGlobalProfile,
  profileSaved: any
) => {
  for (const [name, _] of Object.entries(profile)) {
    for (const [key, val] of Object.entries(_)) {
      if (profileSaved?.[name]?.[key] === undefined) {
        return true
      }
    }
  }
}

export const cacheTransformer = {
  to(str: string): [string, string, string] {
    return [str[0], str[5] ?? "", str[str.length - 1]]
  },
  tell(cache: [string, string, string], str: string) {
    const [start, middle, end] = cache
    return (
      str[0] === start &&
      str[5] === (middle === "" ? undefined : middle) &&
      str[str.length - 1] === end
    )
  }
}

// export const reuseCacheTitle = () => {}
