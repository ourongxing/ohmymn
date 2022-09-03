import { MN, Addon } from "~/const"
import { layoutViewController } from "~/jsExtension/switchPanel"
import lang from "~/lang"
import {
  IGlobalProfile,
  IDocProfile,
  docProfilePreset,
  globalProfilePreset,
  INotebookProfile,
  notebookProfilePreset
} from "~/profile"
import { MbBookNote } from "~/typings"
import { dateFormat, deepCopy } from ".."
import {
  delay,
  showHUD,
  undoGroupingWithRefresh,
  confirm,
  selectIndex
} from "~/sdk"
import { decode, encode } from "../third party/base64"
import { ManageProfilePart, Range, ReadPrifile, WritePrifile } from "./typings"
import { refreshPanel, updateProfileDataSource } from "./updateDataSource"
import { checkNewVerProfile } from "./utils"
export * from "./utils"
export * from "./updateDataSource"

let allGlobalProfile: IGlobalProfile[]
let allDocProfile: Record<string, IDocProfile>
let allNotebookProfile: Record<string, INotebookProfile>

const { globalProfileKey, docProfileKey, notebookProfileKey } = Addon

const getDataByKey = (key: string): any => {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

const setDataByKey = (
  data:
    | typeof allGlobalProfile
    | typeof allNotebookProfile
    | typeof allDocProfile,
  key: string
) => {
  NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)
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
          getDataByKey(docProfileKey)
        if (!docProfileSaved) console.log("Initialize doc profile", "profile")
        allDocProfile = docProfileSaved ?? { [docmd5]: docProfilePreset }

        const notebookProfileSaved: Record<string, INotebookProfile> =
          getDataByKey(notebookProfileKey)
        if (!notebookProfileKey)
          console.log("Initialize notebook profile", "profile")
        allNotebookProfile = notebookProfileSaved ?? {
          [notebookid]: notebookProfilePreset
        }

        const globalProfileSaved: IGlobalProfile[] =
          getDataByKey(globalProfileKey)
        if (!globalProfileSaved)
          console.log("Initialize global profile", "profile")
        allGlobalProfile =
          globalProfileSaved ?? Array(5).fill(globalProfilePreset)

        // Initialize all profile when new version release
        if (checkNewVerProfile(globalProfilePreset, allGlobalProfile[0])) {
          allGlobalProfile.forEach((_, index) => {
            const globalProfile = deepCopy(globalProfilePreset)
            updateProfileDataSource(globalProfile, allGlobalProfile[index])
            allGlobalProfile[index] = globalProfile
          })
          setDataByKey(allGlobalProfile, globalProfileKey)
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
    setDataByKey(allDocProfile, docProfileKey)
    console.log("Write current doc profile", "profile")
  }
  const writeGlobalProfile = (profileNO: number) => {
    allGlobalProfile[profileNO] = deepCopy(self.globalProfile)
    setDataByKey(allGlobalProfile, globalProfileKey)
    console.log("Write global profile", "profile")
  }
  const writeNotebookProfile = (notebookid: string) => {
    allNotebookProfile[notebookid] = deepCopy(self.notebookProfile)
    setDataByKey(allNotebookProfile, notebookProfileKey)
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
    const timeout = 5
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

export function removeProfile() {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(globalProfileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(docProfileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(notebookProfileKey)
  self.docmd5 = undefined
}

async function writeProfile2Card(node: MbBookNote, full = true) {
  const { childNotes } = node
  if (!childNotes?.length) return
  let data: string
  if (full) {
    data = encode(
      JSON.stringify({
        allDocProfileTemp: allDocProfile,
        allGlobalProfileTemp: allGlobalProfile,
        allNotebookProfileTemp: allNotebookProfile
      })
    )
    node.noteTitle = `OhMyMN（所有配置）`
  } else {
    const index = await selectIndex(
      lang.profile_manage.select.array,
      `${Addon.title} 配置管理`,
      "想要写入哪部分的配置?",
      true
    )
    if (index === -1) return
    // "所有配置", "全局配置 1", "全局配置 2", "全局配置 3", "全局配置 4", "全局配置 5", "所有全局配置", "文档配置", "笔记本配置"
    node.noteTitle = `OhMyMN（${lang.profile_manage.select.array[index]}）`
    data = encode(
      JSON.stringify(
        (() => {
          switch (index) {
            case 0:
              return {
                allDocProfileTemp: allDocProfile,
                allGlobalProfileTemp: allGlobalProfile,
                allNotebookProfileTemp: allNotebookProfile
              }
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
              return {
                allGlobalProfileTemp: {
                  [index - 1]: allGlobalProfile[index - 1]
                }
              }
            case 6:
              return {
                allGlobalProfileTemp: allGlobalProfile
              }
            case 7:
              return {
                allDocProfileTemp: allDocProfile
              }
            default:
              return {
                allNotebookProfileTemp: allNotebookProfile
              }
          }
        })()
      )
    )
  }

  const dataLen = data.length
  const step = Math.ceil(dataLen / childNotes.length)
  undoGroupingWithRefresh(() => {
    node.excerptText = `${lang.profile_manage.prohibit}\nversion: ${
      Addon.version
    }\n${dateFormat(new Date())}`
    for (let i = 0, j = 0; i < dataLen; i += step, j++) {
      childNotes[j].excerptText = data.slice(i, i + step)
      childNotes[j].noteTitle = String(j + 1)
    }
  })
}

export async function manageProfileAction(node: MbBookNote, option: number) {
  // Write
  if (option === 1) {
    if (!node.childNotes?.length) showHUD(lang.profile_manage.children)
    else {
      writeProfile({
        range: Range.All,
        docmd5: self.docmd5!,
        notebookid: self.notebookid
      })
      writeProfile2Card(node, false)
    }
    // Read
  } else {
    try {
      if (!node.childNotes?.length) throw ""
      const tmp = node.childNotes.map(k => ({
        text: k.excerptText,
        title: k.noteTitle
      }))

      const text = tmp
        .sort((a, b) => Number(a.title) - Number(b.title))
        .reduce((acc, cur) => {
          acc += cur.text
          return acc
        }, "")

      const data = JSON.parse(decode(text))
      const keys = Object.keys(data)
      if (keys.length === 3) {
        const {
          allDocProfileTemp,
          allGlobalProfileTemp,
          allNotebookProfileTemp
        }: {
          allDocProfileTemp: typeof allDocProfile
          allGlobalProfileTemp: typeof allGlobalProfile
          allNotebookProfileTemp: typeof allNotebookProfile
        } = data
        const index = await selectIndex(
          lang.profile_manage.select.array,
          `${Addon.title} 配置管理`,
          "检测到所有配置，读取后会覆盖当前配置。",
          true
        )
        if (index === -1) return
        switch (index) {
          case ManageProfilePart.All:
            allGlobalProfile = allGlobalProfileTemp
            allDocProfile = allDocProfileTemp
            allNotebookProfile = allNotebookProfileTemp
            break
          case ManageProfilePart.Doc:
            allDocProfile = allDocProfileTemp
            break
          case ManageProfilePart.Notebook:
            allNotebookProfile = allNotebookProfileTemp
            break
          case ManageProfilePart.Global1:
          case ManageProfilePart.Global2:
          case ManageProfilePart.Global3:
          case ManageProfilePart.Global4:
          case ManageProfilePart.Global5:
            const i = await selectIndex(
              ["1", "2", "3", "4", "5"].map(k => `全局配置 ${k}`),
              Addon.title + " 配置管理",
              "请选择写入到哪一套全局配置中？",
              true
            )
            if (i === -1) return
            allGlobalProfile[i] = allGlobalProfileTemp[index - 1]
            break
        }
      } else if (keys.length === 1) {
        const key = keys[0]
        if (key === "allDocProfileTemp") {
          if (
            await confirm(
              Addon.title + " 配置管理",
              "读取到文档配置，是否覆盖当前文档配置？"
            )
          )
            allDocProfile = data[key]
          else return
        } else if (key === "allGlobalProfileTemp") {
          // 所有全局配置
          if (data[key].length) {
            const index = await selectIndex(
              [
                "所有全局配置",
                ...["1", "2", "3", "4", "5"].map(k => `全局配置 ${k}`)
              ],
              `${Addon.title} 配置管理`,
              "检测到所有全局配置，读取后会覆盖当前配置。",
              true
            )
            if (index === -1) return
            else if (index === 0) allGlobalProfile = data[key]
            else {
              const i = await selectIndex(
                ["1", "2", "3", "4", "5"].map(k => `全局配置 ${k}`),
                Addon.title + " 配置管理",
                `请选择写入到哪一套全局配置中？`,
                true
              )
              if (i === -1) return
              allGlobalProfile[i] = data[key][index - 1]
            }
          }
          // 单一全局配置
          else {
            const num = Object.keys(data[key])[0]
            const index = await selectIndex(
              ["1", "2", "3", "4", "5"].map(k => `全局配置 ${k}`),
              Addon.title + " 配置管理",
              `读取到全局配置 ${
                ["1", "2", "3", "4", "5"][num]
              }，请选择写入到哪一套全局配置中？`,
              true
            )
            if (index === -1) return
            allGlobalProfile[index] = data[key][num]
          }
        } else if (key === "allNotebookProfileTemp") {
          if (
            await confirm(
              Addon.title + " 配置管理",
              "读取到笔记本配置，是否覆盖当前笔记本配置？"
            )
          )
            allNotebookProfile = data[key]
          else return
        }
      } else throw ""
      setDataByKey(allNotebookProfile, notebookProfileKey)
      setDataByKey(allGlobalProfile, globalProfileKey)
      setDataByKey(allDocProfile, docProfileKey)
      readProfile({
        range: Range.All,
        docmd5: self.docmd5!,
        notebookid: self.notebookid
      })
      layoutViewController()
      showHUD("读取成功")
    } catch (err) {
      console.error(err)
      showHUD(lang.profile_manage.fail)
    }
  }
}
