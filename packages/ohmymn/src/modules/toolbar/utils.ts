import { actionKey4Card, actionKey4Text, dataSourceIndex } from "~/dataSource"
import { isModuleON } from "~/coreModule"
import { initButton } from "~/jsExtension/overlayView"
import { DirectionOfSelection, openURL, showHUD } from "marginnote"
import { switchPanel } from "~/jsExtension/switchPanel"
import handleMagicAction from "~/jsExtension/handleMagicAction"
import { IRowButton } from "~/typings"
import lang from "./lang"

export function actionBarController(type: "card" | "text") {
  if (!isModuleON("toolbar")) return
  return {
    add() {
      if (type === "card") {
        const { winRect } = self.bar.card!
        const { height, width: lastWidth } = self.cardActionBar.view.frame
        self.cardActionBar.view.frame = {
          x: winRect.x,
          // y:
          //   (winRect.y > 60 ? winRect.y - 67 : winRect.y + winRect.height - 9) +
          //   (MN.isMac ? 0 : -3),
          y:
            (winRect.y > 60
              ? winRect.y - 67 - 35
              : winRect.y + winRect.height - 9 + 40) + (MN.isMac ? 0 : -3),
          height,
          width: winRect.width
        }
        self.cardActionBar.reload(winRect.width !== lastWidth)
        if (!self.cardActionBar.view.superview)
          MN.studyController.view.addSubview(self.cardActionBar.view)
        else self.cardActionBar.view.hidden = false
      } else {
        const { winRect, arrow } = self.bar.text!
        const { height } = self.textActionBar.view.frame
        self.textActionBar.view.frame = {
          x: winRect.x,
          // y:
          //   (arrow === DirectionOfSelection.toLeft
          //     ? winRect.y - 67
          //     : winRect.y + 1) + (MN.isMac ? 0 : -3),
          y:
            (arrow === DirectionOfSelection.toLeft
              ? winRect.y - 67 - 35
              : winRect.y + 1 + 40) + (MN.isMac ? 0 : -3),
          height,
          width: winRect.width
        }
        self.textActionBar.reload()
        if (!self.textActionBar.view.superview)
          MN.studyController.view.addSubview(self.textActionBar.view)
        else self.textActionBar.view.hidden = false
      }
    },
    remove() {
      if (type === "card") {
        self.cardActionBar.view.hidden = true
      } else {
        self.textActionBar.view.hidden = true
      }
    }
  }
}

export function actionBarView(type: "card" | "text") {
  const size = 30
  const gap = 5
  const borderWidth = 3
  const view = new UIView({
    x: 0,
    width: 0,
    height: size,
    y: 0
  })
  let lastButtonsLength = 0
  let lastTotalKey = ""
  function genButtons() {
    let buttonNum = 0
    const buttons = [] as UIButton[]
    let totalKey = ""
    Array.from({ length: type === "card" ? 8 : 4 }).forEach((_, num) => {
      const index = self.globalProfile.toolbar[type + "Toolbar" + num][0]
      if (index) {
        const key =
          type === "card"
            ? actionKey4Card[index].key
            : actionKey4Text[index].key
        totalKey += key
        const button = initButton(
          key,
          {
            x: buttonNum++ * (size + gap),
            y: 0,
            height: size,
            width: size
          },
          "onToolbarButtonClick"
        )
        buttons.push(button)
        button.tag =
          4096 + index * 10000 + num * 100 + (type === "card" ? 0 : 1)
        button.layer.borderColor = MN.currentThemeColor
        button.backgroundColor = MN.currentThemeColor
        button.layer.borderWidth = borderWidth
        button.layer.cornerRadius = 5
        button.layer.shadowColor = UIColor.blackColor()
        button.layer.shadowOffset = { width: 0.0, height: 1.0 }
        button.layer.masksToBounds = false
        button.layer.shadowRadius = 1.0
        button.layer.shadowOpacity = 0.5
      }
    })
    return {
      buttons,
      totalKey,
      length: buttonNum
    }
  }

  return {
    view,
    reload(widthChanged = false) {
      const { buttons, length, totalKey } = genButtons()
      if (length) {
        const width = buttons[length - 1].frame.x + size
        const x = (() => {
          const x =
            type === "card"
              ? view.frame.x + view.frame.width / 2 - width / 2 + gap / 2
              : view.frame.x - width / 2 + gap / 2
          if (x < 30) return 30
          const { width: MNWidth } = MN.studyController.view.bounds
          if (x > MNWidth - 30 - width) return MNWidth - 30 - width
          return x
        })()
        view.frame = {
          ...view.frame,
          width,
          x
        }
        if (
          lastButtonsLength !== length ||
          lastTotalKey !== totalKey ||
          widthChanged
        ) {
          view.subviews.forEach(v => v.removeFromSuperview())
          buttons.forEach(k => view.addSubview(k))
        }
      } else {
        view.hidden = true
      }
      lastButtonsLength = length
      lastTotalKey = totalKey
    }
  }
}

export function onToolbarButtonClick(sender: UIButton) {
  const tag = sender.tag
  const type = tag % 2 ? "text" : "card"
  const actionNum = Math.floor((tag - 4096) / 100) % 100
  const actionIndex = Math.floor((tag - 4096) / 10000)
  actionTrigger(type, `${type}Toolbar${actionNum}Shortcut`, actionIndex)
}

async function actionTrigger(
  type: "card" | "text",
  shortcutKey: string,
  actionIndex: number
) {
  if (!isModuleON("toolbar")) return
  let actionInfo: (typeof actionKey4Card)[number]
  if (type === "card") {
    actionInfo = actionKey4Card[actionIndex]
  } else {
    actionInfo = actionKey4Text[actionIndex]
  }
  const { key, module, option, moduleName } = actionInfo
  if (key === "none") return
  else if (key == "switchPanel") switchPanel()
  else if (key === "customShortcut") {
    const val = self.globalProfile.toolbar[shortcutKey]
    if (val) openURL(val)
  } else if (module && !isModuleON(module))
    showHUD(`${moduleName ?? module} ${lang.action_not_work}`, 2)
  else {
    const [sec, row] =
      dataSourceIndex[
        type === "card" ? "magicaction4card" : "magicaction4text"
      ][key]
    await handleMagicAction(
      type,
      self.dataSource[sec].rows[row] as IRowButton,
      option
    )
  }
}
