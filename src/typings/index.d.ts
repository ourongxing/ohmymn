import { IDocProfile, IProfile, IProfileTemp } from "profile"
import { ReplaceParam } from "utils/input"
import { ISection } from "./OhMyMN"
import { StudyController, MbBookNote } from "./MarginNote"
import { UITableView, UITableViewController, UIWindow } from "./UIKit"
import { DirectionOfSelection } from "./enum"

export * from "./Foundation"
export * from "./MarginNote"
export * from "./OhMyMN"
export * from "./UIKit"

declare global {
  const self: {
    [k: string]: any
    studyController: StudyController
    window: UIWindow
    docMD5?: string
    notebookid: string
    tableView: UITableView
    singleBarStatus: boolean
    selectionBar?: {
      arrow: DirectionOfSelection
      winRect: string
    }
    customSelectedNodes: MbBookNote[]
    panelStatus: boolean
    docProfile: {
      [k: string]: { [k: string]: boolean | string | number[] }
    } & IDocProfile
    profile: {
      [k: string]: { [k: string]: boolean | string | number[] }
    } & IProfile
    profileTemp: {
      [k: string]: { [k: string]: RegExp[][] | ReplaceParam[] | undefined }
    } & IProfileTemp
    dataSource: ISection[]
    settingViewController: UITableViewController
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
