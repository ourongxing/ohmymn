import type { NSIndexPath, NSIndexSet } from "../Foundation"
import type { CGFloat, CGPoint, CGRect, UITableViewCell, UIColor } from "."

export const enum UITableViewStyle {}
export const enum UITableViewCellSeparatorStyle {}
export const enum UITableViewScrollPosition {
  /** Scrolls the cell to the bottom of the view. */
  Bottom = 3,
  /** Scrolls the row of interest to the middle of the view. */
  Middle = 2,
  /** Minimal scrolling to make the requested cell visible. */
  None = 0,
  /** Scrolls the row of interest to the top of the view. */
  Top = 1
}
export const enum UITableViewRowAnimation {
  // The inserted or deleted row or rows fade into or out of the table view.
  Fade,
  // The inserted row or rows slide in from the right; the deleted row or rows slide out to the right.
  Right,
  // The inserted row or rows slide in from the left; the deleted row or rows slide out to the left.
  Left,
  // The inserted row or rows slide in from the top; the deleted row or rows slide out toward the top.
  Top,
  // The inserted row or rows slide in from the bottom; the deleted row or rows slide out toward the bottom.
  Bottom,
  // The inserted or deleted rows use the default animations.
  None,
  // The table view attempts to keep the old and new cells centered in the space they did or will occupy.
  Middle,
  // The table view chooses an appropriate animation style for you.
  Automatic
}

export declare class UITableView extends UIView {
  readonly style: UITableViewStyle
  dataSource: any
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
  /**
   * @deprecated
   */
  reloadSectionIndexTitles(): void
  /**
   * @deprecated
   */
  reloadSectionsWithRowAnimation(
    sections: number[],
    animation: UITableViewRowAnimation
  ): void
  /**
   * @deprecated
   */
  reloadRowsAtIndexPathsWithRowAnimation(
    indexPath: NSIndexPath[],
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
  indexPathsForRowsInRect(rect: CGRect): any[]
  /**
   *  @param indexPath NSIndexPath*
   */
  cellForRowAtIndexPath(indexPath: NSIndexPath): UITableViewCell
  /**
   *  @returns NSArray*
   */
  visibleCells(): any[]
  /**
   *  @returns NSArray*
   */
  indexPathsForVisibleRows(): any[]
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
  scrollToRowAtIndexPathAtScrollPositionAnimated(
    indexPath: NSIndexPath,
    scrollPosition: UITableViewScrollPosition,
    animated: boolean
  ): void
  scrollToNearestSelectedRowAtScrollPositionAnimated(
    scrollPosition: UITableViewScrollPosition,
    animated: boolean
  ): void
  setContentOffsetAnimated(offset: CGPoint, animated: boolean): void
  rectForHeaderInSection(section: number): CGRect
  rectForFooterInSection(section: number): CGRect

  /**
   * @deprecated
   */
  deselectRowAtIndexPath(indexPath: NSIndexPath, animated: boolean): void
}
