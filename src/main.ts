import handleReceivedEvent from "jsExtension/handleReceivedEvent"
import switchPanel from "jsExtension/switchPanel"
import { getObjCClassDeclar } from "utils/common"
import lifeCycle, { clsMethons, deliverMainPath } from "jsExtension/lifeCycle"

const inst: InstMembers = {
  ...lifeCycle,
  ...switchPanel,
  ...handleReceivedEvent
}

const cls: ClsMembers = clsMethons

JSB.newAddon = (mainPath): WrapperObj<any> => {
  deliverMainPath(mainPath)
  return JSB.defineClass(getObjCClassDeclar("OhMyMN", "JSExtension"), inst, cls)
}
