import { IDocProfile, IProfile, IProfileTemp } from "profile"
import { ReplaceParam } from "utils/input"
import { ISection } from "./Addon"
import { StudyController, MbBookNote } from "./MarginNote"
import { UITableView, UITableViewController, UIView, UIWindow } from "./UIKit"
import { DirectionOfSelection } from "./enum"

export * from "./Foundation"
export * from "./MarginNote"
export * from "./Addon"
export * from "./UIKit"

declare global {
  const self: {
    view: UIView
    window: UIWindow
    docMD5?: string
    noteid: string
    notebookid: string
    tableView: UITableView
    OCROnline: {
      status: "begin" | "end" | "free"
      times: number
    }
    noteSelectBar?:
      | {
          status: true
          type: "card" | "doc" | "both"
        }
      | {
          status: false
        }
    textSelectBar?: {
      arrow: DirectionOfSelection
      winRect: string
    }
    isModify: boolean
    customSelectedNodes: MbBookNote[]
    panelStatus: boolean
    docProfile: IDocProfile
    profile: IProfile
    profileTemp: IProfileTemp
    dataSource: ISection[]
    settingViewController: UITableViewController
    popoverController: UIPopoverController
    studyController: StudyController
  }
  class JSB {
    static defineClass(
      declaration: string,
      instanceMembers?: object,
      staticMembers?: object
    ): WrapperObj<any>
    static require(name: string): WrapperObj<any>
    static log(format: string, arguments: Array<string> | string): void
    static dump(object: WrapperObj<any>): void
    static newAddon(mainPath: string): any
  }
  type WrapperObj<T> = T
  type DictObj = {
    [k: string]: any
  }
}
