import handleReceivedEvent from "jsExtension/handleReceivedEvent"
import switchPanel from "jsExtension/switchPanel"
import { getObjCClassDeclar } from "utils/common"
import lifeCycle, { clsMethons } from "jsExtension/lifeCycle"
import { MN } from "utils/const"

const inst = {
  ...lifeCycle,
  ...switchPanel,
  ...handleReceivedEvent
}

const cls = clsMethons

JSB.newAddon = mainPath => {
  MN.mainPath = mainPath
  return JSB.defineClass(getObjCClassDeclar("OhMyMN", "JSExtension"), inst, cls)
}
