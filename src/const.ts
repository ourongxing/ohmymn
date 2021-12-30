import mnaddon from "../mnaddon.json"

// 尽量不要在 self 加属性，没法检查，也没有提示，
// 但是如果把 self 相关的属性放到这上面，会导致多窗口互相影响，目前不清楚原因
class MNCore {
  mainPath!: string
  notebookId!: string
}

// class MNCore {
//   self!: () => any
//   studyController!: () => StudyController
//   window!: () => UIWindow
//   settingViewController!: UITableViewController
//   notebookController!: () => NotebookController
//   mainPath!: string
//   notebookId!: string
// }

//   MN.studyController = () =>
//     Application.sharedInstance().studyController(self.window)
//   MN.settingViewController = new SettingViewController()
//   MN.notebookController = () => MN.studyController().notebookController

export const Addon = {
  key: mnaddon.addonid.split(".")[2],
  title: mnaddon.title,
  author: mnaddon.author,
  version: mnaddon.version
}

export const MN = new MNCore()
