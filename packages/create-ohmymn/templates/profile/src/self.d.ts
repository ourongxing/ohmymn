import type { IDocProfile, IGlobalProfile, INotebookProfile } from "~/profile"
import type {
  MbBookNote,
  UIWindow,
  UITableView,
  UITableViewController,
  DirectionOfSelection,
  NodeNote
} from "marginnote"
import type { ISection } from "./typings"
import type { AllModuleKeyUnion } from "./coreModule"

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
