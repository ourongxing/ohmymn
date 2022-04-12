import { CellViewType, UISwipeGestureRecognizerDirection } from "typings/enum"
import type { UIView, IConfig, ISettingSelect } from "typings"
import { lang } from "./lang"

const { link, intro, singleBar, muiltBar, selectionBar } = lang
const configs: IConfig = {
  name: "Gesture",
  intro,
  link,
  settings: [
    [singleBar, "single"],
    [muiltBar, "muilt"],
    [selectionBar, "selection"]
  ]
    .map(q => {
      return [
        ["↑", "Up"],
        ["↓", "Down"],
        ["←", "Left"],
        ["→", "Right"]
      ].map(k => ({
        label: `${q[0]} ${k[0]}`,
        key: `${q[1]}BarSwipe${k[1]}`,
        type: CellViewType.Select,
        option: [] as string[]
      }))
    })
    .flat() as ISettingSelect<Record<string, string>>[]
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
      view: UIView
      gesture: UIGestureRecognizer
    }[]
  ): {
    add: () => void
    remove: () => void
  } {
    const add = () => {
      handlerList.forEach(v => {
        v.view.addGestureRecognizer(v.gesture)
      })
    }
    const remove = () => {
      handlerList.forEach(v => {
        v.view.removeGestureRecognizer(v.gesture)
      })
    }
    return { add, remove }
  }
}

const gesture = { configs, utils }
export default gesture
