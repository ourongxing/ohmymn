import { profile } from "profile";
import { showHUD } from "utils/common";
import { undoGrouping } from "utils/note";

// 面板和按键状态
let panelStatus = false

// 设置窗口面板的位置和大小
export const layoutViewController = () => {
    let frame = self.studyController.view.bounds
    let width = 300
    if (profile.ohmymn.rightMode) {
        self.settingViewController.view.frame = { x: frame.width - width - 50, y: 110, width: width, height: 450 }
    } else {
        self.settingViewController.view.frame = { x: 50, y: 110, width: width, height: 450 }
    }
}

export const closePanel = () => {
    if (panelStatus) {
        self.settingViewController.view.removeFromSuperview()
        // 刷新按钮状态
        panelStatus = false;
        self.studyController.refreshAddonCommands()
    }
}

const openPanel = () => {
    if (!panelStatus) {
        self.studyController.view.addSubview(self.settingViewController.view)
        if (self.studyController.docMapSplitMode == 2) {
            self.studyController.docMapSplitMode = 1
            showHUD("OhMyMN 与脑图更配喔", 1)
        }
        // 开启面板时，若键盘处于开启状态，关闭键盘
        NSTimer.scheduledTimerWithTimeInterval(0.2, false, function () {
            self.studyController.becomeFirstResponder()
        })
        panelStatus = true;
        self.studyController.refreshAddonCommands()
    }
}

let lastClickButton = 0
const switchPanel = () => {
    if (panelStatus) closePanel()
    else {
        if (profile.ohmymn.doubleClick) {
            const now = new Date().getTime()
            if (lastClickButton && now - lastClickButton < 300)
                openPanel()
            else lastClickButton = now
        } else openPanel()
    }
}

// addSubview 的时候会执行，也就是打开操作面板的时候
const controllerWillLayoutSubviews = (controller: UIViewController) => {
    if (controller == self.studyController)
        layoutViewController()
}

const queryAddonCommandStatus = () => {
    // 仅在学习模式下打开
    if (Application.sharedInstance().studyController(self.window).studyMode == studyMode.study)
        return {
            image: "logo.png",
            object: self,
            selector: "switchPanel:",
            checked: panelStatus ? true : false,
        };
    return null;
}

export default {
    queryAddonCommandStatus,
    switchPanel,
    controllerWillLayoutSubviews
}