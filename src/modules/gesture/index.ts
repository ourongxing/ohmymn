import { cellViewType, UISwipeGestureRecognizerDirection } from "typings/enum"
import type { UIView, IConfig } from "typings"
import { lang } from "./lang"

const option: string[] = []

const { link, intro, singleBar, muiltBar, selectionBar } = lang
const configs: IConfig = {
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
    },
    {
      label: selectionBar + " ↑",
      key: "selectionBarSwipeUp",
      type: cellViewType.select,
      option
    },
    {
      label: selectionBar + " ↓",
      key: "selectionBarSwipeDown",
      type: cellViewType.select,
      option
    },
    {
      label: selectionBar + " ←",
      key: "selectionBarSwipeLeft",
      type: cellViewType.select,
      option
    },
    {
      label: selectionBar + " →",
      key: "selectionBarSwipeRight",
      type: cellViewType.select,
      option
    }
  ]
}

const utils = {
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

export { configs, utils }
