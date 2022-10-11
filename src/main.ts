import handleReceivedEvent from "~/jsExtension/handleReceivedEvent"
import handleGestureEvent from "~/jsExtension/handleGestureEvent"
import switchPanel from "~/jsExtension/switchPanel"
import { getObjCClassDeclar } from "marginnote/sdk"
import lifeCycle, { clsMethons } from "~/jsExtension/lifeCycle"
import { Addon } from "~/addon"

JSB.newAddon = mainPath => {
  Addon.path = mainPath
  return JSB.defineClass(
    getObjCClassDeclar(Addon.title, "JSExtension"),
    {
      ...lifeCycle,
      ...switchPanel,
      ...handleGestureEvent,
      ...handleReceivedEvent
    },
    clsMethons
  )
}
