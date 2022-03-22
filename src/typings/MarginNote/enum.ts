/** 
 * osType
 * {@link Application} 
 * @enum
 */
export const enum osType {
  /**
   * osType: iPadOS
   * @memberof osType
   */
  iPadOS = 0,
  /**
   * osType: iphoneOS
   * @memberof osType
   */
  iPhoneOS = 1,
  /**
   * osType: macOS
   * @memberof osType
   */
  macOS = 2
}

/** 
 * Mindmap Layout mode
 * @enum
 */
export const enum groupMode {
  /**
   * Mindmap Layout mode:Tree
   * @memberof groupMode
   */
  Tree,
  /**
   * Mindmap Layout mode:Frame
   * @memberof groupMode
   */
  Frame
}

/** 
 * Study mode
 * {@link Application}
 * @enum
*/
export const enum studyMode {
  /**
   * Study mode: document mode type 0
   * @memberof studyMode
   */
  doc0 = 0,
  /**
   * Study mode: document mode type 1
   * @memberof studyMode
   */
  doc1 = 1,
  /**
   * Study mode: study mode
   * @memberof studyMode
   */
  study = 2,
  /**
   * Study mode: review mode
   * @memberof studyMode
   */
  review = 3
}

/**
 * doc & map split mode
 * @enum
 */
export const enum docMapSplitMode {
  /**
   * all map
   * @memberof docMapSplitMode
   */
  allMap = 0,
  /** 
   * halfMap or halfDoc 
   * @memberof docMapSplitMode
   */
  half = 1,
  /**
   * all doc
   * @memberof docMapSplitMode
   */
  allDoc = 2
}

/**
 * selection's direction
 * @enum
 */
export const enum DirectionOfSelection {
  /**
   * to right
   * @memberof DirectionOfSelection
   */
  toRight = 1,
  /**
   * to left
   * @memberof DirectionOfSelection
   */
  toLeft = 2
}
