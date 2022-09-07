import {
  IDocProfile,
  IGlobalProfile,
  ITempProfile,
  INotebookProfile
} from "~/profile"
import {
  DocumentController,
  MbBookNote,
  UITableView,
  UITableViewController,
  UIView,
  UIWindow
} from ".."
import { DirectionOfSelection } from "~/enum"
import { IRowButton, ISection } from "./DataSource"
export * from "./module"
export * from "./DataSource"
export * from "./AutoUtils"

declare global {
  const self: {
    addon?: {
      key: string
      title: string
    }
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
    panel: {
      status: boolean
      lastOpenPanel: number
      lastClickButton: number
      lastReaderViewWidth: number
    }
    docProfile: IDocProfile
    globalProfile: IGlobalProfile
    tempProfile: ITempProfile
    notebookProfile: INotebookProfile
    dataSource: ISection[]
    settingViewController: UITableViewController
    popoverController: UIPopoverController
  }
}

export interface EventHandler {
  (sender: {
    // 不是都有哈，具体要看发送了什么
    userInfo: {
      key: string
      option: number
      row: IRowButton
      content: string
      name: string
      type: "text" | "card"
      status: boolean
      note: MbBookNote
      selections: number[]
      noteid: string
      arrow: DirectionOfSelection
      /**
       * returns a {@link DocumentController} instance
       */
      documentController: DocumentController
      winRect: string
    }
  }): void
}

export interface GestureHandler {
  (sender: UIGestureRecognizer): void
}
