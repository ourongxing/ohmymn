import { NotebookController, StudyController } from "./MarginNote"
import { UITableView, UITableViewController, UIWindow } from "./UIKit"

export {}
declare global {
  class JSB {
    static defineClass(
      declaration: string,
      instanceMembers?: object,
      staticMembers?: object
    ): WrapperObj<any>
    static require(name: string): WrapperObj<any>
    static log(format: string, arguments: Array<string>): void
    static dump(object: WrapperObj<any>): void
    static newAddon(mainPath: string): any
  }
  const self: {
    [k: string]: any
    studyController: StudyController
    window: UIWindow
    docMD5: string
    notebookid: string
    tableView: UITableView
    panelStatus: boolean
    settingViewController: UITableViewController
  }
  type WrapperObj<T> = T
  type DictObj = {
    [k: string]: any
  }
}
