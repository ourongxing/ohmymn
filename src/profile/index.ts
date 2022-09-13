import { Addon } from "~/addon"
import { layoutViewController } from "~/jsExtension/switchPanel"
import { lang } from "./lang"
import {
  IGlobalProfile,
  IDocProfile,
  docProfilePreset,
  globalProfilePreset,
  INotebookProfile,
  notebookProfilePreset,
  IAllProfile
} from "~/profile/defaultProfile"
import { IConfig, MbBookNote } from "~/typings"
import { dateFormat, deepCopy } from "~/utils"
import {
  MN,
  delay,
  showHUD,
  undoGroupingWithRefresh,
  confirm,
  selectIndex,
  getLocalDataByKey,
  setLocalDataByKey
} from "~/sdk"
import { decode, encode } from "../utils/third party/base64"
import { ManageProfileItems, Range, ReadPrifile, WritePrifile } from "./typings"
import { refreshPanel, updateProfileDataSource } from "./updateDataSource"
import { checkNewVerProfile } from "./utils"
import { moduleNameList } from "~/dataSource"
export * from "./utils"
export * from "./updateDataSource"
export * from "./defaultProfile"
export * from "./typings"

export function defineConfig<T extends keyof IAllProfile>(options: IConfig<T>) {
  return options
}

let allGlobalProfile: IGlobalProfile[]
let allDocProfile: Record<string, IDocProfile>
let allNotebookProfile: Record<string, INotebookProfile>

const { globalProfileKey, docProfileKey, notebookProfileKey } = Addon

export function removeProfile() {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(globalProfileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(docProfileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(notebookProfileKey)
}

export const readProfile: ReadPrifile = ({
  range,
  notebookid,
  docmd5,
  profileNO
}) => {
  try {
    const readGlobalProfile = (profileNO: number) => {
      updateProfileDataSource(self.globalProfile, allGlobalProfile[profileNO])
      console.log("Read current global profile", "profile")
    }

    const readNoteBookProfile = (notebookid: string) => {
      updateProfileDataSource(
        self.notebookProfile,
        allNotebookProfile?.[notebookid] ?? notebookProfilePreset
      )
      console.log("Read currect notebook profile", "profile")
    }

    const readDocProfile = (docmd5: string) => {
      updateProfileDataSource(
        self.docProfile,
        allDocProfile?.[docmd5] ?? docProfilePreset
      )
      console.log("Read currect doc profile", "profile")
    }

    switch (range) {
      case Range.All: {
        // Read local data only on first open, then read doc profile and global profile
        const docProfileSaved: Record<string, IDocProfile> =
          getLocalDataByKey(docProfileKey)
        if (!docProfileSaved) console.log("Initialize doc profile", "profile")
        allDocProfile = docProfileSaved ?? { [docmd5]: docProfilePreset }

        const notebookProfileSaved: Record<string, INotebookProfile> =
          getLocalDataByKey(notebookProfileKey)
        if (!notebookProfileKey)
          console.log("Initialize notebook profile", "profile")
        allNotebookProfile = notebookProfileSaved ?? {
          [notebookid]: notebookProfilePreset
        }

        const globalProfileSaved: IGlobalProfile[] =
          getLocalDataByKey(globalProfileKey)
        if (!globalProfileSaved)
          console.log("Initialize global profile", "profile")
        allGlobalProfile =
          globalProfileSaved ?? Array(5).fill(globalProfilePreset)

        // if (!allGlobalProfile[0].additional.lastVision) {
        //   allGlobalProfile.forEach(k => {
        //     k.additional.lastVision = "4.0.0"
        //   })
        // }

        // Initialize all profile when new version release
        if (checkNewVerProfile(globalProfilePreset, allGlobalProfile[0])) {
          allGlobalProfile.forEach((_, index) => {
            const globalProfile = deepCopy(globalProfilePreset)
            updateProfileDataSource(globalProfile, allGlobalProfile[index])
            allGlobalProfile[index] = globalProfile
          })
          setLocalDataByKey(allGlobalProfile, globalProfileKey)
        }

        readNoteBookProfile(notebookid)
        readDocProfile(docmd5)
        readGlobalProfile(self.notebookProfile.addon.profile[0])
        break
      }

      case Range.Notebook: {
        readNoteBookProfile(notebookid)
        readGlobalProfile(self.notebookProfile.addon.profile[0])
        break
      }

      case Range.Doc: {
        readDocProfile(docmd5)
        break
      }

      case Range.Global: {
        readGlobalProfile(profileNO)
        break
      }
    }
    refreshPanel()
  } catch (err) {
    console.error(err)
  }
}

/**
 *
 *  Saving the doc profile must save the global profile.
 *  Switching profile only save the global profile.
 *  Switching doc will be saved to the previous doc profile.
 *
 */
export const writeProfile: WritePrifile = ({
  range,
  notebookid,
  docmd5,
  profileNO
}) => {
  const writeDocProfile = (docmd5: string) => {
    allDocProfile[docmd5] = deepCopy(self.docProfile)
    setLocalDataByKey(allDocProfile, docProfileKey)
    console.log("Write current doc profile", "profile")
  }
  const writeGlobalProfile = (profileNO: number) => {
    allGlobalProfile[profileNO] = deepCopy(self.globalProfile)
    setLocalDataByKey(allGlobalProfile, globalProfileKey)
    console.log("Write global profile", "profile")
  }
  const writeNotebookProfile = (notebookid: string) => {
    allNotebookProfile[notebookid] = deepCopy(self.notebookProfile)
    setLocalDataByKey(allNotebookProfile, notebookProfileKey)
    console.log("Write notebook profile", "profile")
  }
  switch (range) {
    case Range.All: {
      writeNotebookProfile(notebookid)
      writeDocProfile(docmd5)
      writeGlobalProfile(self.notebookProfile.addon.profile[0])
      break
    }
    case Range.Notebook: {
      writeNotebookProfile(notebookid)
      writeGlobalProfile(self.notebookProfile.addon.profile[0])
      break
    }
    case Range.Doc: {
      writeDocProfile(docmd5)
      break
    }
    case Range.Global: {
      writeGlobalProfile(profileNO)
      break
    }
  }
}

export async function saveProfile(name: string, key: string, value: any) {
  try {
    switch (key) {
      // 这个选项不参与初始化
      case "quickSwitch":
        self.globalProfile.addon.quickSwitch = value
        break
      case "profile":
        const lastProfileNum = self.notebookProfile.addon.profile[0]
        self.notebookProfile.addon.profile = value
        writeProfile({
          range: Range.Global,
          profileNO: lastProfileNum
        })
        readProfile({
          range: Range.Global,
          profileNO: value[0]
        })
        break
      default: {
        if (self.globalProfile?.[name]?.[key] !== undefined) {
          self.globalProfile[name][key] = value
          if (self.notebookProfile.addon.profile[0] === 4) {
            Object.entries(allGlobalProfile).forEach(([m, p]) => {
              if (p[name]?.[key] !== undefined)
                allGlobalProfile[m][name][key] = value
            })
          }
        } else if (self.notebookProfile?.[name]?.[key] !== undefined) {
          self.notebookProfile[name][key] = value
          if (self.notebookProfile.addon.profile[0] === 4) {
            Object.entries(allNotebookProfile).forEach(([m, p]) => {
              if (p[name]?.[key] !== undefined)
                allNotebookProfile[m][name][key] = value
            })
          }
        } else {
          self.docProfile[name][key] = value
          if (self.notebookProfile.addon.profile[0] === 4) {
            Object.entries(allDocProfile).forEach(([m, p]) => {
              if (p[name]?.[key] !== undefined)
                allDocProfile[m][name][key] = value
            })
          }
        }
      }
    }
    const timeout = 3
    if (self.backupWaitTimes === undefined) {
      // console.log("新计时器")
      self.backupWaitTimes = 0
      let i = timeout
      while (i) {
        if (self.backupWaitTimes) {
          i = self.backupWaitTimes
          self.backupWaitTimes = 0
        } else i--
        // console.log(i)
        await delay(1)
      }
      self.backupWaitTimes = undefined
      // console.log("计时结束")
      self.docmd5 &&
        self.notebookid &&
        writeProfile({
          range: Range.All,
          docmd5: self.docmd5,
          notebookid: self.notebookid
        })
      const { backupID, autoBackup } = self.globalProfile.addon
      if (backupID && autoBackup) {
        console.log("Auto backup to card", "profile")
        const node = MN.db.getNoteById(
          backupID.replace("marginnote3app://note/", "")
        )
        node && writeProfile2Card(node)
      }
    } else {
      // console.log("被打断")
      self.backupWaitTimes = timeout
    }
  } catch (err) {
    console.error(String(err))
  }
}

async function writeProfile2Card(node: MbBookNote, full = true) {
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
          allDocProfileTemp: allDocProfile,
          allGlobalProfileTemp: allGlobalProfile,
          allNotebookProfileTemp: allNotebookProfile
        }
      })
    )
  } else {
    const index = await selectIndex(
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
            allDocProfileTemp: allDocProfile,
            allGlobalProfileTemp: allGlobalProfile,
            allNotebookProfileTemp: allNotebookProfile
          }
        case ManageProfileItems.Global1:
        case ManageProfileItems.Global2:
        case ManageProfileItems.Global3:
        case ManageProfileItems.Global4:
        case ManageProfileItems.Global5: {
          const items = [lang.all_modules, ...moduleNameList.name]
          const i = await selectIndex(
            items,
            lang.profile_management,
            lang.which_module_profile_write
          )
          module = items[i]
          if (i === 0) {
            return {
              allGlobalProfileTemp: {
                [index - 1]: allGlobalProfile[index - 1]
              }
            }
          } else {
            return {
              allGlobalProfileTemp: {
                [index - 1]: {
                  [moduleNameList.key[i - 1]]:
                    allGlobalProfile[index - 1][moduleNameList.key[i - 1]]
                }
              }
            }
          }
        }
        case ManageProfileItems.AllGlobal:
          return {
            allGlobalProfileTemp: allGlobalProfile
          }
        case ManageProfileItems.Doc:
          return {
            allDocProfileTemp: allDocProfile
          }
        default:
          return {
            allNotebookProfileTemp: allNotebookProfile
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

async function readProfilefromCard(node: MbBookNote) {
  try {
    if (!node.childNotes?.length) throw lang.no_children
    async function getGlobalPath(p: any, n?: number) {
      const ks = moduleNameList.key
      const pks = Object.keys(p)
      if (pks.length === 1) {
        const index = await selectIndex(
          lang.$global_profile_items5,
          lang.profile_management,
          lang.one_module_global(
            n!,
            moduleNameList.name[moduleNameList.key.indexOf(pks[0])]
          ),
          true
        )
        if (index === -1) return
        return {
          index,
          profile: {
            ...allGlobalProfile[index],
            ...p
          }
        }
      } else {
        const j = await selectIndex(
          [
            lang.all_modules,
            ...ks.reduce((acc, k, i) => {
              if (pks.includes(k)) acc.push(moduleNameList.name[i])
              return acc
            }, [] as string[])
          ],
          lang.profile_management,
          lang.detecte_global_profile(n)
        )
        const index = await selectIndex(
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
              ? p
              : {
                  ...allGlobalProfile[index],
                  [ks[j - 1]]: p[ks[j - 1]]
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
    const { key, version, profiles } = data
    if (key === undefined) throw lang.old_version
    if (key !== Addon.key) throw lang.not_this_profile
    const profileKeys = Object.keys(profiles)
    if (profileKeys.length === 3) {
      const {
        allDocProfileTemp,
        allGlobalProfileTemp,
        allNotebookProfileTemp
      }: {
        allDocProfileTemp: typeof allDocProfile
        allGlobalProfileTemp: typeof allGlobalProfile
        allNotebookProfileTemp: typeof allNotebookProfile
      } = profiles
      const profileIndex = await selectIndex(
        lang.$profile_select_items9,
        lang.profile_management,
        lang.detecte_all_profile,
        true
      )
      if (profileIndex === -1) return
      switch (profileIndex) {
        case ManageProfileItems.All:
          allGlobalProfile = allGlobalProfileTemp
          allDocProfile = allDocProfileTemp
          allNotebookProfile = allNotebookProfileTemp
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
            allGlobalProfile[res.index] = res.profile
          } else return
          break
        }
        case ManageProfileItems.AllGlobal:
          allGlobalProfile = allGlobalProfileTemp
          break
        case ManageProfileItems.Doc:
          allDocProfile = allDocProfileTemp
          break
        case ManageProfileItems.Notebook:
          allNotebookProfile = allNotebookProfileTemp
          break
      }
    } else if (profileKeys.length === 1) {
      const profileKey = profileKeys[0]
      if (profileKey === "allDocProfileTemp") {
        if (await confirm(lang.profile_management, lang.detecte_doc_profile))
          allDocProfile = profiles[profileKey]
        else return
      } else if (profileKey === "allGlobalProfileTemp") {
        const globalProfile = profiles[profileKey]
        // 所有全局配置
        if (Array.isArray(globalProfile)) {
          const i = await selectIndex(
            [lang.range.all_global_profile, ...lang.$global_profile_items5],
            lang.profile_management,
            lang.detecte_all_notebook_profile,
            true
          )
          if (i === -1) return
          else if (i === 0) allGlobalProfile = globalProfile
          else {
            const res = await getGlobalPath(globalProfile[i - 1])
            if (res) {
              allGlobalProfile[res.index] = res.profile
            } else return
          }
        }
        // 单一全局配置
        else {
          const num = Object.keys(globalProfile)[0]
          const res = await getGlobalPath(globalProfile[0], Number(num) + 1)
          if (res) {
            allGlobalProfile[res.index] = res.profile
          } else return
        }
      } else if (profileKey === "allNotebookProfileTemp") {
        if (
          await confirm(lang.profile_management, lang.detecte_notebook_profile)
        )
          allNotebookProfile = profiles[profileKey]
        else return
      }
    } else throw ""
    setLocalDataByKey(allNotebookProfile, notebookProfileKey)
    setLocalDataByKey(allGlobalProfile, globalProfileKey)
    setLocalDataByKey(allDocProfile, docProfileKey)
    readProfile({
      range: Range.All,
      docmd5: self.docmd5!,
      notebookid: self.notebookid
    })
    layoutViewController()
    showHUD(lang.success)
  } catch (err) {
    console.error(err)
    showHUD(`${lang.fail}：${err}`)
  }
}

export async function manageProfileAction(node: MbBookNote, option: number) {
  // Write
  switch (option) {
    case 0:
      readProfilefromCard(node)
      break
    case 1:
      if (!node.childNotes?.length) showHUD(lang.no_children)
      else {
        writeProfile({
          range: Range.All,
          docmd5: self.docmd5!,
          notebookid: self.notebookid
        })
        writeProfile2Card(node, false)
      }
      break
    case 2:
      removeProfile()
      readProfile({
        range: Range.All,
        docmd5: self.docmd5!,
        notebookid: self.notebookid
      })
      showHUD(lang.profile_reset)
      break
  }
}
