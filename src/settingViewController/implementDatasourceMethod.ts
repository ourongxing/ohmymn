import { addonList, dataSource } from "synthesizer"
import { cellViewType, IRow, IRowSelect } from "types/Addon"
import { console, isOCNull } from "utils/common"
import { MN } from "const"
import { UITableView } from "types/UIKit"
import { profile } from "profile"
import { byteLength, isHalfWidth } from "utils/text"
import lang from "lang"

const indexPath2tag = (indexPath: NSIndexPath): number =>
  indexPath.section * 100 + indexPath.row + 999

const getSelections = (rows: IRow[], key: string) => {
  const index = rows.findIndex(
    _row =>
      (_row.type == cellViewType.muiltSelect ||
        _row.type == cellViewType.select) &&
      _row.key == key
  )
  return index == -1 ? -1 : (rows[index] as IRowSelect).selections
}

const isSelected = (header: string): boolean => {
  const quickSwitch = getSelections(
    dataSource[1].rows,
    "quickSwitch"
  ) as number[]
  return (
    !addonList.includes(header) ||
    quickSwitch.includes(addonList.findIndex(key => key == header))
  )
}

const numberOfSectionsInTableView = (tableView: UITableView) =>
  dataSource.length

const tableViewNumberOfRowsInSection = (
  tableView: UITableView,
  section: number
) => {
  const { header } = dataSource[section]
  return isSelected(header) ? dataSource[section].rows.length : 0
}

const tableViewTitleForHeaderInSection = (
  tableView: UITableView,
  section: number
) => {
  const { header } = dataSource[section]
  return isSelected(header) ? header : new NSNull()
}

const tableViewHeightForRowAtIndexPath = (
  tableView: UITableView,
  indexPath: NSIndexPath
) => {
  const section = dataSource[indexPath.section]
  const row = section.rows[indexPath.row]
  if (row.type === cellViewType.plainText) {
    if (row.bind) {
      const [key, index] = row.bind
      const selections = getSelections(section.rows, key)
      if (selections == -1) {
        console.error("bind key 输入错误")
        return 0
      } else if (!selections.includes(index)) {
        return 0
      }
    }
    // 每行大约可以容纳 44 个半角字符
    const byte = byteLength(row.label)
    const lines = (byte - (byte % 44)) / 44 - (byte % 44 ? 0 : 1)
    const lineBreaks = row.label.length - row.label.replace(/\n/g, "").length
    return (lines > lineBreaks ? lines : lineBreaks) * 15 + 30
  } else if (
    (row.type == cellViewType.inlineInput || row.type == cellViewType.input) &&
    row.bind
  ) {
    const [key, index] = row.bind
    const selections = getSelections(section.rows, key)
    if (selections == -1) {
      console.error(lang.implement_datasource_method.bind_key)
      return 0
    } else if (!selections.includes(index)) {
      return 0
    }
  }
  return 40
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
      cell.textLabel.textColor = MN.textColor
      cell.textLabel.text = row.label
      const iconColor = MN.app.currentTheme == "Gray" ? "light" : "dark"
      const image = NSData.dataWithContentsOfFile(
        MN.mainPath + `/icon/${iconColor}/${row.key}.png`
      )
      if (!isOCNull(image))
        cell.imageView.image = UIImage.imageWithDataScale(image, 2)
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
      cell.textLabel.textColor = MN.textColor
      const view = initCellView.switch(row.status ?? false)
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
      cell.textLabel.textColor = MN.textColor
      cell.textLabel.text = row.label
      const view = initCellView.inlineInput(row.content ?? "")
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
      cell.textLabel.textColor = MN.textColor
      cell.selectionStyle = 0
      const view = initCellView.input(row.content ?? "")
      view.autoresizingMask = 1 << 0
      view.tag = indexPath2tag(indexPath)
      cell.contentView.addSubview(view)
      return cell
    }
    case cellViewType.muiltSelect:
    case cellViewType.select: {
      const cell = UITableViewCell.makeWithStyleReuseIdentifier(
        0,
        "selectCellID"
      )
      cell.textLabel.font = UIFont.systemFontOfSize(16)
      cell.textLabel.textColor = MN.textColor
      cell.textLabel.text = row.label
      cell.selectionStyle = 0
      const view = initCellView.select(
        row.type == cellViewType.select
          ? row.option[row?.selections?.[0] ?? 0]
          : row?.selections?.length
          ? `${row.selections.length} ${lang.implement_datasource_method.clicked}`
          : lang.implement_datasource_method.none
      )
      const newFrame = view.frame
      newFrame.x = cell.contentView.frame.width - newFrame.width - 10
      view.frame = newFrame
      view.autoresizingMask = 1 << 0
      view.tag = indexPath2tag(indexPath)
      cell.contentView.addSubview(view)
      return cell
    }
  }
}

// 仅用于 SettingViewController
const initCellView = {
  switch(status: boolean) {
    const frame = { x: 0, y: 5, width: 70, height: 30 }
    const view = new UISwitch(frame)
    view.addTargetActionForControlEvents(self, "switchChange:", 1 << 12)
    view.backgroundColor = UIColor.clearColor()
    view.on = status
    return view
  },
  select(text: string) {
    const frame = { x: 0, y: 5, width: 70, height: 30 }
    const view = new UIButton(frame)
    view.setTitleForState(
      isHalfWidth(text)
        ? text.length > 10
          ? text.slice(0, 10)
          : text
        : text.length > 4
        ? text.slice(0, 4)
        : text,
      0
    )
    view.setTitleColorForState(UIColor.whiteColor(), 0)
    view.backgroundColor = UIColor.grayColor()
    view.layer.cornerRadius = 10
    view.layer.masksToBounds = true
    view.titleLabel.font = UIFont.boldSystemFontOfSize(14)
    view.titleLabel.lineBreakMode = 4
    view.addTargetActionForControlEvents(self, "clickSelectButton:", 1 << 6)
    return view
  },
  inlineInput(text: string) {
    const frame = { x: 0, y: 9, width: 70, height: 30 }
    if (MN.app.osType == 0) frame.y = 5
    const view = new UITextField(frame)
    view.font = UIFont.systemFontOfSize(18)
    view.textColor = MN.textColor
    // 把协议和控制器连接
    view.delegate = self
    view.text = text
    view.placeholder = "enter"
    view.autoresizingMask = (1 << 1) | (1 << 5)
    return view
  },
  input(text: string) {
    const frame = { x: 40, y: 9, width: 250, height: 30 }
    if (MN.app.osType == 0) frame.y = 5
    const view = new UITextField(frame)
    view.font = UIFont.systemFontOfSize(15)
    view.textColor = MN.textColor
    view.placeholder = "enter"
    view.delegate = self
    view.autoresizingMask = (1 << 1) | (1 << 5)
    view.text = text
    return view
  }
}

export default {
  numberOfSectionsInTableView,
  tableViewNumberOfRowsInSection,
  tableViewCellForRowAtIndexPath,
  tableViewTitleForHeaderInSection,
  tableViewHeightForRowAtIndexPath
}
