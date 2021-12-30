import { cellViewType, IConfig } from "types/Addon"
import { UIView, UISwipeGestureRecognizerDirection } from "types/UIKit"

const option = [
  "无",
  ...[
    "筛选卡片",
    "修改摘录样式",
    "修改摘录颜色",
    "补全单词词形",
    "序列摘录换行",
    "合并卡片内文字",
    "批量重命名标题",
    "切换摘录或标题",
    "优化排版和格式",
    "批量替换摘录文字",
    "提取卡片中的文字为标题"
  ].map((value, index) => "①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳"[index] + " " + value)
]
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
      handler: () => UIGestureRecognizer
    }[]
  ): {
    add: () => void
    remove: () => void
  } {
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
}
const action = {}
export { config, util, action }
