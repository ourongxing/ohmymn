import {
  IDocProfile,
  IGlobalProfile,
  ITempProfile,
  INotebookProfile
} from "~/profile"
import { ISection } from "./Addon"
import { DirectionOfSelection } from "./enum"
import { MbBookNote, StudyController } from "./MarginNote"
import { UIView, UIWindow, UITableView, UITableViewController } from "./UIKit"

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
    backupWaitTimes: number | undefined
    webView: UIWebView
    renderTemplate: string
    view: UIView
    enDict: SQLiteDatabase
    window: UIWindow
    docmd5: string | undefined
    noteid: string
    notebookid: string
    tableView: UITableView
    OCROnline: {
      status: "begin" | "end" | "free"
      times: number
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
    ): any
    static require(name: string): any
    static log(format: string, arguments: Array<string> | string): void
    static dump(object: any): void
    static newAddon(mainPath: string): any
  }
  type DictObj = {
    [k: string]: any
  }
}

export type Timer = {
  invalidate: () => void
}
