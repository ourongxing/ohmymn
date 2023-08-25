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
  NodeNote,
  UIImage
} from "marginnote"
import type { ISection } from "./typings"
import type { AllModuleKeyUnion, DataSourceSectionKeyUnion } from "./coreModule"
import { MyMap } from "./utils"

declare global {
  const MN: typeof import("marginnote")["MN"]
  const self: {
    useConsole?: boolean
    dragOverlayView: UIView
    stretchOverlayView: UIView
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
      lastExcerptText: string | undefined
      isModify: boolean
      OCROnlineStatus: "begin" | "end" | "free"
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
    settingViewCache: {
      moduleOff: MyMap<DataSourceSectionKeyUnion, boolean | undefined>
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
