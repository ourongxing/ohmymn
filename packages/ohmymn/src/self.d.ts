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
    /**
     * Only mainView
     */
    dragOverlayView: UIView
    /**
     * Only mainView
     */
    stretchOverlayView: UIView
    gestureRecognizers: {
      add: () => void
      remove: () => void
    }
    /**
     * Both
     */
    addon?: {
      key: string
      title: string
    }
    /**
     * Only mainView
     */
    panel: {
      status: boolean
      lastOpenPanel: number
      lastClickButton: number
      lastReaderViewWidth: number
    }
    /**
     * Only mainView
     */
    excerptStatus: {
      isProcessNewExcerpt: boolean
      isChangeExcerptRange: boolean
      lastExcerptText: string | undefined
      isModify: boolean
      noteid: string
      OCROnlineStatus: "begin" | "end" | "free"
      lastRemovedComment:
        | {
            nodeNote: MbBookNote
            note: MbBookNote
            index: number
          }
        | undefined
    }
    /**
     * Only mainView
     */
    backupWaitTimes: number | undefined
    /**
     * Only mainView
     */
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
    /**
     * Only settingView
     */
    settingViewCache: {
      offModules: MyMap<DataSourceSectionKeyUnion, boolean | undefined>
      expandSections: Set<Exclude<AllModuleKeyUnion, "addon">>
    }
    /**
     * Only mainView
     */
    isFirstOpenDoc: boolean
    /**
     * Both
     */
    window: UIWindow
    /**
     * Only settingView
     */
    view: UIView
    /**
     * Only mainView
     */
    excerptNoteid: string
    /**
     * Only settingView
     */
    tableView: UITableView
    /**
     * Only mainView
     */
    bar: {
      text?: {
        arrow: DirectionOfSelection
        winRect: string
      }
      card?: {
        winRect: string
      }
    }
    /**
     * Only mainView
     */
    customSelectedNodes: NodeNote[]
    /**
     * Both
     */
    docProfile: IDocProfile
    /**
     * Both
     */
    globalProfile: IGlobalProfile
    /**
     * Only mainView
     */
    tempProfile: ITempProfile
    /**
     * Both
     */
    notebookProfile: INotebookProfile
    /**
     * Both
     */
    dataSource: ISection[]
    /**
     * Only mainView
     */
    allGlobalProfile: IGlobalProfile[]
    /**
     * Only mainView
     */
    allDocProfile: Record<string, IDocProfile>
    /**
     * Only mainView
     */
    allNotebookProfile: Record<string, INotebookProfile>
    /**
     * Only mainView
     */
    settingViewController: UITableViewController
    /**
     * Only settingView
     */
    popoverController: UIPopoverController
  }
}
