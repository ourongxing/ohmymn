import { UIView, UISwipeGestureRecognizerDirection } from "types/UIKit"

export const initGesture = {
  swipe(
    touchNumber: number,
    direction: UISwipeGestureRecognizerDirection,
    action: string
  ) {
    const swipe = new UISwipeGestureRecognizer(self, `on${action}:`)
    swipe.numberOfTouchesRequired = touchNumber
    swipe.direction = direction
    return swipe
  }
}

export const gestureHandlerController = (
  handlerList: {
    view: () => UIView
    handler: () => UIGestureRecognizer
  }[]
): {
  add: () => void
  remove: () => void
} => {
  const add = () => {
    handlerList.forEach(v => {
      v.view().addGestureRecognizer(v.handler())
    })
  }
  const remove = () => {
    handlerList.forEach(v => {
      v.view().removeGestureRecognizer(v.handler())
    })
  }
  return { add, remove }
}
