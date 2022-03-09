import lang from "lang"
import { cellViewType, IConfig } from "types/Addon"
import { UIView, UISwipeGestureRecognizerDirection } from "types/UIKit"

const option: string[] = []

const { link, intro, singleBar, muiltBar } = lang.module.gesture
const config: IConfig = {
  name: "Gesture",
  intro,
  link,
  settings: [
    {
      label: singleBar + " ↑",
      key: "singleBarSwipeUp",
      type: cellViewType.select,
      option
    },
    {
      label: singleBar + " ↓",
      key: "singleBarSwipeDown",
      type: cellViewType.select,
      option
    },
    {
      label: singleBar + " ←",
      key: "singleBarSwipeLeft",
      type: cellViewType.select,
      option
    },
    {
      label: singleBar + " →",
      key: "singleBarSwipeRight",
      type: cellViewType.select,
      option
    },
    {
      label: muiltBar + " ↑",
      key: "muiltBarSwipeUp",
      type: cellViewType.select,
      option
    },
    {
      label: muiltBar + " ↓",
      key: "muiltBarSwipeDown",
      type: cellViewType.select,
      option
    },
    {
      label: muiltBar + " ←",
      key: "muiltBarSwipeLeft",
      type: cellViewType.select,
      option
    },
    {
      label: muiltBar + " →",
      key: "muiltBarSwipeRight",
      type: cellViewType.select,
      option
    }
  ],
  actions: []
}

const util = {
  initGesture: {
    swipe(
      touchNumber: number,
      direction: UISwipeGestureRecognizerDirection,
      action: string
    ) {
      const swipe = new UISwipeGestureRecognizer(self, `on${action}:`)
      swipe.numberOfTouchesRequired = touchNumber
      swipe.direction = direction
      return swipe
    },
    tap(touchNumber: number, tapNumber: number, action: string) {
      const tap = new UITapGestureRecognizer(self, `on${action}:`)
      tap.numberOfTapsRequired = tapNumber
      tap.numberOfTouchesRequired = touchNumber
      return tap
    }
  },
  gestureHandlerController(
    handlerList: {
      view: () => UIView
      gesture: () => UIGestureRecognizer
    }[]
  ): {
    add: () => void
    remove: () => void
  } {
    const add = () => {
      handlerList.forEach(v => {
        v.view().addGestureRecognizer(v.gesture())
      })
    }
    const remove = () => {
      handlerList.forEach(v => {
        v.view().removeGestureRecognizer(v.gesture())
      })
    }
    return { add, remove }
  }
}

export { config, util }
