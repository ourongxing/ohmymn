import { UIImageView } from "."
import { NSIndexSet } from "../Foundation"

export const enum UITableViewCellSelectionStyle {}
export const enum UITableViewCellAccessoryTypeStyle {}
export const enum UITableViewCellStyle {
  Default = 0,
  Value1 = 1,
  Value2 = 2,
  Subtitle = 3
}

declare global {
  const UITableViewCell: {
    makeWithStyleReuseIdentifier(
      style: UITableViewCellStyle,
      reuseIdentifier: string
    ): UITableViewCell
  }
}

export declare type UITableViewCell = {
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
}
