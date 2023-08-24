import type { MbBookNote, NodeNote } from "marginnote"
import {
  confirm,
  MN,
  select,
  setLocalDataByKey,
  showHUD,
  undoGroupingWithRefresh
} from "marginnote"
import { gt } from "semver"
import { Addon } from "~/addon"
import { moduleNameList } from "~/dataSource"
import { layoutViewController } from "~/JSExtension/switchPanel"
import { dateFormat } from "~/utils"
import { decode, encode } from "~/utils/third party/base64"
import { readProfile, rewriteProfile, writeProfile } from "."
import lang from "./lang"
import { ManageProfileItems, Range, RewriteRange } from "./typings"

export function removeProfile() {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(
    Addon.globalProfileKey
  )
  NSUserDefaults.standardUserDefaults().removeObjectForKey(Addon.docProfileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(
    Addon.notebookProfileKey
  )
}

export async function writeProfile2Card(node: MbBookNote, full = true) {
  const { childNotes } = node
  if (!childNotes?.length) return
  let data: string
  let range: string
  let module: string
  if (full) {
    range = lang.range.all_profile
    data = encode(
      JSON.stringify({
        key: Addon.key,
        version: Addon.version,
        profiles: {
          allDocProfileTemp: self.allDocProfile,
          allGlobalProfileTemp: self.allGlobalProfile,
          allNotebookProfileTemp: self.allNotebookProfile
        }
      })
    )
  } else {
    const { index } = await select(
      lang.$profile_select_items9,
      lang.profile_management,
      lang.which_part_profile,
      true
    )
    if (index === -1) return
    const profiles = await (async () => {
      switch (index) {
        case ManageProfileItems.All:
          return {
            allDocProfileTemp: self.allDocProfile,
            allGlobalProfileTemp: self.allGlobalProfile,
            allNotebookProfileTemp: self.allNotebookProfile
          }
        case ManageProfileItems.Global1:
        case ManageProfileItems.Global2:
        case ManageProfileItems.Global3:
        case ManageProfileItems.Global4:
        case ManageProfileItems.Global5: {
          const items = [lang.all_modules, ...moduleNameList.name]
          const { index: i } = await select(
            items,
            lang.profile_management,
            lang.which_module_profile_write
          )
          module = items[i]
          if (i === 0) {
            return {
              allGlobalProfileTemp: {
                [index - 1]: self.allGlobalProfile[index - 1]
              }
            }
          } else {
            return {
              allGlobalProfileTemp: {
                [index - 1]: {
                  [moduleNameList.key[i - 1]]:
                    self.allGlobalProfile[index - 1][moduleNameList.key[i - 1]]
                }
              }
            }
          }
        }
        case ManageProfileItems.AllGlobal:
          return {
            allGlobalProfileTemp: self.allGlobalProfile
          }
        case ManageProfileItems.Doc:
          return {
            allDocProfileTemp: self.allDocProfile
          }
        default:
          return {
            allNotebookProfileTemp: self.allNotebookProfile
          }
      }
    })()
    range = lang.$profile_select_items9[index]
    data = encode(
      JSON.stringify({
        key: Addon.key,
        version: Addon.version,
        profiles
      })
    )
  }

  const dataLen = data.length
  const step = Math.ceil(dataLen / childNotes.length)
  undoGroupingWithRefresh(() => {
    node.noteTitle = lang.note_title
    node.excerptText = lang.note_content(range, dateFormat(new Date()), module)
    for (let i = 0, j = 0; i < dataLen; i += step, j++) {
      childNotes[j].excerptText = data.slice(i, i + step)
      childNotes[j].noteTitle = String(j + 1)
    }
  })
}

export async function readProfilefromCard(node: MbBookNote) {
  try {
    if (!MN.currentDocmd5 || !MN.currnetNotebookId) return
    if (!node.childNotes?.length) throw lang.no_children
    // 传入单一全局配置
    async function getGlobalPath(p: any, n?: number) {
      const pKeys = Object.keys(p)
      const pModuleKeys = moduleNameList.key.filter(k => pKeys.includes(k))
      const pModuleNames = pModuleKeys.map(
        k => moduleNameList.name[moduleNameList.key.indexOf(k)]
      )

      if (pModuleKeys.length === 1) {
        const { index } = await select(
          lang.$global_profile_items5,
          lang.profile_management,
          lang.one_module_global(
            n!,
            moduleNameList.name[moduleNameList.key.indexOf(pModuleKeys[0])]
          ),
          true
        )
        if (index === -1) return
        return {
          index,
          profile: {
            ...self.allGlobalProfile[index],
            ...rewriteProfile(RewriteRange.SingleGlobal, p)
          }
        }
      } else {
        const { index: j } = await select(
          [lang.all_modules, ...pModuleNames],
          lang.profile_management,
          lang.detecte_global_profile(n)
        )
        const { index } = await select(
          lang.$global_profile_items5,
          lang.profile_management,
          lang.which_global_profile_read_into,
          true
        )
        if (index === -1) return
        return {
          index,
          profile:
            j === 0
              ? rewriteProfile(RewriteRange.SingleGlobal, p)
              : {
                  ...self.allGlobalProfile[index],
                  ...rewriteProfile(RewriteRange.SingleGlobal, {
                    [pModuleKeys[j - 1]]: p[pModuleKeys[j - 1]]
                  })
                }
        }
      }
    }

    const text = node.childNotes
      .map(k => ({
        text: k.excerptText,
        title: k.noteTitle
      }))
      .sort((a, b) => Number(a.title) - Number(b.title))
      .reduce((acc, cur) => {
        acc += cur.text
        return acc
      }, "")
    const data = (() => {
      try {
        return JSON.parse(decode(text))
      } catch {
        throw lang.parse_failed
      }
    })()
    if (data.key !== undefined && data.key !== Addon.key)
      throw lang.not_this_profile
    const profiles = data.profiles ?? data
    Addon.lastVersion = data.version ?? "4.0.0"
    if (gt(Addon.lastVersion, Addon.version)) {
      showHUD(lang.old_version)
    }
    const profileKeys = Object.keys(profiles)
    if (profileKeys.length === 3) {
      const {
        allDocProfileTemp,
        allGlobalProfileTemp,
        allNotebookProfileTemp
      }: {
        allDocProfileTemp: typeof self.allDocProfile
        allGlobalProfileTemp: typeof self.allGlobalProfile
        allNotebookProfileTemp: typeof self.allNotebookProfile
      } = profiles
      const { index: profileIndex } = await select(
        lang.$profile_select_items9,
        lang.profile_management,
        lang.detecte_all_profile,
        true
      )
      if (profileIndex === -1) return
      switch (profileIndex) {
        case ManageProfileItems.All:
          self.allGlobalProfile = rewriteProfile(
            RewriteRange.AllGlobal,
            allGlobalProfileTemp
          )
          self.allDocProfile = rewriteProfile(
            RewriteRange.Doc,
            allDocProfileTemp
          )
          self.allNotebookProfile = rewriteProfile(
            RewriteRange.Notebook,
            allNotebookProfileTemp
          )
          break
        case ManageProfileItems.Global1:
        case ManageProfileItems.Global2:
        case ManageProfileItems.Global3:
        case ManageProfileItems.Global4:
        case ManageProfileItems.Global5: {
          const res = await getGlobalPath(
            allGlobalProfileTemp[profileIndex - 1]
          )
          if (res) {
            self.allGlobalProfile[res.index] = res.profile
          } else return
          break
        }
        case ManageProfileItems.AllGlobal:
          self.allGlobalProfile = rewriteProfile(
            RewriteRange.AllGlobal,
            allGlobalProfileTemp
          )
          break
        case ManageProfileItems.Doc:
          self.allDocProfile = rewriteProfile(
            RewriteRange.Doc,
            allDocProfileTemp
          )
          break
        case ManageProfileItems.Notebook:
          self.allNotebookProfile = rewriteProfile(
            RewriteRange.Notebook,
            allNotebookProfileTemp
          )
          break
      }
    } else if (profileKeys.length === 1) {
      const profileKey = profileKeys[0]
      if (profileKey === "allDocProfileTemp") {
        if (await confirm(lang.profile_management, lang.detecte_doc_profile))
          self.allDocProfile = rewriteProfile(
            RewriteRange.Doc,
            profiles[profileKey]
          )
        else return
      } else if (profileKey === "allGlobalProfileTemp") {
        const globalProfile = profiles[profileKey]
        // 所有全局配置
        if (Array.isArray(globalProfile)) {
          const { index: i } = await select(
            [lang.range.all_global_profile, ...lang.$global_profile_items5],
            lang.profile_management,
            lang.detecte_all_notebook_profile,
            true
          )
          if (i === -1) return
          else if (i === 0)
            self.allGlobalProfile = rewriteProfile(
              RewriteRange.AllGlobal,
              globalProfile
            )
          else {
            const res = await getGlobalPath(globalProfile[i - 1])
            if (res) {
              self.allGlobalProfile[res.index] = res.profile
            } else return
          }
        }
        // 单一全局配置
        else {
          const num = Object.keys(globalProfile)[0]
          const res = await getGlobalPath(globalProfile[0], Number(num) + 1)
          if (res) {
            self.allGlobalProfile[res.index] = res.profile
          } else return
        }
      } else if (profileKey === "allNotebookProfileTemp") {
        if (
          await confirm(lang.profile_management, lang.detecte_notebook_profile)
        )
          self.allNotebookProfile = rewriteProfile(
            RewriteRange.Notebook,
            profiles[profileKey]
          )
        else return
      }
    } else throw ""

    // keep last version to current version
    self.allGlobalProfile.forEach(k => {
      k.additional.lastVision = Addon.version
    })
    setLocalDataByKey(self.allNotebookProfile, Addon.notebookProfileKey)
    setLocalDataByKey(self.allGlobalProfile, Addon.globalProfileKey)
    setLocalDataByKey(self.allDocProfile, Addon.docProfileKey)
    readProfile({
      range: Range.All,
      docmd5: MN.currentDocmd5,
      notebookid: MN.currnetNotebookId
    })
    layoutViewController()
    showHUD(lang.success)
  } catch (err) {
    MN.error(err)
    showHUD(`${lang.fail}：${err}`)
  }
}

export async function manageProfileAction(node: NodeNote, option: number) {
  if (!MN.currentDocmd5 || !MN.currnetNotebookId) return
  // Write
  switch (option) {
    case 0:
      readProfilefromCard(node.note)
      break
    case 1:
      if (!node.childNodes.length) showHUD(lang.no_children)
      else {
        writeProfile({
          range: Range.All,
          docmd5: MN.currentDocmd5,
          notebookid: MN.currnetNotebookId
        })
        writeProfile2Card(node.note, false)
      }
      break
    case 2:
      removeProfile()
      readProfile({
        range: Range.All,
        docmd5: MN.currentDocmd5,
        notebookid: MN.currnetNotebookId
      })
      showHUD(lang.profile_reset)
      break
    case 3:
      readProfile({
        range: Range.All,
        docmd5: MN.currentDocmd5,
        notebookid: MN.currnetNotebookId
      })
      showHUD(lang.profile_sync)
      break
  }
}
