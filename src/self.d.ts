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
  DirectionOfSelection,
  NodeNote
} from "marginnote"
import type { ISection } from "./typings"
import { AllModuleKeyUnion } from "./merged"

declare global {
  const MN: typeof import("marginnote")["MN"]
  const dev: typeof import("marginnote")["dev"]
  const self: {
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
    expandSections: Set<Exclude<AllModuleKeyUnion, "addon">>
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
    isFirstOpenDoc: boolean
    window: UIWindow
    webView: UIWebView
    view: UIView
    noteid: string
    tableView: UITableView
    textSelectBar?: {
      arrow: DirectionOfSelection
      winRect: string
    }
    customSelectedNodes: NodeNote[]
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
