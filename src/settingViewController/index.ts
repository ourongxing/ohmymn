import settingView from "./settingView"
import handleUserAction from "./handleUserAction"
import lifeCycle from "./lifeCycle"
import { getObjCClassDeclar } from "marginnote"

export default JSB.defineClass(
  getObjCClassDeclar("SettingViewController", "UITableViewController"),
  {
    ...lifeCycle,
    ...settingView,
    ...handleUserAction
  }
)
