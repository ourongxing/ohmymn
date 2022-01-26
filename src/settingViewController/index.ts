import settingView from "./settingView"
import handleUserAction from "./handleUserAction"
import lifeCycle from "./lifeCycle"
const inst = {
  ...lifeCycle,
  ...settingView,
  ...handleUserAction
}

export default inst
