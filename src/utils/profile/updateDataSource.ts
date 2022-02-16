// @ts-nocheck
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
  const newValue = getMNLinkValue(val)
  if (key in self.profileTemp.regArray) {
    let tmp: any
    // 避免修改后错误没有修改，下次读取配置出现问题
    try {
      tmp = newValue ? string2RegArray(newValue) : undefined
    } catch {
      tmp = undefined
    }
    self.profileTemp.regArray[key] = tmp
  }
  if (key in self.profileTemp.replaceParam) {
    let tmp: any
    try {
      tmp = newValue ? string2ReplaceParam(newValue) : undefined
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
    if (name === "additional") {
      for (const [key, val] of Object.entries(_)) {
        _[key] = deepCopy(profileSaved?.[name]?.[key] ?? val)
      }
    } else {
      for (let [key, val] of Object.entries(_)) {
        if (!dataSourceIndex?.[name]?.[key]) continue
        const [section, row] = dataSourceIndex[name][key]
        const newValue = profileSaved?.[name]?.[key] ?? val
        switch (typeof newValue) {
          case "boolean":
            self.dataSource[section].rows[row].status = newValue
            _[key] = newValue
            break
          case "string":
            self.dataSource[section].rows[row].content = newValue
            _[key] = newValue
            updateProfileTemp(key, newValue)
            break
          default:
            if (Array.isArray(newValue)) {
              // number[]
              self.dataSource[section].rows[row].selections = [...newValue]
              _[key] = [...newValue]
            }
        }
      }
    }
  }
  // 刷新控制面板
  if (refresh) {
    self.settingViewController.tableView?.reloadData()
    layoutViewController()
  }
}
