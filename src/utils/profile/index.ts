import { Addon, MN } from "@/const"
import { layoutViewController } from "@/jsExtension/switchPanel"
import lang from "@/lang"
import {
  IGlobalProfile,
  IDocProfile,
  docProfilePreset,
  globalProfilePreset
} from "@/profile"
import { MbBookNote } from "@/typings"
import { deepCopy } from ".."
import { showHUD } from "../common"
import Base64 from "../third party/base64"
import { updateProfileDataSource } from "./updateDataSource"
import { checkNewVerProfile } from "./utils"
export * from "./utils"
export * from "./updateDataSource"

let allProfile: IGlobalProfile[]
let allDocProfile: Record<string, IDocProfile>

const { profileKey, docProfileKey } = Addon

const getDataByKey = (key: string): any => {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

const setDataByKey = (
  data: IGlobalProfile[] | Record<string, IDocProfile>,
  key: string
) => {
  NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)
}

export const enum Range {
  First,
  Doc,
  Global
}

export const readProfile = (range: Range, docmd5 = self.docMD5 ?? "init") => {
  switch (range) {
    case Range.First:
      // Read local data only on first open, then read doc profile and global profile
      const docProfileSaved: {
        [k: string]: IDocProfile
      } = getDataByKey(docProfileKey)
      if (!docProfileSaved) console.log("Initialize doc profile", "profile")
      allDocProfile = docProfileSaved ?? { [docmd5]: docProfilePreset }
      const profileSaved: IGlobalProfile[] = getDataByKey(profileKey)
      if (!profileSaved) console.log("Initialize global profile", "profile")
      allProfile = profileSaved ?? Array(5).fill(globalProfilePreset)
      // Initialize all profile when new version release
      if (checkNewVerProfile(globalProfilePreset, allProfile[0])) {
        allProfile.forEach((_, index) => {
          const profile = deepCopy(globalProfilePreset)
          updateProfileDataSource(profile, allProfile[index])
          allProfile[index] = profile
        })
        setDataByKey(allProfile, profileKey)
      }
    // reuseCacheTitle()

    case Range.Doc: {
      updateProfileDataSource(
        self.docProfile,
        allDocProfile?.[docmd5] ?? docProfilePreset
      )
      console.log("Read currect doc profile", "profile")
    }
    case Range.Global: {
      updateProfileDataSource(
        self.globalProfile,
        allProfile[self.docProfile.addon.profile[0]],
        true
      )
    }
  }
  console.log("Read global profile", "profile")
}

/**
 *
 *  Saving the doc profile must save the global profile.
 *  Switching profile only save the global profile.
 *  Switching doc will be saved to the previous doc profile.
 *
 * @param docmd5
 * @param num  which profile
 */
export const writeProfile = (
  docmd5?: string,
  num = self.docProfile.addon.profile[0]
) => {
  allProfile[num] = deepCopy(self.globalProfile)
  setDataByKey(allProfile, profileKey)
  console.log("Save global profile", "profile")
  if (docmd5 != undefined) {
    allDocProfile[docmd5] = deepCopy(self.docProfile)
    setDataByKey(allDocProfile, docProfileKey)
    console.log("Save current doc profile", "profile")
  }
  const { backupID } = self.globalProfile.additional
  if (backupID) {
    const node = MN.db.getNoteById(backupID)
    if (node) {
      node.excerptText = Base64.encode(
        JSON.stringify({
          allProfileTemp: allProfile,
          allDocProfileTemp: allDocProfile
        })
      )
      node.noteTitle =
        lang.profile_manage.prohibit + new Date().toLocaleString()
    }
  }
}

export const saveProfile = (name: string, key: string, value: any) => {
  try {
    switch (key) {
      case "quickSwitch":
        self.globalProfile.addon.quickSwitch = value
        break
      case "pageOffset":
        self.docProfile.addon.pageOffset = value
        break
      default: {
        if (self.globalProfile?.[name]?.[key] === undefined) {
          self.docProfile[name][key] = value
          if (self.docProfile.addon.profile[0] === 4) {
            Object.entries(allDocProfile).forEach(([m, p]) => {
              if (p[name]?.[key] !== undefined)
                allDocProfile[m][name][key] = value
            })
          }
        } else {
          self.globalProfile[name][key] = value
          if (self.docProfile.addon.profile[0] === 4) {
            Object.entries(allProfile).forEach(([m, p]) => {
              if (p[name]?.[key] !== undefined) allProfile[m][name][key] = value
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
  NSUserDefaults.standardUserDefaults().removeObjectForKey(profileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(docProfileKey)
  readProfile(Range.First)
}

export const manageProfileAction = (node: MbBookNote, option: number) => {
  if (option) {
    writeProfile(self.docMD5)
    node.excerptText = Base64.encode(
      JSON.stringify({
        allProfileTemp: allProfile,
        allDocProfileTemp: allDocProfile
      })
    )
    node.noteTitle = lang.profile_manage.prohibit + new Date().toLocaleString()
    node.colorIndex = 11
  } else {
    const str = node.excerptText
    if (str) {
      try {
        const {
          allDocProfileTemp,
          allProfileTemp
        }: {
          allDocProfileTemp: typeof allDocProfile
          allProfileTemp: typeof allProfile
        } = JSON.parse(Base64.decode(str))
        setDataByKey(allProfileTemp, Addon.profileKey)
        setDataByKey(allDocProfileTemp, Addon.docProfileKey)
        readProfile(Range.First)
        layoutViewController()
        showHUD(lang.profile_manage.success)
      } catch {
        showHUD(lang.profile_manage.fail)
      }
    } else {
      showHUD(lang.profile_manage.not_find)
    }
  }
}
