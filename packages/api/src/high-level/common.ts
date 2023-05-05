import { lang } from "./lang"
import { MN } from "./mn"
import { showHUD } from "./popup"

/**
 * Get the local data
 * @param key data key
 * @returns local data
 */
export function getLocalDataByKey(key: string) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

/**
 * Persistent data
 * @param data some data you want to persistent
 * @param key data key
 */
export function setLocalDataByKey(data: any, key: string) {
  NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)
}

/**
 * Evaluate JavaScript code in the context of the web view.
 * @returns script result, a string
 * @example
 * const result = await evaluateJavaScript(webView, 'document.title')
 */
export function evaluateJavaScript(webView: UIWebView, script: string) {
  return new Promise<string>(resolve =>
    webView.evaluateJavaScript(script, resolve)
  )
}

/**
 * Generate a NSURL object. If the URL does not contain a scheme, `https://` will be added.
 * @param url string
 * @param encode default `false`, will encode URL
 * @returns NSURL
 */
export function genNSURL(url: string, encode = false) {
  url = url.trim()
  if (!/^[\w\-]+:\/\//.test(url)) url = `https://${url}`
  return NSURL.URLWithString(encode ? encodeURI(url) : url)
}

/**
 * Open a URL.
 * @param url string
 * @param encode default `false`, will encode URL
 */
export function openURL(url: string, encode = false) {
  MN.app.openURL(genNSURL(url, encode))
}

/**
 * Post a notification and it will be received by all observers.
 * @param key
 * @param userInfo object
 * @example
 * postNotification("addon-key", { key: "value" })
 */
export function postNotification(key: string, userInfo: any) {
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(
    key,
    self,
    userInfo
  )
}

/**
 * Copy text to the clipboard.
 * @param text
 * @param hud default `true`, will show a message when copy success or fail
 */
export function copy(text: string, hud = true) {
  if (text) {
    UIPasteboard.generalPasteboard().string = text.trim()
    hud && showHUD(lang.copy_success)
  } else hud && showHUD(lang.copy_empty)
}

export function i18n<M, N>(lang: { zh: M; en: N extends M ? M : M }) {
  return MN.isZH ? lang.zh : lang.en
}

/**
 * Generate Objective-C Class declaration
 * @param name Objective-C Class name
 * @param type Objective-C Class type
 * @example
 * JSB.defineClass(getObjCClassDeclar("OhMyMN", "JSExtension"))
 */
export function getObjCClassDeclar(name: string, type: string) {
  return `${name} : ${type}`
}
