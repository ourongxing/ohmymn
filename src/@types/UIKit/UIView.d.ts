export { }

declare global {
  const enum UIViewAutoresizing {

  }
  class UIView extends UIResponder {
    constructor(frame?: CGRect);
    bounds: CGRect;
    frame: CGRect;
    addSubview(view: UIView): void;
    autoresizingMask: UIViewAutoresizing;
    superview: UIView;
    center: CGPoint;
    tag: number;
    autoresizesSubviews: boolean;
    backgroundColor: UIColor;
  }
}
