import settingView from "./settingView"
import handleUserAction from "./handleUserAction"
import lifeCycle from "./lifeCycle"
export const settingViewControllerInst = {
  ...lifeCycle,
  ...settingView,
  ...handleUserAction
}
