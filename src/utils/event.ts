const eventHandlerController = (
  handlerList: {
    event: string
    handler?: string
  }[]
): {
  add: () => void
  remove: () => void
} => {
  const add = () => {
    handlerList.forEach(v => {
      NSNotificationCenter.defaultCenter().addObserverSelectorName(
        self,
        v.handler ? `${v.handler}:` : `on${v.event}:`,
        v.event
      )
    })
  }
  const remove = () => {
    handlerList.forEach(v => {
      NSNotificationCenter.defaultCenter().removeObserverName(self, v.event)
    })
  }
  return { add, remove }
}

export default eventHandlerController
