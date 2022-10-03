import { MN } from "~/sdk"
import { rewriteSelection } from "./defaultProfile"
import { IConfig, noteComment } from "~/typings"
import {
  Range,
  IAllProfile,
  IGlobalProfile,
  IDocProfile,
  INotebookProfile
} from "./typings"
import semver from "semver"
import { Addon } from "~/addon"

/**
 * @param link Card link
 * @returns ID of note or the linked card value
 */
export function getMNLinkValue(link: string) {
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

export function defineConfig<T extends keyof IAllProfile>(options: IConfig<T>) {
  return options
}

export function rewriteProfile<T>(range: Range, profile: T): T {
  let { lastVersion } = Addon
  rewriteSelection.forEach(k => {
    ;(function () {
      const { version, global, doc, notebook } = k
      if (
        semver.satisfies(lastVersion, version.from) &&
        semver.satisfies(Addon.version, version.to)
      ) {
        lastVersion = semver.minVersion(k.version.to)!.version
        switch (range) {
          case Range.Doc:
            if (doc) {
              const docProfileList = Object.values(
                profile as Record<string, IDocProfile>
              )
              for (const [module, _] of Object.entries(doc))
                for (const [key, f] of Object.entries(_))
                  for (const p of docProfileList) {
                    if (p[module]?.[key] !== undefined) {
                      p[module][key] = f(p[module][key])
                    } else return
                  }
            }
            break
          case Range.Global:
            if (global) {
              for (const [module, _] of Object.entries(global))
                for (const [key, f] of Object.entries(_))
                  for (const p of profile as IGlobalProfile[]) {
                    if (p[module]?.[key] !== undefined) {
                      p[module][key] = f(p[module][key])
                    } else if (key === "cardAction") {
                      ;["single", "muilt"].forEach(k =>
                        ["Up", "Down", "Left", "Right"].forEach(
                          j =>
                            (p.gesture[`${k}BarSwipe${j}`] = f(
                              p.gesture[`${k}BarSwipe${j}`]
                            ))
                        )
                      )
                      if (p.shortcut) {
                        Array.from({ length: 8 }).forEach((_, k) => {
                          p.shortcut[`cardShortcut${k}`] = f(
                            p.shortcut[`cardShortcut${k}`]
                          )
                        })
                      }
                    } else if (key === "textAction") {
                      ;["Up", "Down", "Left", "Right"].forEach(
                        j =>
                          (p.gesture[`selectionBarSwipe${j}`] = f(
                            p.gesture[`selectionBarSwipe${j}`]
                          ))
                      )
                      if (p.shortcut) {
                        Array.from({ length: 4 }).forEach((_, k) => {
                          p.shortcut[`textShortcut${k}`] = f(
                            p.shortcut[`textShortcut${k}`]
                          )
                        })
                      }
                    } else return
                  }
            }
            break
          case Range.Notebook:
            if (notebook) {
              const notebookProfileList = Object.values(
                profile as Record<string, INotebookProfile>
              )
              for (const [module, _] of Object.entries(notebook))
                for (const [key, f] of Object.entries(_))
                  for (const p of notebookProfileList) {
                    if (p[module]?.[key] !== undefined) {
                      p[module][key] = f(p[module][key])
                    } else return
                  }
            }
            break
        }
      }
    })()
  })
  return profile
}
