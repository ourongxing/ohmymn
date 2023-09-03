import {
  CGPoint,
  defineGestureHandlers,
  gestureRecognizerController,
  initGesture,
  UISwipeGestureRecognizerDirection
} from "marginnote"
import {
  PanelControl,
  PanelHeight,
  PanelPosition
} from "~/modules/addon/typings"
import { actionTrigger } from "~/modules/gesture/utils"
import { Range, readProfile, writeProfile } from "~/profile"
import { closePanel, ensureSafety, resizeSettingViewView } from "./switchPanel"

// Not support Mac
// Cannot access self unless use function
export const gestureRecognizers = () => {
  return gestureRecognizerController([
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
    },
    {
      view: self.dragOverlayView,
      gesture: initGesture.pan("onDnd")
    },
    {
      view: self.stretchOverlayView,
      gesture: initGesture.pan("onStretch")
    }
  ])
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
  onDoubleClickOnTableView() {
    const { panelControl } = self.globalProfile.addon
    if (panelControl.includes(PanelControl.DoubleClickClose)) closePanel()
  },
  onDnd(sender) {
    const locationInMN = sender.locationInView(MN.studyController.view)
    const frameOfMN = MN.studyController.view.bounds
    if (Date.now() - dndState.last > 100 && sender.state !== 3) {
      const translation = sender.translationInView(MN.studyController.view)
      dndState.locationInButton = sender.locationInView(sender.view)
      dndState.locationInButton.x -= translation.x
      dndState.locationInButton.y -= translation.y
    }
    if (dndState.locationInButton) {
      let x = locationInMN.x - dndState.locationInButton.x
      let y = locationInMN.y - dndState.locationInButton.y
      ;({ x, y } = ensureSafety({ x, y }, frameOfMN, sender.view.frame))
      const rect = {
        ...self.settingViewController.view.frame,
        x,
        y
      }
      resizeSettingViewView(rect, 0.1)
      if (sender.state === 3) {
        dndState.last = 0
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
    if (sender.state !== 3) dndState.last = Date.now()
  },
  onStretch(sender) {
    const location = sender.locationInView(self.settingViewController.view)
    const frame = sender.view.frame
    let height = location.y + frame.height / 2
    const rect = {
      ...self.settingViewController.view.frame,
      height
    }
    resizeSettingViewView(rect)
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
  last: 0
}
