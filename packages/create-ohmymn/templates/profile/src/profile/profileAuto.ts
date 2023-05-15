import { delay, getLocalDataByKey, MN, setLocalDataByKey } from "marginnote"
import { Addon } from "~/addon"
import { deepCopy } from "~/utils"
import {
  defaultDocProfile,
  defaultGlobalProfile,
  defaultNotebookProfile
} from "./default"
import { writeProfile2Card } from "./profileAction"
import type {
  IDocProfile,
  IGlobalProfile,
  INotebookProfile,
  ReadPrifile,
  WritePrifile
} from "./typings"
import { Range, RewriteRange } from "./typings"
import { refreshPanel, updateProfileDataSource } from "./updateDataSource"
import { checkNewVerProfile, rewriteProfile } from "./utils"

export const readProfile: ReadPrifile = ({
  range,
  notebookid,
  docmd5,
  profileNO
}) => {
  try {
    const readGlobalProfile = (profileNO: number) => {
      updateProfileDataSource(
        self.globalProfile,
        self.allGlobalProfile[profileNO]
      )
      MN.log("Read current global profile", "profile")
    }

    const readNoteBookProfile = (notebookid: string) => {
      updateProfileDataSource(
        self.notebookProfile,
        self.allNotebookProfile?.[notebookid] ??
          self.allNotebookProfile?.["default"] ??
          defaultNotebookProfile
      )
      MN.log("Read currect notebook profile", "profile")
    }

    const readDocProfile = (docmd5: string) => {
      updateProfileDataSource(
        self.docProfile,
        self.allDocProfile?.[docmd5] ??
          self.allDocProfile?.["default"] ??
          defaultDocProfile
      )
      MN.log("Read currect doc profile", "profile")
    }

    switch (range) {
      case Range.All: {
        // Read local data only on first open
        const globalProfileLocal: IGlobalProfile[] | undefined =
          getLocalDataByKey(Addon.globalProfileKey)
        const docProfileLocal: Record<string, IDocProfile> | undefined =
          getLocalDataByKey(Addon.docProfileKey)
        const notebookProfileLocal:
          | Record<string, INotebookProfile>
          | undefined = getLocalDataByKey(Addon.notebookProfileKey)

        if (globalProfileLocal) {
          Addon.lastVersion = globalProfileLocal[0].additional.lastVision
          self.allGlobalProfile = rewriteProfile(
            RewriteRange.AllGlobal,
            globalProfileLocal
          )
          if (
            checkNewVerProfile(defaultGlobalProfile, self.allGlobalProfile[0])
          ) {
            self.allGlobalProfile.forEach((_, index) => {
              const globalProfile = deepCopy(defaultGlobalProfile)
              updateProfileDataSource(
                globalProfile,
                self.allGlobalProfile[index]
              )
              self.allGlobalProfile[index] = globalProfile
            })
            setLocalDataByKey(self.allGlobalProfile, Addon.globalProfileKey)
          }
        } else {
          MN.log("Initialize global profile", "profile")
          self.allGlobalProfile = Array(5).fill(deepCopy(defaultGlobalProfile))
        }

        if (docProfileLocal) {
          self.allDocProfile = rewriteProfile(RewriteRange.Doc, docProfileLocal)
          // Initialize all profile when new version release
        } else {
          MN.log("Initialize doc profile", "profile")
          self.allDocProfile = {
            [docmd5]: deepCopy(defaultDocProfile),
            default: deepCopy(defaultDocProfile)
          }
        }

        if (notebookProfileLocal) {
          self.allNotebookProfile = rewriteProfile(
            RewriteRange.Notebook,
            notebookProfileLocal
          )
        } else {
          MN.log("Initialize notebook profile", "profile")
          self.allNotebookProfile = {
            [notebookid]: deepCopy(defaultNotebookProfile),
            default: deepCopy(defaultNotebookProfile)
          }
        }

        // update version
        self.allGlobalProfile.forEach(k => {
          k.additional.lastVision = Addon.version
        })

        Addon.lastVersion = Addon.version
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
    MN.error(err)
  }
}

/**
 *  Saving the doc profile must save the global profile.
 *  Switching profile only save the global profile.
 *  Switching doc will be saved to the previous doc profile.
 */
export const writeProfile: WritePrifile = ({
  range,
  notebookid,
  docmd5,
  profileNO
}) => {
  const writeDocProfile = (docmd5: string) => {
    self.allDocProfile[docmd5] = deepCopy(self.docProfile)
    setLocalDataByKey(self.allDocProfile, Addon.docProfileKey)
    MN.log("Write current doc profile", "profile")
  }
  const writeGlobalProfile = (profileNO: number) => {
    self.allGlobalProfile[profileNO] = deepCopy(self.globalProfile)
    setLocalDataByKey(self.allGlobalProfile, Addon.globalProfileKey)
    MN.log("Write global profile", "profile")
  }
  const writeNotebookProfile = (notebookid: string) => {
    self.allNotebookProfile[notebookid] = deepCopy(self.notebookProfile)
    setLocalDataByKey(self.allNotebookProfile, Addon.notebookProfileKey)
    MN.log("Write notebook profile", "profile")
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
    if (!MN.currentDocmd5 || !MN.currnetNotebookId) return
    switch (key) {
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
            Object.entries(self.allGlobalProfile).forEach(([m, p]) => {
              if (p[name]?.[key] !== undefined)
                self.allGlobalProfile[m][name][key] = value
            })
          }
        } else if (self.notebookProfile?.[name]?.[key] !== undefined) {
          self.notebookProfile[name][key] = value
          if (self.notebookProfile.addon.profile[0] === 4) {
            if (!("default" in self.allNotebookProfile)) {
              self.allNotebookProfile["default"] = deepCopy(
                defaultNotebookProfile
              )
            }
            Object.entries(self.allNotebookProfile).forEach(([m, p]) => {
              if (p[name]?.[key] !== undefined)
                self.allNotebookProfile[m][name][key] = value
            })
          }
        } else {
          self.docProfile[name][key] = value
          if (self.notebookProfile.addon.profile[0] === 4) {
            if (!("default" in self.allDocProfile)) {
              self.allDocProfile["default"] = deepCopy(defaultDocProfile)
            }
            Object.entries(self.allDocProfile).forEach(([m, p]) => {
              if (p[name]?.[key] !== undefined)
                self.allDocProfile[m][name][key] = value
            })
          }
        }
      }
    }
    const timeout = 3
    if (self.backupWaitTimes === undefined) {
      MN.log("Save profile: start new timer", "profile")
      self.backupWaitTimes = 0
      let i = timeout
      while (i) {
        if (self.backupWaitTimes) {
          i = self.backupWaitTimes
          self.backupWaitTimes = 0
        } else i--
        MN.log(i, "profile")
        await delay(1)
      }
      self.backupWaitTimes = undefined
      MN.log("Save profile completed", "profile")
      writeProfile({
        range: Range.All,
        docmd5: MN.currentDocmd5,
        notebookid: MN.currnetNotebookId
      })
      const { backupID, autoBackup } = self.globalProfile.addon
      if (backupID && autoBackup) {
        MN.log("Auto backup to card", "profile")
        const node = MN.db.getNoteById(
          backupID.replace("marginnote3app://note/", "")
        )
        node && writeProfile2Card(node)
      }
    } else {
      self.backupWaitTimes = self.backupWaitTimes + 1
    }
  } catch (err) {
    MN.error(String(err))
  }
}
