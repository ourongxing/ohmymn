import { dataSource, dataSourceIndex } from "synthesizer"
import { log, showHUD } from "utils/common"
import { profile } from "profile"
import type { IProfile } from "profile"

// 读配置包含两种情况
// 1.刚打开 MN 然后打开笔记本，读两个配置文件，然后合并
// 2.切换文档，只需要读取 doc 配置

const profileKey = "marginnote_ohmymn_profile"

const getDataByKey = (key: string): any =>
  NSUserDefaults.standardUserDefaults().objectForKey(key)
const setDataByKey = (data: IProfile, key: string) =>
  void NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)

export const updateDataSource = (profile: IProfile, profileSaved: any) => {
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
}

const readProfile = (docmd5?: string, readAll = false) => {
  // 读取全局配置
  if (readAll) {
    const profileSaved = getDataByKey(profileKey)
    updateDataSource(profile, profileSaved)
    log("读取全局配置", "profile")
  }
}

// 切换的时候仅保存当前文档的，退出的时候全部保存
const saveProfile = (docmd5?: string, saveAll = false) => {
  if (saveAll) {
    log("保存全部配置", "profile")
    setDataByKey(profile, profileKey)
  }
}

const removeProfile = () => {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(profileKey)
}

export { saveProfile, readProfile, removeProfile }
