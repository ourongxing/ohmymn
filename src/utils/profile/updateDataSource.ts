import { MN } from "const"
import { layoutViewController } from "jsExtension/switchPanel"
import { IProfile, IDocProfile } from "profile"
import { dataSourceIndex } from "dataSource"
import { IRowInlineInput, IRowInput, IRowSelect, IRowSwitch } from "typings"
import { ReplaceParam, string2RegArray, string2ReplaceParam } from "utils/input"
import { deepCopy } from "utils"

export const getMNLinkValue = (val: string) => {
  const noteid = val.replace("marginnote3app://note/", "")
  if (noteid != val) {
    const node = MN.db.getNoteById(noteid)
    if (node && node.childNotes?.length) {
      const x = node.childNotes.reduce((acc, cur) => {
        const firstComment = cur.comments[0]
        if (
          cur.colorIndex !== 13 &&
          firstComment.type === "TextNote" &&
          firstComment.text
        )
          return [...acc, firstComment.text]
        return acc
      }, [] as string[])
      if (x.length) return x.join(";")
    } else return undefined
  }
  return val
}

export const updateProfileTemp = (key: string, val: string) => {
  const newValue = getMNLinkValue(val)
  if (key in self.profileTemp.regArray) {
    let tmp: RegExp[][] | undefined
    // 避免修改后错误没有修改，下次读取配置出现问题
    try {
      tmp = newValue ? string2RegArray(newValue) : undefined
    } catch {
      tmp = undefined
    }
    self.profileTemp.regArray[key] = tmp
  } else if (key in self.profileTemp.replaceParam) {
    let tmp: ReplaceParam[] | undefined
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
      for (const [key, val] of Object.entries(_)) {
        if (!dataSourceIndex?.[name]?.[key]) continue
        const [section, row] = dataSourceIndex[name][key]
        const newValue = profileSaved?.[name]?.[key] ?? val
        switch (typeof newValue) {
          case "boolean":
            ;(self.dataSource[section].rows[row] as IRowSwitch).status =
              newValue
            _[key] = newValue
            break
          case "string":
            ;(
              self.dataSource[section].rows[row] as IRowInlineInput | IRowInput
            ).content = newValue
            _[key] = newValue
            updateProfileTemp(key, newValue)
            break
          default:
            if (Array.isArray(newValue)) {
              // number[]
              ;(self.dataSource[section].rows[row] as IRowSelect).selections = [
                ...newValue
              ]
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
