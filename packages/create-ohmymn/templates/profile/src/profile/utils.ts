import type { NoteComment } from "marginnote"
import type { AllModuleKeyUnion } from "~/coreModule"
import type { IConfig } from "~/typings"
import type { IGlobalProfile } from "./typings"
import { RewriteRange } from "./typings"

/**
 * @param link Card link
 * @returns ID of note or the linked card value
 */
export function getMNLinkValue(link: string) {
  try {
    const noteid = link.replace("marginnote3app://note/", "")
    if (noteid === link) return link
    const node = MN.db.getNoteById(noteid)
    if (node && node.childNotes?.length) {
      const x = node.childNotes.reduce((acc, cur) => {
        if (cur.comments.length) {
          const firstComment = cur.comments[0] as NoteComment
          if (
            cur.colorIndex !== 13 &&
            firstComment.type === "TextNote" &&
            firstComment.text
          )
            return [...acc, firstComment.text]
        }
        return acc
      }, [] as string[])
      if (x.length) return x.join(";")
    }
  } catch (e) {
    MN.error(e)
    return undefined
  }
}

export function checkNewVerProfile(profile: IGlobalProfile, profileSaved: any) {
  for (const [name, _] of Object.entries(profile)) {
    for (const [key, val] of Object.entries(_)) {
      if (profileSaved?.[name]?.[key] === undefined) {
        return true
      }
    }
  }
  return false
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

export function defineConfig<T extends AllModuleKeyUnion>(options: IConfig<T>) {
  return options
}

export function rewriteProfile<T>(range: RewriteRange, profile: T): T {
  return profile
}
