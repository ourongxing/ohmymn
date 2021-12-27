export {}

declare global {
  const enum UITableViewCellSelectionStyle {}
  const enum UITableViewCellAccessoryTypeStyle {}
  const enum UITableViewCellStyle {
    Default = 0,
    Value1 = 1,
    Value2 = 2,
    Subtitle = 3
  }
  class UITableViewCell {
    readonly contentView: UIView
    readonly textLabel: UILabel
    readonly detailTextLabel: UILabel
    readonly imageView: UIImageView
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
