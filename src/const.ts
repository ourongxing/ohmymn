import { NotebookController, StudyController } from "types/MarginNote"
import { UITableViewController, UIWindow } from "types/UIKit"
import mnaddon from "../mnaddon.json"

// 尽量不要在 self 加属性，没法检查，也没有自动补全
class MNCore {
  window!: UIWindow
  mainPath!: String
  notebookId!: string
  studyController!: StudyController
  settingViewController!: UITableViewController
  notebookController!: NotebookController
}

export const Addon = {
  key: mnaddon.addonid.split(".")[2],
  title: mnaddon.title,
  author: mnaddon.author,
  version: mnaddon.version
}

export const MN = new MNCore()
