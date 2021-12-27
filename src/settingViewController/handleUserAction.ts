import { log, openUrl, popup, postNotification, showHUD } from "utils/common"
import { dataSource } from "synthesizer"
import checkInputCorrect from "inputChecker"
import { MN } from "utils/const"
import { cellViewType, IRowInput, IRowSelect, IRowSwitch } from "types/Addon"
import { MenuController, osType } from "types/MarginNote"

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
  const section = dataSource[indexPath.section]
  const row = section.rows[indexPath.row]
  switch (row.type) {
    case cellViewType.plainText:
      if (row.link) openUrl(row.link)
      break
    case cellViewType.buttonWithInput:
      for (;;) {
        const { key, option, content } = await popup(
          row.label,
          row.help ?? "",
          UIAlertViewStyle.PlainTextInput,
          row.option ? row.option : ["确定"],
          (alert: UIAlertView, buttonIndex: number) => {
            // 最好只有两个选项，因为这样会在输入后自动选中最后一个选项
            return {
              key: row.key,
              content: alert.textFieldAtIndex(0).text,
              option: buttonIndex
            }
          }
        )
        // 允许为空
        if (!content || checkInputCorrect(content, row.key)) {
          postNotification("ButtonClick", {
            key,
            option,
            content
          })
          return
        } else showHUD("输入错误，请重新输入")
      }
    case cellViewType.button:
      const { key, option } = await popup(
        row.label,
        row.help ?? "",
        UIAlertViewStyle.Default,
        row.option ?? ["确定"],
        (alert: UIAlertView, buttonIndex: number) => ({
          key: row.key,
          option: buttonIndex
        })
      )
      postNotification("ButtonClick", {
        key,
        option
      })
  }
}

const textFieldShouldReturn = (sender: UITextField) => {
  const indexPath: NSIndexPath = tag2indexPath(sender.tag)
  const section = dataSource[indexPath.section]
  const row = <IRowInput>section.rows[indexPath.row]
  let text = sender.text.trim()
  // 可以为空
  if (!text || checkInputCorrect(text, row.key)) {
    // 输入正确则取消光标
    sender.resignFirstResponder()
    row.content = text
    postNotification("InputOver", {
      name: section.header.toLocaleLowerCase(),
      key: row.key,
      content: text
    })
  } else showHUD("输入错误，请查看相关说明")
  return true
}

const switchChange = (sender: UISwitch) => {
  const indexPath: NSIndexPath = tag2indexPath(sender.tag)
  const section = dataSource[indexPath.section]
  const row = <IRowSwitch>section.rows[indexPath.row]
  row.status = sender.on ? true : false
  postNotification("SwitchChange", {
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
  const section = dataSource[indexPath.section]
  const row = <IRowSelect>section.rows[indexPath.row]
  // 区分单选和多选
  if (
    (<IRowSelect>dataSource[indexPath.section].rows[indexPath.row]).type ==
    cellViewType.select
  ) {
    ;(<IRowSelect>(
      dataSource[indexPath.section].rows[indexPath.row]
    )).selections = [selection]
    postNotification("SelectChange", {
      name: section.header.toLowerCase(),
      key: row.key,
      selections: [selection]
    })
    if (popoverController) popoverController.dismissPopoverAnimated(true)
    // 貌似 iPad 上无法使用 reloadRow
    Application.sharedInstance().osType == osType.macOS
      ? self.tableView.reloadRowsAtIndexPathsWithRowAnimation(indexPath, 0)
      : self.tableView.reloadData()
  } else {
    const selections = row.selections
    const nowSelect = row.selections.includes(selection)
      ? selections.filter(item => item != selection)
      : [selection, ...selections]

    ;(<IRowSelect>(
      dataSource[indexPath.section].rows[indexPath.row]
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
}

const clickSelectButton = (sender: UIButton) => {
  const indexPath: NSIndexPath = tag2indexPath(sender.tag)
  const section = dataSource[indexPath.section]
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
    row.option.reduce((a, b) => (a.length > b.length ? a : b)).length * 20 + 80
  menuController.preferredContentSize = {
    width: width > 300 ? 250 : width,
    height: menuController.rowHeight * menuController.commandTable.length
  }
  const studyControllerView = MN.studyController.view
  popoverController = new UIPopoverController(menuController)
  popoverController.presentPopoverFromRect(
    sender.convertRectToView(sender.bounds, studyControllerView),
    studyControllerView,
    1 << 3,
    true
  )
  self.popoverController.delegate = self
}

// 弹窗消失发送数据，只响应点击其他区域时，所以只能用来处理多选
const popoverControllerDidDismissPopover = (
  UIPopoverController: UIPopoverController
) => {
  if (lastSelectInfo) {
    postNotification("SelectChange", lastSelectInfo)
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
