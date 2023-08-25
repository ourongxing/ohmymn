import { UITableView, UIViewController } from "."

export declare class UITableViewController extends UIViewController {
  [k: string]: any
  view: UIView
  tableView?: UITableView
  clearsSelectionOnViewWillAppear: boolean
}

// tableviewcontrol 里面全是执行 tableview 的 datasoure 协议和 delegate 协议
// 自己没什么东西，这两个协议由于要加前缀，不知道在 TS 里怎么处理
