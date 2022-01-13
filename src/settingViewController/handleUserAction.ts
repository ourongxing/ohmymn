import { openUrl, postNotification, showHUD } from "utils/common"
import checkInputCorrect from "inputChecker"
import { Addon, MN } from "const"
import { cellViewType, IRowInput, IRowSelect, IRowSwitch } from "types/Addon"
import { UITableView } from "types/UIKit"
import { byteLength } from "utils/text"
import lang from "lang"

const tag2indexPath = (tag: number): NSIndexPath =>
  NSIndexPath.indexPathForRowInSection(
    (tag - 999) % 100,
    (tag - 999 - ((tag - 999) % 100)) / 100
  )

const tableViewDidSelectRowAtIndexPath = async (
  tableView: UITableView,
  indexPath: NSIndexPath
) => {
  tableView.cellForRowAtIndexPath(indexPath).selected = false
  const row = self.dataSource[indexPath.section].rows[indexPath.row]
  switch (row.type) {
    case cellViewType.plainText:
      if (row.link) openUrl(row.link)
      break
    case cellViewType.buttonWithInput:
    case cellViewType.button:
      postNotification(Addon.key + "ButtonClick", {
        row
      })
  }
}

const textFieldShouldReturn = (sender: UITextField) => {
  const indexPath: NSIndexPath = tag2indexPath(sender.tag)
  const section = self.dataSource[indexPath.section]
  const row = section.rows[indexPath.row] as IRowInput
  let text = sender.text.trim()
  // 可以为空
  if (/^marginnote3app:/.test(text)) openUrl(text)
  if (!text || checkInputCorrect(text, row.key)) {
    // 输入正确则取消光标
    sender.resignFirstResponder()
    row.content = text
    postNotification(Addon.key + "InputOver", {
      name: section.header.toLowerCase(),
      key: row.key,
      content: text
    })
  } else {
    showHUD(lang.handle_user_action.input_error)
  }
  return true
}

const switchChange = (sender: UISwitch) => {
  const indexPath: NSIndexPath = tag2indexPath(sender.tag)
  const section = self.dataSource[indexPath.section]
  const row = <IRowSwitch>section.rows[indexPath.row]
  row.status = sender.on ? true : false
  postNotification(Addon.key + "SwitchChange", {
    name: section.header.toLowerCase(),
    key: row.key,
    status: sender.on ? true : false
  })
}

let lastSelectInfo: {
  name: string
  key: string
  selections: number[]
} | null
let popoverController: UIPopoverController
const selectAction = (param: {
  indexPath: NSIndexPath
  selection: number
  menuController: MenuController
}) => {
  const { indexPath, selection, menuController } = param
  const section = self.dataSource[indexPath.section]
  const row = <IRowSelect>section.rows[indexPath.row]
  // 区分单选和多选
  if (
    (<IRowSelect>self.dataSource[indexPath.section].rows[indexPath.row]).type ==
    cellViewType.select
  ) {
    ;(<IRowSelect>(
      self.dataSource[indexPath.section].rows[indexPath.row]
    )).selections = [selection]
    postNotification(Addon.key + "SelectChange", {
      name: section.header.toLowerCase(),
      key: row.key,
      selections: [selection]
    })
    if (popoverController) popoverController.dismissPopoverAnimated(true)
  } else {
    const selections = row.selections
    const nowSelect = row.selections.includes(selection)
      ? selections.filter(item => item != selection)
      : [selection, ...selections]

    ;(<IRowSelect>(
      self.dataSource[indexPath.section].rows[indexPath.row]
    )).selections = nowSelect

    lastSelectInfo = {
      name: section.header.toLowerCase(),
      key: row.key,
      selections: nowSelect.sort()
    }
    menuController.commandTable = menuController.commandTable?.map(
      (item, index) => {
        item.checked = row.selections.includes(index)
        return item
      }
    )
    menuController.menuTableView!.reloadData()
  }
  self.tableView.reloadData()
}

const clickSelectButton = (sender: UIButton) => {
  const indexPath: NSIndexPath = tag2indexPath(sender.tag)
  const section = self.dataSource[indexPath.section]
  const row = <IRowSelect>section.rows[indexPath.row]
  const menuController = MenuController.new()
  menuController.commandTable = row.option.map((item, index) => ({
    title: item,
    object: self,
    selector: "selectAction:",
    param: {
      indexPath,
      menuController,
      selection: index
    },
    checked: row.selections.includes(index)
  }))
  menuController.rowHeight = 44
  const width =
    byteLength(
      row.option.reduce((a, b) => (byteLength(a) > byteLength(b) ? a : b))
    ) *
      10 +
    80
  menuController.preferredContentSize = {
    width: width > 300 ? 300 : width,
    height: menuController.rowHeight * menuController.commandTable.length
  }
  const studyControllerView = MN.studyController().view
  popoverController = new UIPopoverController(menuController)
  popoverController.presentPopoverFromRect(
    sender.convertRectToView(sender.bounds, studyControllerView),
    studyControllerView,
    1 << 3,
    true
  )
  //@ts-ignore
  popoverController.delegate = self
}

// 弹窗消失发送数据，只响应点击其他区域时，所以只能用来处理多选
const popoverControllerDidDismissPopover = (
  UIPopoverController: UIPopoverController
) => {
  if (lastSelectInfo) {
    postNotification(Addon.key + "SelectChange", lastSelectInfo)
    lastSelectInfo = null
  }
}

export default {
  popoverControllerDidDismissPopover,
  tableViewDidSelectRowAtIndexPath,
  textFieldShouldReturn,
  clickSelectButton,
  switchChange,
  selectAction
}
