import type { UIWindow, UITableView } from "marginnote"

declare global {
  const MN: typeof import("marginnote")["MN"]
  const self: {
    useConsole?: boolean
    addon?: {
      key: string
      title: string
    }
    panel: {
      status: boolean
    }
    window: UIWindow
    view: UIView
    noteid: string
    tableView: UITableView
  }
}
