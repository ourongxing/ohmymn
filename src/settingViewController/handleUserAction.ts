import { openUrl, popup, postNotification, showHUD } from "utils/common"
import { dataSource } from "synthesizer"
import checkInputCorrect from "inputChecker"
import { Addon, MN } from "const"
import { cellViewType, IRowInput, IRowSelect, IRowSwitch } from "types/Addon"
import { UIAlertViewStyle, UITableView } from "types/UIKit"
import { byteLength } from "utils/text"
import lang from "lang"

const tag2indexPath = (tag: number): NSIndexPath =>
  NSIndexPath.indexPathForRowInSection(
    (tag - 999) % 100,
    (tag - 999 - ((tag - 999) % 100)) / 100
  )

export const magicAction = async (indexPath: NSIndexPath) => {
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
          row.option ? row.option : [lang.handle_user_action.sure],
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
          postNotification(Addon.key + "ButtonClick", {
            key,
            option,
            content
          })
          return
        } else showHUD(lang.handle_user_action.input_error)
      }
    case cellViewType.button:
      const { key, option } = await popup(
        row.label,
        row.help ?? "",
        UIAlertViewStyle.Default,
        row.option ?? [lang.handle_user_action.sure],
        (alert: UIAlertView, buttonIndex: number) => ({
          key: row.key,
          option: buttonIndex
        })
      )
      postNotification(Addon.key + "ButtonClick", {
        key,
        option
      })
  }
}
const tableViewDidSelectRowAtIndexPath = async (
  tableView: UITableView,
  indexPath: NSIndexPath
) => {
  tableView.cellForRowAtIndexPath(indexPath).selected = false
  await magicAction(indexPath)
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
    postNotification(Addon.key + "InputOver", {
      name: section.header.toLowerCase(),
      key: row.key,
      content: text
    })
  } else {
    showHUD(lang.handle_user_action.input_error)
    if (/^marginnote3app:/.test(text)) openUrl(text)
  }
  return true
}

const switchChange = (sender: UISwitch) => {
  const indexPath: NSIndexPath = tag2indexPath(sender.tag)
  const section = dataSource[indexPath.section]
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
  self.tableView.reloadData()
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
    byteLength(
      row.option.reduce((a, b) => (byteLength(a) > byteLength(b) ? a : b))
    ) *
      10 +
    80
  menuController.preferredContentSize = {
    width: width > 250 ? 250 : width,
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
