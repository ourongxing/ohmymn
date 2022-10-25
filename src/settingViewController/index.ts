import settingView from "./settingView"
import handleUserAction from "./handleUserAction"
import lifecycle from "./lifecycle"
import { getObjCClassDeclar } from "marginnote"

export default JSB.defineClass(
  getObjCClassDeclar("SettingViewController", "UITableViewController"),
  {
    ...lifecycle,
    ...settingView,
    ...handleUserAction
  }
)
