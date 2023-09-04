import { getObjCClassDeclar } from "marginnote"
import { Addon } from "~/addon"
import handleGestureEvent from "./handleGestureEvent"
import handleReceivedEvent from "./handleReceivedEvent"
import lifecycle from "./lifecycle"
import switchPanel from "./switchPanel"
import { onCloseButtonClick } from "./overlayView"
import { onToolbarButtonClick } from "~/modules/toolbar/utils"

export default JSB.defineClass(
  getObjCClassDeclar(Addon.title, "JSExtension"),
  {
    ...{
      onCloseButtonClick,
      onToolbarButtonClick
    },
    ...lifecycle.instanceMethods,
    ...switchPanel,
    ...handleGestureEvent,
    ...handleReceivedEvent
  },
  lifecycle.classMethods
)
