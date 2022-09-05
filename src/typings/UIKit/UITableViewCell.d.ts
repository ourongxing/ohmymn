import { UIImageView, UILabel, UIView } from "."
import {
  UITableViewCellAccessoryTypeStyle,
  UITableViewCellSelectionStyle,
  UITableViewCellStyle
} from "~/enum"

declare global {
  class UITableViewCell {
    readonly contentView: UIView
    readonly textLabel: UILabel
    readonly detailTextLabel: UILabel
    readonly imageView: UIImageView
    hidden: boolean
    indexPath: NSIndexSet
    backgroundView: UIView
    selectedBackgroundView: UIView
    selectionStyle: UITableViewCellAccessoryTypeStyle
    accessoryType: UITableViewCellSelectionStyle
    selected: boolean

    /** not available */
    setSelected(selected: boolean, animated: boolean): void
    static makeWithStyleReuseIdentifier(
      style: UITableViewCellStyle,
      reuseIdentifier: string
    ): UITableViewCell
  }
}
