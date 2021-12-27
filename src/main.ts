import handleReceivedEvent from "jsExtension/handleReceivedEvent"
import switchPanel from "jsExtension/switchPanel"
import { getObjCClassDeclar } from "utils/common"
import lifeCycle, { clsMethons } from "jsExtension/lifeCycle"
import { MN } from "utils/const"

const inst: InstMembers = {
  ...lifeCycle,
  ...switchPanel,
  ...handleReceivedEvent
}

const cls: ClsMembers = clsMethons

JSB.newAddon = (mainPath): WrapperObj<any> => {
  MN.mainPath = mainPath
  return JSB.defineClass(getObjCClassDeclar("OhMyMN", "JSExtension"), inst, cls)
}
