import { OSType } from "../low-level"
import type { UIColor } from "../low-level"
import gte from "semver/functions/gte"

class MNAPP {
  /**
   * Application shared instance
   */
  readonly app = Application.sharedInstance()
  /**
   * Database shared instance
   */
  readonly db = Database.sharedInstance()
  /**
   * Current studyController of current window
   */
  get studyController() {
    return this.app.studyController(this.app.focusWindow)
  }
  /**
   * Current notebookController of current window
   */
  get notebookController() {
    return this.studyController.notebookController
  }
  /**
   * Current documentController of current window
   */
  get currentDocumentController() {
    return this.studyController.readerController.currentDocumentController
  }
  /**
   * Current window
   */
  get currentWindow() {
    return this.app.focusWindow
  }
  /**
   * Current theme color
   * @returns UIColor
   */
  get currentThemeColor(): UIColor {
    return this.themeColor[this.app.currentTheme]
  }
  /**
   * Current addon info. It will read from `self.addon`.
   */
  get currentAddon(): {
    key: string
    title: string
  } {
    return {
      key: self.addon?.key ?? "mnaddon",
      title: self.addon?.title ?? "MarginNote"
    }
  }
  /**
   * Current notebook id of current window
   */
  get currnetNotebookId() {
    return this.notebookController?.notebookId
  }
  /**
   * Current doc md5 of current window
   */
  get currentDocmd5() {
    try {
      // 只要在笔记本内，就算没有文档，也会存在一个 docmd5，只是长度变为了 32 位随机。尽量让这个值固定，8 个 0，避免生成更多的无效配置。
      const { docMd5 } = this.currentDocumentController
      if (docMd5 && docMd5.length === 32) return "00000000"
      else return docMd5
    } catch {
      return undefined
    }
  }
  /**
   * Whether the current language is Chinese
   */
  readonly isZH = NSLocale.preferredLanguages()?.[0].startsWith("zh")
  /**
   * @value 4.0.2(97)
   *
   * 4.0.2 is version, 97 is build num
   */
  readonly version = this.app.appVersion ?? "3.7.21"
  readonly isMN4 = gte(this.version, "4.0.0")
  readonly isMac = this.app.osType === OSType.macOS
  readonly isMacMN4 = this.isMac && gte(this.version, "4.0.2")
  readonly isMacMN3 = this.isMac && !this.isMacMN4
  /**
   * support marginnote4
   */
  readonly scheme = this.isMN4 ? "marginnote4app" : "marginnote3app"
  readonly themeColor = {
    Gray: UIColor.colorWithHexString("#414141"),
    Default: UIColor.colorWithHexString("#FFFFFF"),
    Dark: UIColor.colorWithHexString("#000000"),
    Green: UIColor.colorWithHexString("#E9FBC7"),
    Sepia: UIColor.colorWithHexString("#F5EFDC")
  }
  /**
   * You need watch log in console.app not in Browser
   * @param obj any object
   * @param suffix default is "normal"
   * @param args any params
   */
  log(obj: any, suffix = "normal", ...args: any[]) {
    if (self.useConsole)
      console.log(obj, `${MN.currentAddon.key}-${suffix}`, ...args)
    else JSB.log(`${MN.currentAddon.key}-${suffix} %@`, obj)
  }
  /**
   * You need watch log in console.app not in Browser
   * @param obj any object
   * @param suffix default is "error"
   * @param args any params
   */
  error(obj: any, suffix = "error", ...args: any[]) {
    if (self.useConsole)
      console.error(obj, `${MN.currentAddon.key}-${suffix}`, ...args)
    else
      JSB.log(
        `${MN.currentAddon.key}-${suffix} %@`,
        String(obj) === "[object Object]"
          ? JSON.stringify(obj, undefined, 2)
          : String(obj)
      )
  }
}

/**
 * MarginNote application object
 */
export const MN = new MNAPP()
