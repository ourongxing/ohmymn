declare global {
  const NSIndexSet: {
    indexSetWithIndex(index: number): NSIndexSet
  }
}

export declare type NSIndexSet = {
  isEqualToIndexSet(indexSet: NSIndexSet): boolean
  firstIndex(): number
  lastIndex(): number
}
