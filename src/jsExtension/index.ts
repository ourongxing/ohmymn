import { getObjCClassDeclar } from "marginnote"
import { Addon } from "~/addon"
import handleGestureEvent from "./handleGestureEvent"
import handleReceivedEvent from "./handleReceivedEvent"
import lifeCycle from "./lifeCycle"
import switchPanel from "./switchPanel"

export default JSB.defineClass(
  getObjCClassDeclar(Addon.title, "JSExtension"),
  {
    ...lifeCycle.instanceMethods,
    ...switchPanel,
    ...handleGestureEvent,
    ...handleReceivedEvent
  },
  lifeCycle.classMethods
)
