import {
  IDocProfile,
  INotebookProfile,
  IGlobalProfile,
  ITempProfile
} from "~/profile"
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
    html: string
    text: string
    respath: string
    retfunc: (r: {
      html: string
      text: string
      dirty: boolean
      size?: CGSize
    }) => void
    webView: UIWebView
    renderTemplate: string
    view: UIView
    window: UIWindow
    docmd5: string | undefined
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
    globalProfile: IGlobalProfile
    tempProfile: ITempProfile
    notebookProfile: INotebookProfile
    dataSource: ISection[]
    settingViewController: UITableViewController
    markdownEditController: UIWebView
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
