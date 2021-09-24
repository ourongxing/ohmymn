import { dataSource } from "addons/synthesizer"

const indexPath2tag = (indexPath: NSIndexPath): number => {
  return indexPath.section * 100 + indexPath.row + 999
}

const numberOfSectionsInTableView = (tableView: UITableView) => {
  return dataSource.length
}

const tableViewNumberOfRowsInSection = (
  tableView: UITableView,
  section: number
) => {
  return dataSource[section].rows.length
}

const tableViewTitleForHeaderInSection = (
  tableView: UITableView,
  section: number
) => {
  return dataSource[section].header
}

const tableViewHeightForRowAtIndexPath = (
  tableView: UITableView,
  indexPath: NSIndexPath
) => {
  const row = dataSource[indexPath.section].rows[indexPath.row]
  if (row.key == "space") return 300
  else if (row.type === cellViewType.plainText) {
    let num = row.label!.length - row.label!.replace(/[\r\n]/g, "").length
    return 30 + num * 15
  } else return 40
}

const tableViewCellForRowAtIndexPath = (
  tableView: UITableView,
  indexPath: NSIndexPath
) => {
  const row = dataSource[indexPath.section].rows[indexPath.row]
  switch (row.type) {
    case cellViewType.plainText: {
      const cell = UITableViewCell.makeWithStyleReuseIdentifier(
        0,
        "PlainTextCellID"
      )
      cell.selectionStyle = 0
      cell.textLabel.opaque = false
      cell.textLabel.textAlignment = 0
      cell.textLabel.lineBreakMode = 0
      cell.textLabel.numberOfLines = 0
      cell.textLabel.textColor = UIColor.grayColor()
      cell.textLabel.font = UIFont.systemFontOfSize(12)
      cell.textLabel.text = row.label
      return cell
    }
    case cellViewType.button:
    case cellViewType.buttonWithInput: {
      const cell = UITableViewCell.makeWithStyleReuseIdentifier(
        0,
        "ButtonCellID"
      )
      cell.textLabel.font = UIFont.systemFontOfSize(16)
      cell.textLabel.textColor = self.textColor
      cell.selectionStyle = row.key == "space" ? 0 : 1
      cell.textLabel.text = row.label
      return cell
    }
    case cellViewType.switch: {
      const cell = UITableViewCell.makeWithStyleReuseIdentifier(
        0,
        "SwitchCellID"
      )
      cell.selectionStyle = 0
      cell.textLabel.text = row.label
      cell.textLabel.font = UIFont.systemFontOfSize(16)
      cell.textLabel.textColor = self.textColor
      let view = null
      if (row.status) view = controllers.switch(row.status)
      else view = controllers.switch()
      let newFrame = view.frame
      newFrame.x = cell.contentView.frame.width - newFrame.width - 10
      view.frame = newFrame
      view.autoresizingMask = 1 << 0
      view.tag = indexPath2tag(indexPath)
      cell.contentView.addSubview(view)
      return cell
    }
    case cellViewType.inlineInput: {
      const cell = UITableViewCell.makeWithStyleReuseIdentifier(
        0,
        "inlineInputCellID"
      )
      cell.selectionStyle = 0
      cell.textLabel.font = UIFont.systemFontOfSize(16)
      cell.textLabel.textColor = self.textColor
      cell.textLabel.text = row.label
      let view = null
      if (row.content) view = controllers.inlineInput(row.content)
      else view = controllers.inlineInput()
      let newFrame = view.frame
      newFrame.x = cell.contentView.frame.width - newFrame.width - 10
      view.frame = newFrame
      view.autoresizingMask = 1 << 0
      // 传入位置，不要直接传入 indexPath，以及设置 indexPath 属性
      // 唯一值，建议加一个较大数
      view.tag = indexPath2tag(indexPath)
      cell.contentView.addSubview(view)
      return cell
    }
    case cellViewType.input: {
      const cell = UITableViewCell.makeWithStyleReuseIdentifier(
        0,
        "inputCellID"
      )
      cell.textLabel.font = UIFont.systemFontOfSize(16)
      cell.textLabel.textColor = self.textColor
      cell.selectionStyle = 0
      let view = null
      if (row.content) view = controllers.input(row.content)
      else view = controllers.input()
      view.autoresizingMask = 1 << 0
      view.tag = indexPath2tag(indexPath)
      cell.contentView.addSubview(view)
      return cell
    }
  }
}

// 仅用于 SettingViewController, self 为 tableviewcontroller
export const controllers = {
  switch(status = false) {
    const frame = { x: 0, y: 5, width: 50, height: 30 }
    const view = new UISwitch(frame)
    view.addTargetActionForControlEvents(self, "switchChange:", 1 << 12)
    view.backgroundColor = UIColor.clearColor()
    view.on = status
    return view
  },
  inlineInput(text = "") {
    const frame = { x: 0, y: 9, width: 100, height: 30 }
    if (Application.sharedInstance().osType == 0) frame.y = 5
    const view = new UITextField(frame)
    view.font = UIFont.systemFontOfSize(18)
    view.textColor = self.textColor
    // 把协议和控制器连接
    view.delegate = self
    view.text = text
    view.placeholder = "enter"
    view.textAlignment = 0
    view.autoresizingMask = (1 << 1) | (1 << 5)
    return view
  },
  input(text = "") {
    const frame = { x: 40, y: 9, width: 250, height: 30 }
    if (Application.sharedInstance().osType == 0) frame.y = 5
    const view = new UITextField(frame)
    view.font = UIFont.systemFontOfSize(15)
    view.textColor = self.textColor
    view.placeholder = "enter"
    view.delegate = self
    view.textAlignment = 0
    view.autoresizingMask = (1 << 1) | (1 << 5)
    view.text = text
    return view
  }
}

export default {
  numberOfSectionsInTableView,
  tableViewNumberOfRowsInSection,
  tableViewTitleForHeaderInSection,
  tableViewHeightForRowAtIndexPath,
  tableViewCellForRowAtIndexPath
}
