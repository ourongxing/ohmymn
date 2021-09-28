import { log, openUrl, postNotification, showHUD } from "utils/common"
import { dataSource } from "addons/synthesizer"
import { checkInputCorrect } from "utils/input"

const tag2indexPath = (tag: number): NSIndexPath => {
  return {
    section: (tag - 999 - ((tag - 999) % 100)) / 100,
    row: (tag - 999) % 100
  }
}

const tableViewDidSelectRowAtIndexPath = (
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
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        row.label!,
        row.help ?? "",
        UIAlertViewStyle.PlainTextInput,
        "取消",
        ["确定"],
        (alert: UIAlertView, buttonIndex: number) => {
          if (buttonIndex == 0) return
          let text = alert.textFieldAtIndex(0).text
          if (!text) return
          postNotification("ButtonClick", {
            key: row.key,
            content: text
          })
        }
      )
      break
    case cellViewType.button:
      if (row.key == "space") return
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        row.label!,
        row.help ?? "",
        UIAlertViewStyle.Default,
        "取消",
        row.option ?? ["确定"],
        (alert: UIAlertView, buttonIndex: number) => {
          if (buttonIndex == 0) return
          postNotification("ButtonClick", {
            key: row.key,
            content: String(buttonIndex - 1)
          })
        }
      )
  }
}

const textFieldShouldReturn = (sender: UITextField) => {
  const indexPath: NSIndexPath = tag2indexPath(sender.tag)
  const section = dataSource[indexPath.section]
  const row = section.rows[indexPath.row]
  let text = sender.text.trim()
  // 可以为空
  if (!text || checkInputCorrect(text, row.key!)) {
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
  const row = section.rows[indexPath.row]
  row.status = sender.on
  postNotification("SwitchChange", {
    name: section.header.toLowerCase(),
    key: row.key,
    status: sender.on
  })
}

export default {
  tableViewDidSelectRowAtIndexPath,
  textFieldShouldReturn,
  switchChange
}
