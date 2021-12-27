import { StudyController } from "types/MarginNote"
import { UITableViewController, UIWindow } from "types/UIKit"

// 尽量不要在 self 加属性，没法检查，也没有自动补全
class MNCore {
  window!: UIWindow
  mainPath!: String
  studyController!: StudyController
  settingViewController!: UITableViewController
}

export const MN = new MNCore()
