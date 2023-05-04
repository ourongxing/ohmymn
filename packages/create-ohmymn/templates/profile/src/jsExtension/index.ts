import { getObjCClassDeclar } from "marginnote"
import { Addon } from "~/addon"
import handleReceivedEvent from "./handleReceivedEvent"
import lifecycle from "./lifecycle"
import switchPanel from "./switchPanel"

export default JSB.defineClass(
  getObjCClassDeclar(Addon.title, "JSExtension"),
  {
    ...lifecycle.instanceMethods,
    ...switchPanel,
    ...handleReceivedEvent
  },
  lifecycle.classMethods
)
