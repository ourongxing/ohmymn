import { getObjCClassDeclar } from "marginnote"
import { Addon } from "~/addon"
import handleGestureEvent from "./handleGestureEvent"
import handleReceivedEvent from "./handleReceivedEvent"
import lifecycle from "./lifecycle"
import switchPanel from "./switchPanel"

export default JSB.defineClass(
  getObjCClassDeclar(Addon.title, "JSExtension"),
  {
    ...lifecycle.instanceMethods,
    ...switchPanel,
    ...handleGestureEvent,
    ...handleReceivedEvent
  },
  lifecycle.classMethods
)
