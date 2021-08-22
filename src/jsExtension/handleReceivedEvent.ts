import utils from "addons/addon-autostandardize"
import { actions } from "addons/synthesizer"
import { excerptHandler } from "jsExtension/excerptHandler"
import { closePanel, layoutViewController } from "jsExtension/switchPanel"
import profile from "profile"
import { getNoteById, getSelectNodes, undoGrouping } from "utils/notebook"
import { log, showHUD } from "utils/public"

declare interface IUserInfo {
  [k: string]: any
}

interface eventHandler {
  ({ userInfo }: { userInfo: IUserInfo }): void
}

const onButtonClick: eventHandler = ({ userInfo }) => {
  if (profile.ohmymn.clickHidden) closePanel()
  const nodes = getSelectNodes()
  if (nodes.length) {
    undoGrouping("ohmymn", nodes[0].notebookId!, () => {
      actions[userInfo.key]({
        content: userInfo.content,
        nodes: nodes
      })
    })
  }
}

const onSwitchChange: eventHandler = ({ userInfo }) => {
  profile[userInfo.name][userInfo.key] = userInfo.status
  if (userInfo.key == "rightMode") {
    layoutViewController()
  }
}

const onInputOver: eventHandler = ({ userInfo }) => {
  if (userInfo.content) {
    showHUD("输入已保存")
  } else showHUD("输入已清空")
}

const onProcessExcerptText: eventHandler = ({ userInfo }) => {
  const note = getNoteById(userInfo.noteid)
  let text = note?.excerptText

  // Mac & iPad：图片 -> OCR -> 自动矫正
  // iPad：文字 -> 自动矫正
  // OCR 要等，再处理
  // 自动矫正先处理，再等，再处理

  if (note.excerptPic && profile.ohmymn.autoOCR) {
    let times = 15
    // 异步
    NSTimer.scheduledTimerWithTimeInterval(0.1, true, function (timer) {
      if (note.excerptText || !times--) {
        timer.invalidate()
        // 有可能一直没获取到文字
        if (note.excerptText) {
          excerptHandler(note, true)
          if (profile.ohmymn.autoCorrect) {
            times = 15 // 重置 times，等待自动矫正
            NSTimer.scheduledTimerWithTimeInterval(0.1, true, function (_timer) {
              if (note.excerptText != text || !times--) {
                _timer.invalidate()
                if (note.excerptText != text) excerptHandler(note, true)
              }
            })
          }
        }
      }
    })
  }
  // 纯文字
  else if (text) {
    excerptHandler(note)
    // 开启了自动矫正，判断一下是否还有摘录，防止上一次执行把摘录清空了
    if (note.excerptText && profile.ohmymn.autoCorrect) {
      let times = 15
      NSTimer.scheduledTimerWithTimeInterval(0.1, true, function (timer) {
        if (note.excerptText != text || !times--) {
          timer.invalidate()
          if (note.excerptText != text) excerptHandler(note)
        }
      })
    }
  }
}

export default {
  onButtonClick,
  onInputOver,
  onSwitchChange,
  onProcessExcerptText
}
