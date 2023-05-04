import type { IDocProfile, IGlobalProfile, INotebookProfile } from "~/profile"
import type { UIWindow, UITableView, UITableViewController } from "marginnote"
import type { ISection } from "./typings"

declare global {
  const MN: typeof import("marginnote")["MN"]
  const self: {
    isFirstOpenDoc: boolean
    useConsole?: boolean
    addon?: {
      key: string
      title: string
    }
    panel: {
      status: boolean
      lastOpenPanel: number
      lastClickButton: number
      lastReaderViewWidth: number
    }
    backupWaitTimes: number | undefined
    window: UIWindow
    webView: UIWebView
    view: UIView
    noteid: string
    tableView: UITableView
    docProfile: IDocProfile
    globalProfile: IGlobalProfile
    notebookProfile: INotebookProfile
    dataSource: ISection[]
    allGlobalProfile: IGlobalProfile[]
    allDocProfile: Record<string, IDocProfile>
    allNotebookProfile: Record<string, INotebookProfile>
    settingViewController: UITableViewController
    popoverController: UIPopoverController
  }
}
