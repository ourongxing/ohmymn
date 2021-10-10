import { log, openUrl, popup, postNotification, showHUD } from "utils/common"
import { dataSource } from "synthesizer"
import checkInputCorrect from "inputChecker"

const tag2indexPath = (tag: number): NSIndexPath => {
  return {
    section: (tag - 999 - ((tag - 999) % 100)) / 100,
    row: (tag - 999) % 100
  }
}

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
        const { key, content } = await popup(
          row.label!,
          row.help ?? "",
          UIAlertViewStyle.PlainTextInput,
          ["确定"],
          (alert: UIAlertView, buttonIndex: number) => ({
            key: row.key!,
            content: alert.textFieldAtIndex(0).text.trim()
          })
        )
        if (!content) return
        if (checkInputCorrect(content, row.key!)) {
          postNotification("ButtonClick", {
            key,
            content
          })
          return
        } else {
          showHUD("输入错误，请重新输入")
        }
      }
    case cellViewType.button:
      if (row.key == "space") return
      const { key, content } = await popup(
        row.label!,
        row.help ?? "",
        UIAlertViewStyle.Default,
        row.option ?? ["确定"],
        (alert: UIAlertView, buttonIndex: number) => ({
          key: row.key!,
          content: String(buttonIndex)
        })
      )
      postNotification("ButtonClick", {
        key,
        content
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
