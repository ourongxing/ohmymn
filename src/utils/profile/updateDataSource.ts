// @ts-nocheck 有点黑魔法了，不过效果不错
import { MN } from "const"
import { layoutViewController } from "jsExtension/switchPanel"
import { IProfile, IDocProfile } from "profile"
import { dataSourceIndex } from "synthesizer"
import { deepCopy } from "utils"

import { string2RegArray, string2ReplaceParam } from "utils/input"

export const getMNLinkValue = (val: string) => {
  const noteid = val.replace("marginnote3app://note/", "")
  if (noteid != val) {
    const node = MN.db.getNoteById(noteid)
    return node && node.childNotes.length
      ? node.childNotes
          .filter(
            note =>
              note.colorIndex !== 13 && note.comments[0].type == "TextNote"
          )
          .map(note => note.comments[0].text.trim())
          .join("; ")
      : undefined
  }
  return val
}

export const updateProfileTemp = (key: string, val: string) => {
  val = getMNLinkValue(val)
  if (key in self.profileTemp.regArray) {
    let tmp: any
    // 避免修改后错误没有修改，下次读取配置出现问题
    try {
      tmp = val ? string2RegArray(val) : undefined
    } catch {
      tmp = undefined
    }
    self.profileTemp.regArray[key] = tmp
  }
  if (key in self.profileTemp.replaceParam) {
    let tmp: any
    try {
      tmp = val ? string2ReplaceParam(val) : undefined
    } catch {
      tmp = undefined
    }
    self.profileTemp.replaceParam[key] = tmp
  }
}

export const updateProfileDataSource = (
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
          self.dataSource[section].rows[row].status = val
          _[key] = val
          break
        case "string":
          self.dataSource[section].rows[row].content = val
          _[key] = val
          updateProfileTemp(key, val)
          break
        default:
          if (Array.isArray(val)) {
            // number[]
            self.dataSource[section].rows[row].selections = [...val]
            _[key] = [...val]
          } else _[key] = deepCopy(val)
      }
    }
  }
  // 刷新控制面板
  if (refresh) {
    self.settingViewController.tableView?.reloadData()
    layoutViewController()
  }
}
