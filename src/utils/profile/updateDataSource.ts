// @ts-nocheck 有点黑魔法了，不过效果不错
import { MN } from "const"
import { layoutViewController } from "jsExtension/switchPanel"
import { IProfile, IDocProfile, profileTemp } from "profile"
import { dataSource, dataSourceIndex } from "synthesizer"

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
      : ""
  }
  return val
}

export const updateProfileTemp = (key: string, val: string) => {
  val = getMNLinkValue(val)
  if (key in profileTemp.regArray) {
    profileTemp.regArray[key] = val ? string2RegArray(val) : undefined
  }
  if (key in profileTemp.replaceParam) {
    profileTemp.replaceParam[key] = val ? string2ReplaceParam(val) : undefined
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
          dataSource[section].rows[row].status = val
          _[key] = val
          break
        case "string":
          dataSource[section].rows[row].content = val
          _[key] = val
          updateProfileTemp(key, val)
          break
        default:
          // number[]
          dataSource[section].rows[row].selections = [...val]
          _[key] = [...val]
      }
    }
  }
  // 刷新控制面板
  if (refresh) {
    self.settingViewController.tableView?.reloadData()
    layoutViewController()
  }
}
