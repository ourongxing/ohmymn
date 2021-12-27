export {}

declare global {
  class UIViewController {
    loadView(): void
    viewWillUnload(): void
    viewDidUnload(): void
    viewDidLoad(): void
    isViewLoaded(): void
    viewWillAppear(animated: boolean): void
    viewDidAppear(animated: boolean): void
    viewWillDisappear(animate: boolean): void
    viewDidDisappear(animate: boolean): void
    viewWillLayoutSubviews(): void
    viewDidLayoutSubviews(): void
    didReceiveMemoryWarning(): void
    isBeingPresented(): boolean
    isBeingDismissed(): boolean
    isMovingToParentViewController(): boolean
    isMovingFromParentViewController(): boolean
  }
}
