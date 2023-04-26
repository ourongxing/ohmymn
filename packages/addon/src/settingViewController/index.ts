import { getObjCClassDeclar } from "marginnote"
import handleUserAction from "./handleUserAction"
import lifecycle from "./lifecycle"
import settingView from "./settingView"

export default JSB.defineClass(
  getObjCClassDeclar("SettingViewController", "UITableViewController"),
  {
    ...lifecycle,
    ...settingView,
    ...handleUserAction
  }
)
