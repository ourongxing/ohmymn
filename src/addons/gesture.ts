import { dataSource } from "synthesizer"
import { cellViewType, IConfig } from "types/Addon"
import { UIView, UISwipeGestureRecognizerDirection } from "types/UIKit"
import { log } from "utils/common"

const option: string[] = []

const config: IConfig = {
  name: "Gesture",
  intro: "自定义手势触发动作",
  settings: [
    {
      label: "单选工具栏 ↑",
      key: "singleBarSwipeUp",
      type: cellViewType.select,
      option
    },
    {
      label: "单选工具栏 ↓",
      key: "singleBarSwipeDown",
      type: cellViewType.select,
      option
    },
    {
      label: "单选工具栏 ←",
      key: "singleBarSwipeLeft",
      type: cellViewType.select,
      option
    },
    {
      label: "单选工具栏 →",
      key: "singleBarSwipeRight",
      type: cellViewType.select,
      option
    },
    {
      label: "多选工具栏 ↑",
      key: "muiltBarSwipeUp",
      type: cellViewType.select,
      option
    },
    {
      label: "多选工具栏 ↓",
      key: "muiltBarSwipeDown",
      type: cellViewType.select,
      option
    },
    {
      label: "多选工具栏 ←",
      key: "muiltBarSwipeLeft",
      type: cellViewType.select,
      option
    },
    {
      label: "多选工具栏 →",
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
const action = {}
export { config, util, action }
