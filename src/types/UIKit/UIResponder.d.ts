export class UIResponder {
  nextResponder: UIResponder
  canBecomeFirstResponder(): boolean
  becomeFirstResponder(): boolean
  canResignFirstResponder(): boolean
  resignFirstResponder(): boolean
  isFirstResponder(): boolean
}
