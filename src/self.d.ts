import { DirectionOfSelection } from "~/enum"
import {
  UIView,
  UIWindow,
  UITableView,
  MbBookNote,
  ISection,
  UITableViewController
} from "~/typings"
import {
  IDocProfile,
  IGlobalProfile,
  ITempProfile,
  INotebookProfile
} from "~/utils"

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
