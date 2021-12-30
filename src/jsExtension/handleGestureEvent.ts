import { MN } from "const"
import { magicAction } from "settingViewController/handleUserAction"
import { gestureHandler } from "types/Addon"
import { studyMode } from "types/MarginNote"
import { UISwipeGestureRecognizerDirection, UIView } from "types/UIKit"
import { alert, log, showHUD } from "utils/common"
import { gestureHandlerController, initGesture } from "utils/gesture"
import { getSelectNodes } from "utils/note"

// Mac 上无法使用触摸
export const gestureHandlers = gestureHandlerController([
  {
    // 如果直接传递 view 和 gesture，此时无法获取到 self
    view: () => self.studyController.view,
    handler: () =>
      initGesture.swipe(
        1,
        UISwipeGestureRecognizerDirection.Right,
        "SwipeRightOnMindMapView"
      )
  }
])

const enum swipePositon {
  None = 0,
  SingleBar,
  MuiltBar
}

const checkSwipePosition = (sender: UIGestureRecognizer): swipePositon => {
  const MindMapNodeViews = self.notebookController.mindmapView.selViewLst
  // 必须打开脑图，并且选中卡片
  if (
    self.studyController.studyMode != studyMode.study ||
    !MindMapNodeViews?.length
  )
    return swipePositon.None
  const { y: swipeY } = sender.locationInView(self.studyController.view)
  if (MindMapNodeViews.length == 1) {
    const view = MindMapNodeViews![0].view
    const { x, y, height } =
      self.notebookController.mindmapView.subviews[0].subviews[0].convertRectToView(
        view.frame,
        self.studyController.view
      )
    // 工具栏在上面
    return (y - swipeY < 50 && y - swipeY > 0) ||
      // 工具栏在下面
      (swipeY - y < height + 50 && swipeY - y > height)
      ? swipePositon.SingleBar
      : swipePositon.None
  } else {
    const { height } = self.studyController.view.bounds
    return height - swipeY > 50 && height - swipeY < 150
      ? swipePositon.MuiltBar
      : swipePositon.None
    // alert(JSON.stringify({ swipeX, swipeY, height}))
  }
}
const onSwipeRightOnMindMapView: gestureHandler = async sender => {
  switch (checkSwipePosition(sender)) {
    case swipePositon.None:
      return
    case swipePositon.MuiltBar:
      showHUD("多选")
      break
    case swipePositon.SingleBar:
      await magicAction(NSIndexPath.indexPathForRowInSection(3, 0))
      break
  }
}

export default { onSwipeRightOnMindMapView }
