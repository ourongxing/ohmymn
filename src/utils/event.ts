import { Addon } from "const"
import { log } from "./common"

export const eventHandlerController = (
  handlerList: Array<
    | {
        event: string
        handler?: string
      }
    | string
  >
): {
  add: () => void
  remove: () => void
} => {
  const add = () => {
    handlerList.forEach(v => {
      v = typeof v == "string" ? { event: v } : v
      NSNotificationCenter.defaultCenter().addObserverSelectorName(
        self,
        v.handler
          ? `${v.handler}:`
          : v.event.includes(Addon.key)
          ? `on${v.event.replace(Addon.key, "")}:`
          : `on${v.event}:`,
        v.event
      )
    })
  }
  const remove = () => {
    handlerList.forEach(v => {
      NSNotificationCenter.defaultCenter().removeObserverName(
        self,
        typeof v == "string" ? v : v.event
      )
    })
  }
  return { add, remove }
}
