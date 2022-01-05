import {
  StudyController,
  NotebookController,
  MbModelTool
} from "types/MarginNote"
import { UIWindow, UITableViewController } from "types/UIKit"
import mnaddon from "../mnaddon.json"

// 尽量不要在 self 加属性，没法检查，也没有提示，
// 但是如果把 self 相关的属性放到这上面，会导致多窗口互相影响，目前不清楚原因，暂时放弃多窗口支持
class MNCore {
  studyController!: StudyController
  window!: UIWindow
  settingViewController!: UITableViewController
  notebookController!: NotebookController
  textColor!: UIColor
  mainPath!: string
  notebookId!: string
  app = Application.sharedInstance()
  db = Database.sharedInstance()
}

export const Addon = {
  key: mnaddon.addonid.split(".")[2],
  title: mnaddon.title,
  author: mnaddon.author,
  version: mnaddon.version,
  link: "https://github.com/mnaddon/ohmymn"
}

export const MN = new MNCore()
