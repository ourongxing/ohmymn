import { dataSourceIndex } from "~/dataSource"
import { layoutViewController } from "~/jsExtension/switchPanel"
import type { IGlobalProfile, IDocProfile, INotebookProfile } from "~/profile"
import { customKey } from "~/profile"
import type {
  IRowSwitch,
  IRowInlineInput,
  IRowInput,
  IRowSelect
} from "~/typings"
import type { ReplaceParam } from "~/utils"
import { deepCopy, string2RegArray, string2ReplaceParam } from "~/utils"
import { getMNLinkValue } from "./utils"

export function updateProfileTemp(key: string, val: string) {
  const newValue = customKey.includes(key) ? getMNLinkValue(val) : val
  if (key in self.tempProfile.regArray) {
    let tmp: RegExp[][] | undefined
    // Avoid the error after modification is not corrected
    try {
      tmp = newValue ? string2RegArray(newValue) : undefined
    } catch {
      tmp = undefined
    }
    self.tempProfile.regArray[key] = tmp
  } else if (key in self.tempProfile.replaceParam) {
    let tmp: ReplaceParam[] | undefined
    try {
      tmp = newValue ? string2ReplaceParam(newValue) : undefined
    } catch {
      tmp = undefined
    }
    self.tempProfile.replaceParam[key] = tmp
  }
}

export function updateProfileDataSource(
  profile: IGlobalProfile | IDocProfile | INotebookProfile,
  profileLocal: any
) {
  // Update DateSouce and profile
  for (const [name, _] of Object.entries(profile)) {
    if (name === "additional") {
      for (const [key, val] of Object.entries(_)) {
        _[key] = deepCopy(profileLocal?.[name]?.[key] ?? val)
      }
    } else {
      for (const [key, val] of Object.entries(_)) {
        if (!dataSourceIndex?.[name]?.[key]) continue
        const [section, row] = dataSourceIndex[name][key]
        const newValue = profileLocal?.[name]?.[key] ?? val
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
}

export function refreshPanel() {
  self.settingViewController.tableView?.reloadData()
  layoutViewController()
  MN.log("Refresh Panel", "profile")
}
