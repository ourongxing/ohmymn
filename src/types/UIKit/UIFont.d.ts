export {}

declare global {
  class UIFont {
    /**
     *  默认 17
     */
    static systemFontOfSize(fontSize: number): UIFont
    static boldSystemFontOfSize(fontSize: number): UIFont
    static italicSystemFontOfSize(fontSize: number): UIFont
  }
}
