import handleReceivedEvent from "jsExtension/handleReceivedEvent"
import switchPanel from "jsExtension/switchPanel"
import { getObjCClassDeclar, log } from "utils/common"
import { InstMethods, clsMethons, deliverMainPath } from "jsExtension/lifeCycle"

const inst: InstMembers = {
  ...InstMethods,
  ...switchPanel,
  ...handleReceivedEvent
}

const cls: ClsMembers = {
  ...clsMethons
}

JSB.newAddon = (mainPath): WrapperObj<any> => {
  deliverMainPath(mainPath)
  return JSB.defineClass(getObjCClassDeclar("OhMyMN", "JSExtension"), inst, cls)
}
