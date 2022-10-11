import type {
  IDocProfile,
  IGlobalProfile,
  ITempProfile,
  INotebookProfile
} from "~/profile"
import type {
  MbBookNote,
  UIWindow,
  UITableView,
  UITableViewController,
  DirectionOfSelection
} from "marginnote"
import type { ISection } from "./typings"

declare global {
  const self: {
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
    excerptStatus: {
      isProcessNewExcerpt: boolean
      isChangeExcerptRange: boolean
      lastExcerptText: string
      isModify: boolean
      OCROnline: {
        status: "begin" | "end" | "free"
        times: number
      }
      lastRemovedComment:
        | {
            nodeNote: MbBookNote
            note: MbBookNote
            index: number
          }
        | undefined
    }
    backupWaitTimes: number | undefined
    metadata: {
      data:
        | {
            pageOffset: string
            citeKey: string
            reference: string
            metadata: any
          }
        | undefined
      lastFetch: number
    }
    webView: UIWebView
    view: UIView
    window: UIWindow
    docmd5: string | undefined
    noteid: string
    notebookid: string
    tableView: UITableView
    textSelectBar?: {
      arrow: DirectionOfSelection
      winRect: string
    }
    customSelectedNodes: MbBookNote[]
    docProfile: IDocProfile
    globalProfile: IGlobalProfile
    tempProfile: ITempProfile
    notebookProfile: INotebookProfile
    dataSource: ISection[]
    allGlobalProfile: IGlobalProfile[]
    allDocProfile: Record<string, IDocProfile>
    allNotebookProfile: Record<string, INotebookProfile>
    settingViewController: UITableViewController
    popoverController: UIPopoverController
  }
}
