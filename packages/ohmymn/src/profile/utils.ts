import type { NoteComment } from "marginnote"
import { minVersion, satisfies } from "semver"
import { Addon } from "~/addon"
import type { AllModuleKeyUnion } from "~/coreModule"
import type { IConfig } from "~/typings"
import { rewriteSelection } from "./rewrite"
import type { IDocProfile, IGlobalProfile, INotebookProfile } from "./typings"
import { RewriteRange } from "./typings"

/**
 * @param link Card link
 * @returns ID of note or the linked card value
 */
export function getMNLinkValue(link: string) {
  try {
    const noteid = link.replace(MN.scheme + "://note/", "")
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
  function resloveGlobal(
    p: IGlobalProfile,
    module: string,
    key: string,
    f: any
  ) {
    if (p[module]?.[key] !== undefined) {
      p[module][key] = f(p[module][key], p)
    } else if (key === "cardAction") {
      if (p.gesture) {
        ;["single", "muilt"].forEach(k =>
          ["Up", "Down", "Left", "Right"].forEach(j => {
            p.gesture[`${k}BarSwipe${j}`] = f(p.gesture[`${k}BarSwipe${j}`], p)
          })
        )
      }
      if (p.toolbar) {
        Array.from({ length: 8 }).forEach((_, k) => {
          p.shortcut[`cardToolbar${k}`] = f(p.shortcut[`cardToolbar${k}`], p)
        })
      }
      if (p.shortcut) {
        Array.from({ length: 8 }).forEach((_, k) => {
          p.shortcut[`cardShortcut${k}`] = f(p.shortcut[`cardShortcut${k}`], p)
        })
      }
    } else if (key === "textAction") {
      if (p.gesture) {
        ;["Up", "Down", "Left", "Right"].forEach(j => {
          p.gesture[`selectionBarSwipe${j}`] = f(
            p.gesture[`selectionBarSwipe${j}`],
            p
          )
        })
      }
      if (p.toolbar) {
        Array.from({ length: 4 }).forEach((_, k) => {
          p.shortcut[`textToolbar${k}`] = f(p.shortcut[`textToolbar${k}`], p)
        })
      }
      if (p.shortcut) {
        Array.from({ length: 4 }).forEach((_, k) => {
          p.shortcut[`textShortcut${k}`] = f(p.shortcut[`textShortcut${k}`], p)
        })
      }
    } else return false
    return true
  }

  let { lastVersion } = Addon
  rewriteSelection.forEach(k => {
    const { version, global, doc, notebook } = k
    if (
      satisfies(lastVersion, version.from) &&
      satisfies(Addon.version, version.to)
    ) {
      lastVersion = minVersion(k.version.to)!.version
      switch (range) {
        case RewriteRange.Doc:
          if (doc) {
            const docProfileList = Object.values(
              profile as unknown as Record<string, IDocProfile>
            )
            for (const [module, _] of Object.entries(doc))
              for (const [key, f] of Object.entries(_))
                for (const p of docProfileList) {
                  if (p[module]?.[key] !== undefined) {
                    p[module][key] = f(p[module][key], p)
                  } else return
                }
          }
          break
        case RewriteRange.AllGlobal:
          if (global) {
            for (const [module, _] of Object.entries(global))
              for (const [key, f] of Object.entries(_))
                for (const p of profile as unknown as IGlobalProfile[]) {
                  if (!resloveGlobal(p, module, key, f)) return
                }
          }
          break
        case RewriteRange.SingleGlobal:
          if (global) {
            for (const [module, _] of Object.entries(global))
              for (const [key, f] of Object.entries(_))
                if (
                  !resloveGlobal(
                    profile as unknown as IGlobalProfile,
                    module,
                    key,
                    f
                  )
                )
                  return
          }
          break
        case RewriteRange.Notebook:
          if (notebook) {
            const notebookProfileList = Object.values(
              profile as unknown as Record<string, INotebookProfile>
            )
            for (const [module, _] of Object.entries(notebook))
              for (const [key, f] of Object.entries(_))
                for (const p of notebookProfileList) {
                  if (p[module]?.[key] !== undefined) {
                    p[module][key] = f(p[module][key], p)
                  } else return
                }
          }
          break
      }
    }
  })
  return profile
}
