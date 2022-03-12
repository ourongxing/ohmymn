import { IProfile, IDocProfile, profilePreset, docProfilePreset } from "profile"
import { showHUD } from "utils/common"
import { Addon } from "const"
import { updateProfileDataSource } from "./updateDataSource"
import { MbBookNote } from "typings"
import Base64 from "utils/third party/base64"
import { layoutViewController } from "jsExtension/switchPanel"
import lang from "lang"
import { deepCopy } from "utils"
export * from "./updateDataSource"

let allProfile: IProfile[]
let allDocProfile: { [k: string]: IDocProfile }

const { profileKey, docProfileKey } = Addon

const getDataByKey = (key: string): any => {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

const setDataByKey = (
  data: IProfile[] | { [k: string]: IDocProfile },
  key: string
) => {
  NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)
}

export const enum Range {
  First,
  Doc,
  Global
}

const clearTitleCache = (_: typeof allDocProfile) => {
  try {
    Object.values(_).forEach(k => {
      // 超过一个月没打开过，就清除该数据
      let { additional } = k
      if (
        !additional ||
        (additional.lastExcerpt &&
          Date.now() - additional.lastExcerpt > 2629800000)
      )
        additional = {
          lastExcerpt: 0,
          cacheExcerptTitle: {}
        }
    })
  } catch (err) {
    console.error(String(err))
  }
}

const initNewVerProfile = () => {
  const checkNewVerProfile = (
    profile: IProfile | IDocProfile,
    profileSaved: any
  ) => {
    for (const [name, _] of Object.entries(profile)) {
      for (const [key, val] of Object.entries(_)) {
        if (profileSaved?.[name]?.[key] === undefined) return true
      }
    }
  }
  if (checkNewVerProfile(profilePreset, allProfile[0])) {
    allProfile.forEach((_, index) => {
      const profile = deepCopy(profilePreset)
      updateProfileDataSource(profile, allProfile[index])
      allProfile[index] = profile
    })
    setDataByKey(allProfile, profileKey)
  }
}

const readProfile = (range: Range, docmd5 = self.docMD5 ?? "init") => {
  let isFirst = false
  switch (range) {
    case Range.First:
      // 仅第一次打开才读取本地数据，然后先后读取文档配置和全局配置
      isFirst = true
      const docProfileSaved: {
        [k: string]: IDocProfile
      } = getDataByKey(docProfileKey)
      if (!docProfileSaved) console.log("初始化文档配置", "profile")
      allDocProfile = docProfileSaved ?? { [docmd5]: docProfilePreset }
      const profileSaved: IProfile[] = getDataByKey(profileKey)
      if (!profileSaved) console.log("初始化全局配置", "profile")
      allProfile = profileSaved ?? Array(5).fill(profilePreset)
      // 如果有新的配置信息，全部初始化
      initNewVerProfile()

    case Range.Doc: {
      // 打开文档时读文档配置，此时也必须读全局配置
      updateProfileDataSource(
        self.docProfile,
        allDocProfile?.[docmd5] ?? docProfilePreset
      )
      isFirst && clearTitleCache(allDocProfile)
      console.log("读取当前文档配置", "profile")
    }
    case Range.Global: {
      // 切换配置时只读全局配置，读全局配置不需要 md5
      updateProfileDataSource(
        self.profile,
        allProfile[self.docProfile.ohmymn.profile[0]],
        true
      )
    }
  }
  console.log("读取全局配置", "profile")
}

// 保存文档配置就必须保存全局配置，只有切换配置才只保存全局配置，切换配置是保存到上一个文档
// 传入 undefine 会使用默认参数
const saveProfile = (
  docmd5?: string,
  num = self.docProfile.ohmymn.profile[0]
) => {
  allProfile[num] = deepCopy(self.profile)
  setDataByKey(allProfile, profileKey)
  console.log("保存全局配置", "profile")

  if (docmd5 != undefined) {
    allDocProfile[docmd5] = deepCopy(self.docProfile)
    setDataByKey(allDocProfile, docProfileKey)
    console.log("保存当前文档配置", "profile")
  }
}

const removeProfile = () => {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(profileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(docProfileKey)
  readProfile(Range.First)
}

export { saveProfile, readProfile, removeProfile }

export const manageProfileAction = (params: {
  nodes: MbBookNote[]
  option: number
}) => {
  const { option, nodes } = params
  const node = nodes[0]
  if (option) {
    saveProfile(self.docMD5)
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
