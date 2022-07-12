import { Addon, MN } from "~/const"
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
import { showHUD } from "../common"
import { undoGroupingWithRefresh } from "../note"
import { selectIndex } from "../popup"
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
    console.log("write current doc profile", "profile")
  }
  const writeGlobalProfile = (profileNO: number) => {
    allGlobalProfile[profileNO] = deepCopy(self.globalProfile)
    setDataByKey(allGlobalProfile, globalProfileKey)
    console.log("write global profile", "profile")
  }
  const writeNotebookProfile = (notebookid: string) => {
    allNotebookProfile[notebookid] = deepCopy(self.notebookProfile)
    setDataByKey(allNotebookProfile, notebookProfileKey)
    console.log("write notebook profile", "profile")
  }
  switch (range) {
    case Range.All: {
      writeNotebookProfile(notebookid)
      writeDocProfile(docmd5)
      writeGlobalProfile(self.notebookProfile.addon.profile[0])
      const { backupID } = self.globalProfile.additional
      const { autoBackup } = self.globalProfile.addon
      if (backupID && autoBackup) {
        const node = MN.db.getNoteById(backupID)
        if (node) writeProfile2Card(node)
        else self.globalProfile.additional.backupID = ""
      }
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

export const saveProfile = (name: string, key: string, value: any) => {
  try {
    switch (key) {
      case "quickSwitch":
        self.globalProfile.addon.quickSwitch = value
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
  } catch (err) {
    console.error(String(err))
  }
}

export const removeProfile = () => {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(globalProfileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(docProfileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(notebookProfileKey)
  self.docmd5 = undefined
}

const writeProfile2Card = (node: MbBookNote) => {
  undoGroupingWithRefresh(() => {
    node.excerptText = `${lang.profile_manage.prohibit}\nversion: ${
      Addon.version
    }\n${dateFormat(new Date())}`
    node.noteTitle = `OhMyMN 配置`
    const { childNotes } = node
    if (!childNotes?.length) return
    const data = encode(
      JSON.stringify({
        allDocProfileTemp: allDocProfile,
        allGlobalProfileTemp: allGlobalProfile,
        allNotebookProfileTemp: allNotebookProfile
      })
    )
    const dataLen = data.length
    const step = Math.round(dataLen / childNotes.length)
    for (let i = 0, j = 0; i < dataLen; i += step, j++) {
      childNotes[j].excerptText = data.slice(i, i + step)
      childNotes[j].noteTitle = String(j)
    }
  })
}

export const manageProfileAction = async (node: MbBookNote, option: number) => {
  // Write
  if (option === 1) {
    if (!node.childNotes?.length) showHUD(lang.profile_manage.children)
    else {
      const { autoBackup } = self.globalProfile.addon
      self.globalProfile.additional.backupID = node.noteId!
      writeProfile({
        range: Range.All,
        docmd5: self.docmd5!,
        notebookid: self.notebookid
      })
      !autoBackup && writeProfile2Card(node)
    }
    // Read
  } else {
    try {
      if (node.childNotes?.length) {
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

        const {
          allDocProfileTemp,
          allGlobalProfileTemp,
          allNotebookProfileTemp
        }: {
          allDocProfileTemp: typeof allDocProfile
          allGlobalProfileTemp: typeof allGlobalProfile
          allNotebookProfileTemp: typeof allNotebookProfile
        } = JSON.parse(decode(text))
        if (
          allDocProfileTemp &&
          allGlobalProfileTemp &&
          allNotebookProfileTemp
        ) {
          const index = await selectIndex(
            lang.profile_manage.select.array,
            Addon.title,
            lang.profile_manage.select.message
          )
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
              allGlobalProfile[index - 1] = allGlobalProfileTemp[index - 1]
              break
          }
          setDataByKey(allNotebookProfile, notebookProfileKey)
          setDataByKey(allGlobalProfile, globalProfileKey)
          setDataByKey(allDocProfile, docProfileKey)
          readProfile({
            range: Range.All,
            docmd5: self.docmd5!,
            notebookid: self.notebookid
          })
          layoutViewController()
          showHUD(lang.profile_manage.success)
        } else throw ""
      } else throw ""
    } catch (err) {
      console.error(err)
      showHUD(lang.profile_manage.fail)
    }
  }
}
