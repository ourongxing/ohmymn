declare global {
  const UIFont: {
    /**
     *  默认 17
     */
    systemFontOfSize(fontSize: number): UIFont
    boldSystemFontOfSize(fontSize: number): UIFont
    italicSystemFontOfSize(fontSize: number): UIFont
  }
}

export declare type UIFont = {}
