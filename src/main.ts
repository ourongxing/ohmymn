import { getObjCClassDeclar } from "marginnote"
import handleReceivedEvent from "~/jsExtension/handleReceivedEvent"
import handleGestureEvent from "~/jsExtension/handleGestureEvent"
import switchPanel from "~/jsExtension/switchPanel"
import lifeCycle from "~/jsExtension/lifeCycle"
import { Addon } from "~/addon"

JSB.newAddon = mainPath => {
  Addon.path = mainPath
  return JSB.defineClass(
    getObjCClassDeclar(Addon.title, "JSExtension"),
    {
      ...lifeCycle.instanceMethods,
      ...switchPanel,
      ...handleGestureEvent,
      ...handleReceivedEvent
    },
    lifeCycle.classMethods
  )
}
