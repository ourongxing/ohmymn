import { getObjCClassDeclar } from "marginnote"
import handleUserAction from "./handleUserAction"
import lifecycle from "./life-cycle"
import settingView from "./settingView"

export default JSB.defineClass(
  getObjCClassDeclar("SettingViewController", "UITableViewController"),
  {
    ...lifecycle,
    ...settingView,
    ...handleUserAction
  }
)
