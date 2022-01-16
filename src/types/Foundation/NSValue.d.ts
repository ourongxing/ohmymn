export {}
declare global {
  class NSValue {
    CGPointValue(): CGPoint
    CGSizeValue(): CGSize
    CGRectValue(): CGRect
  }
}
