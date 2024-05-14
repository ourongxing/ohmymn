import {
  CGPoint,
  defineGestureHandlers,
  gestureRecognizerController,
  initGesture,
  UISwipeGestureRecognizerDirection
} from "marginnote"
import { PanelHeight, PanelPosition } from "~/modules/addon/typings"
import { actionTrigger } from "~/modules/gesture/utils"
import { Range, readProfile, writeProfile } from "~/profile"
import { ensureSafety, resizeSettingView } from "./switchPanel"

// Not support Mac
// Cannot access self unless use function
export const gestureRecognizers = () => {
  const gestures = [
    {
      view: self.dragOverlayView,
      gesture: initGesture.pan("onDnd")
    },
    {
      view: self.stretchOverlayView,
      gesture: initGesture.pan("onStretch")
    }
  ]
  if (!MN.isMac) {
    gestures.push(
      {
        view: MN.studyController.view,
        gesture: initGesture.swipe(
          1,
          UISwipeGestureRecognizerDirection.Up,
          "onSwipeUpOnMindMapView"
        )
      },
      {
        view: MN.studyController.view,
        gesture: initGesture.swipe(
          1,
          UISwipeGestureRecognizerDirection.Down,
          "onSwipeDownOnMindMapView"
        )
      },
      {
        view: MN.studyController.view,
        gesture: initGesture.swipe(
          1,
          UISwipeGestureRecognizerDirection.Left,
          "onSwipeLeftOnMindMapView"
        )
      },
      {
        view: MN.studyController.view,
        gesture: initGesture.swipe(
          1,
          UISwipeGestureRecognizerDirection.Right,
          "onSwipeRightOnMindMapView"
        )
      }
    )
  }
  return gestureRecognizerController(gestures)
}

export default defineGestureHandlers({
  onSwipeUpOnMindMapView(sender) {
    const { singleBarSwipeUp, muiltBarSwipeUp, selectionBarSwipeUp } =
      self.globalProfile.gesture
    actionTrigger(
      "Up",
      singleBarSwipeUp[0],
      muiltBarSwipeUp[0],
      selectionBarSwipeUp[0],
      sender
    )
  },
  onSwipeDownOnMindMapView(sender) {
    const { singleBarSwipeDown, muiltBarSwipeDown, selectionBarSwipeDown } =
      self.globalProfile.gesture
    actionTrigger(
      "Down",
      singleBarSwipeDown[0],
      muiltBarSwipeDown[0],
      selectionBarSwipeDown[0],
      sender
    )
  },
  onSwipeLeftOnMindMapView(sender) {
    const { singleBarSwipeLeft, muiltBarSwipeLeft, selectionBarSwipeLeft } =
      self.globalProfile.gesture
    actionTrigger(
      "Left",
      singleBarSwipeLeft[0],
      muiltBarSwipeLeft[0],
      selectionBarSwipeLeft[0],
      sender
    )
  },
  onSwipeRightOnMindMapView(sender) {
    const { singleBarSwipeRight, muiltBarSwipeRight, selectionBarSwipeRight } =
      self.globalProfile.gesture
    actionTrigger(
      "Right",
      singleBarSwipeRight[0],
      muiltBarSwipeRight[0],
      selectionBarSwipeRight[0],
      sender
    )
  },
  onDnd(sender) {
    /**
     * state 0: begin
     * state 1: move
     * state 2: end
     */
    const locationInMN = sender.locationInView(MN.studyController.view)
    const frameOfMN = MN.studyController.view.bounds
    if (Date.now() - dndState.lastTime > 100 && sender.state !== 3) {
      const translation = sender.translationInView(MN.studyController.view)
      dndState.locationInButton = sender.locationInView(sender.view)
      // translation 有可能突然变大
      if (Math.abs(translation.x) < 20 && Math.abs(translation.y) < 20) {
        dndState.locationInButton.x -= translation.x
        dndState.locationInButton.y -= translation.y
      }
    }
    if (sender.state !== 3) dndState.lastTime = Date.now()
    if (dndState.locationInButton) {
      let _x = locationInMN.x - dndState.locationInButton.x
      let _y = locationInMN.y - dndState.locationInButton.y
      const { x, y } = ensureSafety(
        { x: _x, y: _y },
        frameOfMN,
        sender.view.frame
      )
      const rect = { ...self.settingViewController.view.frame, x, y }
      resizeSettingView(rect, 0.1)
      if (sender.state === 3) {
        dndState.lastTime = 0
        self.globalProfile.additional.settingViewFrame = JSON.stringify(rect)
        const flag =
          self.globalProfile.addon.panelPosition[0] !== PanelPosition.Custom
        if (flag) {
          self.globalProfile.addon.panelPosition = [PanelPosition.Custom]
        }
        writeProfile({
          range: Range.Global,
          profileNO: self.notebookProfile.addon.profile[0]
        })
        if (flag) {
          readProfile({
            range: Range.Global,
            profileNO: self.notebookProfile.addon.profile[0]
          })
        }
      }
    }
  },
  onStretch(sender) {
    if (sender.state === 1) return
    const y = sender.locationInView(self.settingViewController.view).y
    const frame = sender.view.frame
    let height = y + frame.height / 2
    const rect = {
      ...self.settingViewController.view.frame,
      height: Math.max(100, height)
    }
    if (rect.y + rect.height > MN.studyController.view.bounds.height - 50)
      return
    resizeSettingView(rect)
    if (sender.state === 3) {
      self.globalProfile.additional.settingViewFrame = JSON.stringify(rect)
      const flag =
        self.globalProfile.addon.panelHeight[0] !== PanelHeight.Custom
      if (flag) {
        self.globalProfile.addon.panelHeight = [PanelHeight.Custom]
      }
      writeProfile({
        range: Range.Global,
        profileNO: self.notebookProfile.addon.profile[0]
      })
      if (flag) {
        readProfile({
          range: Range.Global,
          profileNO: self.notebookProfile.addon.profile[0]
        })
      }
    }
  }
})

const dndState = {
  locationInButton: undefined as CGPoint | undefined,
  lastTime: 0
}
