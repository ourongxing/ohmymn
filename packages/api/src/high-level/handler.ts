import type {
  UISwipeGestureRecognizerDirection,
  DocumentController,
  JSExtensionLifeCycle,
  MbBookNote
} from "src/low-level"

/**
 *  Define lifecycle handlers. The handlers will be called when the corresponding lifecycle is triggered.
 */
export function defineLifecycleHandlers(events: {
  instanceMethods?: Partial<JSExtensionLifeCycle.InstanceMethods>
  classMethods?: Partial<JSExtensionLifeCycle.ClassMethods>
}) {
  return events
}

/**
 * Add or remove event observer.
 * @example
 * const observer = eventObserverController([
 *   "PopupMenuOnNote",
 *   { event: "InputOverXxxxx", handler: "onInputOver" }
 * ])
 * observer.add() // when opens notebook
 * observer.remove() // when closes notebook
 */
export function eventObserverController(
  observers: ({ event: string; handler?: string } | string)[]
) {
  const add = () => {
    observers.forEach(v => {
      v = typeof v == "string" ? { event: v } : v
      const handler = v.handler ?? `on${v.event}`
      NSNotificationCenter.defaultCenter().addObserverSelectorName(
        self,
        `${handler}:`,
        v.event
      )
    })
  }
  const remove = () => {
    observers.forEach(v => {
      NSNotificationCenter.defaultCenter().removeObserverName(
        self,
        typeof v == "string" ? v : v.event
      )
    })
  }
  return { add, remove }
}

/**
 * Define event handlers. The handlers will be called when the corresponding event is triggered.
 */
export function defineEventHandlers<K extends string>(h: {
  [M in K extends `on${string}` ? K : `on${K}`]: (sender: {
    userInfo: UserInfo<M>
  }) => void
}) {
  return h
}

/**
 * The direction of the selection.
 */
export const enum DirectionOfSelection {
  toRight = 1,
  toLeft = 2
}

/**
 * The type of `sender.userInfo` in event handler.
 */
export type UserInfo<K> = K extends
  | "onPopupMenuOnSelection"
  | "onClosePopupMenuOnSelection"
  ? {
      winRect: string
      arrow: DirectionOfSelection
      documentController: DocumentController
    }
  : K extends "onPopupMenuOnNote"
  ? {
      note: MbBookNote
      arrow: DirectionOfSelection
      winRect: string
    }
  : K extends "onClosePopupMenuOnNote"
  ? {
      noteid: string
    }
  : K extends "onChangeExcerptRange" | "onProcessNewExcerpt"
  ? { noteid: string }
  : K extends "onAddonBroadcast"
  ? { message: string }
  : Record<string, any>

/**
 * Add or remove gesture recognizer from view.
 */
export function gestureRecognizerController(
  recognizers: {
    view: UIView
    gesture: UIGestureRecognizer
  }[]
) {
  const add = () => {
    recognizers.forEach(v => {
      v.view.addGestureRecognizer(v.gesture)
    })
  }
  const remove = () => {
    recognizers.forEach(v => {
      v.view.removeGestureRecognizer(v.gesture)
    })
  }
  return { add, remove }
}

/**
 * Init gesture recognizer, such as swipe, tap.
 */
export const initGesture = {
  swipe(
    touchNumber: number,
    direction: UISwipeGestureRecognizerDirection,
    handler: string
  ) {
    const swipe = new UISwipeGestureRecognizer(self, `${handler}:`)
    swipe.addTargetAction(self, `${handler}:`)
    swipe.numberOfTouchesRequired = touchNumber
    swipe.direction = direction
    return swipe
  },
  tap(touchNumber: number, tapNumber: number, handler: string) {
    const tap = new UITapGestureRecognizer(self, `${handler}:`)
    tap.addTargetAction(self, `${handler}:`)
    tap.numberOfTapsRequired = tapNumber
    tap.numberOfTouchesRequired = touchNumber
    return tap
  },
  pan(handler: string) {
    const pan = new UIPanGestureRecognizer(self, `${handler}:`)
    pan.addTargetAction(self, `${handler}:`)
    return pan
  }
}

/**
 * Define gesture handlers. Make sure to use `onGesture` as the handler name.
 * The handlers will be called when the corresponding gesture is triggered.
 */
export function defineGestureHandlers<K extends `on${string}`>(
  h: Record<K, (sender: UIGestureRecognizer) => void>
) {
  return h
}
