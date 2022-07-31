import { UIView } from "./UIView"

declare global {
  class UIWebView extends UIView {
    constructor(frame: CGRect)
    [k: string]: any
    scalesPageToFit: boolean
    autoresizingMask: number
    delegate: any
    scrollView: any
    loadFileURLAllowingReadAccessToURL(URL: NSURL, readAccessURL: NSURL): void
    evaluateJavaScript(script: string, res: (res: string) => void): void
  }
}
