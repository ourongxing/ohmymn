import { dataSourceIndex } from "~/dataSource"
import { layoutViewController } from "~/JSExtension/switchPanel"
import type { IGlobalProfile, IDocProfile, INotebookProfile } from "~/profile"
import type {
  IRowSwitch,
  IRowInlineInput,
  IRowInput,
  IRowSelect
} from "~/typings"
import { deepCopy } from "~/utils"

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
