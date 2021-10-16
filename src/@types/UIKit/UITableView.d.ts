export {}

declare global {
  const enum UITableViewStyle {}
  const enum UITableViewCellSeparatorStyle {}
  const enum UITableViewScrollPosition {}
  const enum UITableViewRowAnimation {}
  class UITableView {
    readonly style: UITableViewStyle
    dataSource: WrapperObj<any>
    rowHeight: CGFloat
    separatorStyle: UITableViewCellSeparatorStyle
    separatorColor?: UIColor
    tableHeaderView?: UIView
    tableFooterView?: UIView
    backgroundView?: UIView
    allowsSelection: boolean
    /** not implemented */
    allowsSelectionDuringEditing: boolean
    allowsMultipleSelectionDuringEditing: boolean
    editing: boolean
    sectionHeaderHeight: CGFloat
    sectionFooterHeight: CGFloat

    reloadData(): void
    reloadSectionIndexTitles(): void
    reloadRowsAtIndexPathsWithRowAnimation(
      indexPath: NSIndexPath,
      animation: UITableViewRowAnimation
    ): void
    /**
     *  NSInteger
     */
    numberOfSections(): number
    numberOfRowsInSection(section: number): number
    rectForSection(section: number): CGRect
    rectForHeaderInSection(section: number): CGRect
    rectForFooterInSection(section: number): CGRect
    /**
     *  @param indexPath NSIndexPath*
     */
    rectForRowAtIndexPath(indexPath: NSIndexPath): CGRect
    /**
     *  @returns NSIndexPath*
     */
    indexPathForRowAtPoint(point: CGPoint): NSIndexPath
    /**
     *  @returns NSIndexPath*
     */
    indexPathForCell(cell: UITableViewCell): NSIndexPath
    /**
     *  @returns NSArray*
     */
    indexPathsForRowsInRect(rect: CGRect): Array<any>
    /**
     *  @param indexPath NSIndexPath*
     */
    cellForRowAtIndexPath(indexPath: NSIndexPath): UITableViewCell
    /**
     *  @returns NSArray*
     */
    visibleCells(): Array<any>
    /**
     *  @returns NSArray*
     */
    indexPathsForVisibleRows(): Array<any>
    /**
     *  @returns UIView*
     *  NSInteger
     */
    headerViewForSection(section: number): UIView
    /**
     *  @returns UIView*
     *  NSInteger
     */
    footerViewForSection(section: number): UIView
    /**
     * @param indexPath NSIndexPath*
     */
    scrollToRowAtIndexPath(
      indexPath: NSIndexPath,
      scrollPosition: UITableViewScrollPosition,
      animated: boolean
    ): void

    /** * not available */
    deselectRowAtIndexPath(indexPath: NSIndexPath, animated: boolean): void
  }
}
