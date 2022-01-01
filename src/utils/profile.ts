import { IProfile, IDocProfile, profilePreset, docProfilePreset } from "profile"
import { docProfile, profile } from "profile"
import { dataSource, dataSourceIndex } from "synthesizer"
import { log } from "utils/common"
import { MN } from "const"

// 读配置包含两种情况
// 1.刚打开 MN 然后打开笔记本，读两个配置文件，然后合并
// 2.切换文档，只需要读取 doc 配置

const profileKey = "marginnote_ohmymn_profile_global_v3"
const docProfileKey = "marginnote_ohmymn_profile_doc_v3"
let allProfile: IProfile[]
let allDocProfile: { [k: string]: IDocProfile }

const getDataByKey = (key: string): any =>
  NSUserDefaults.standardUserDefaults().objectForKey(key)
const setDataByKey = (
  data: IProfile[] | { [k: string]: IDocProfile },
  key: string
) => void NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)

export const updateDataSource = (
  profile: IProfile | IDocProfile,
  profileSaved: any,
  refresh = false
) => {
  // 更新 DateSouce 和 Profile
  for (const [name, _] of Object.entries(profile)) {
    for (let [key, val] of Object.entries(_)) {
      if (!dataSourceIndex?.[name]?.[key]) continue
      const [section, row] = dataSourceIndex[name][key]
      val = profileSaved?.[name]?.[key] ?? val
      switch (typeof val) {
        case "boolean":
          // @ts-ignore
          dataSource[section].rows[row].status = val
          // @ts-ignore
          _[key] = val
          break
        case "string":
          // @ts-ignore
          dataSource[section].rows[row].content = val
          // @ts-ignore
          _[key] = val
          break
        // number[]
        default:
          // @ts-ignore
          dataSource[section].rows[row].selections = [...val]
          // @ts-ignore
          _[key] = [...val]
      }
    }
  }
  // 刷新控制面板
  if (refresh) MN.settingViewController.tableView?.reloadData()
}

export const enum Range {
  first,
  doc,
  global
}

const readProfile = (docmd5: string, range: Range) => {
  const readDoc = () => {
    updateDataSource(docProfile, allDocProfile?.[docmd5] ?? docProfilePreset)
    log("读取当前文档配置", "profile")
  }
  const readGlobal = () => {
    updateDataSource(profile, allProfile[docProfile.ohmymn.profile[0]], true)
    log("读取全局配置", "profile")
  }

  switch (range) {
    case Range.first:
      // 仅第一次打开才读取本地数据，然后先后读取文档配置和全局配置
      const docProfileSaved: {
        [k: string]: IDocProfile
      } = getDataByKey(docProfileKey)
      if (!docProfileSaved) log("初始化文档配置", "profile")
      allDocProfile = docProfileSaved ?? { [docmd5]: docProfilePreset }
      const profileSaved: IProfile[] = getDataByKey(profileKey)
      if (!profileSaved) log("初始化全局配置", "profile")
      allProfile = profileSaved ?? Array(5).fill(profilePreset)
    case Range.doc:
      // 打开文档时读文档配置，此时也必须读全局配置
      readDoc()
    case Range.global:
      // 切换配置时只读全局配置，读全局配置不需要 md5
      readGlobal()
  }
}

// 保存文档配置就必须保存全局配置，只有切换配置才只保存全局配置，切换配置是保存到上一个文档
const saveProfile = (docmd5?: string, num = docProfile.ohmymn.profile[0]) => {
  const deepCopy = (value: any) => JSON.parse(JSON.stringify(value))
  if (num != undefined) {
    allProfile[num] = deepCopy(profile)
    setDataByKey(allProfile, profileKey)
    log("保存全局配置", "profile")
  }
  if (docmd5 != undefined) {
    // 这传的是引用，我靠，气死了，折腾好久
    // allDocProfile[docmd5] = docProfile
    allDocProfile[docmd5] = deepCopy(docProfile)
    setDataByKey(allDocProfile, docProfileKey)
    log("保存当前文档配置", "profile")
  }
}

const removeProfile = () => {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(profileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(docProfileKey)
}

export { saveProfile, readProfile, removeProfile }
