import { UIWindow, UIViewController, UITableView } from "typings/UIKit"

declare global {
  /**
   * speech manager
   * @class SpeechManager
   * @property {string} speaking
   * @property {boolean} paused
   * @property {UIWindow} sceneWindow
   * @property {string} languageCode
   * @function startSpeechNotes
   * @function stopSpeech
   * @function pauseSpeech
   * @function continueSpeech
   * @function prevSpeech
   * @function nextSpeech
   * @function canPrev
   * @function canNext
   * @function playText
   * @function playTextLanguageTxt
   * @function sharedInstance
   */
  class SpeechManager {
    /**
     * start speech notes
     * @param notes NSArray*
     * @memberof SpeechManager
     * @returns {void}
     */
    startSpeechNotes(notes: Array<any>): void
    /**
     * stop speech
     * @memberof SpeechManager
     * @returns {void}
     */
    stopSpeech(): void
    /**
     * pause speech
     * @memberof SpeechManager
     * @returns {void}
     */
    pauseSpeech(): void
    /**
     * continue speech
     * @memberof SpeechManager
     * @returns {void}
     */
    continueSpeech(): void
    /**
     * previous speech
     * @memberof SpeechManager
     * @returns {void}
     */
    prevSpeech(): void
    /**
     * next speech
     * @memberof SpeechManager
     * @returns {void}
     */
    nextSpeech(): void
    /**
     * @memberof SpeechManager
     * @returns {boolean}
     */
    canPrev(): boolean
    /**
     * @memberof SpeechManager
     * @returns {boolean}
     */
    canNext(): boolean
    /**
     * @param text NSString*
     * @memberof SpeechManager
     * @returns {void}
     */
    playText(text: string): void
    /**
     * @param text NSString*
     * @param languageTxt NSString*
     * @memberof SpeechManager
     * @returns {void}
     */
    playTextLanguageTxt(text: string, languageTxt: string): void
    /**
     * If speaking
     *
     * @type {boolean}
     * @memberof SpeechManager
     */
    readonly speaking: boolean
    /**
     * If paused
     *
     * @type {boolean}
     * @memberof SpeechManager
     */
    readonly paused: boolean
    /**
     * Scene window
     *
     * @type {UIWindow}
     * @memberof SpeechManager
     */
    sceneWindow?: UIWindow
    /**
     * 
     *
     * @type {string}
     * @memberof SpeechManager
     */
    languageCode?: string
    /**
     * create a new instance
     * @returns {SpeechManager*}
     */
    static sharedInstance(): SpeechManager
  }

  /**
   * Undo Manager
   * @class UndoManager
   * @function undo
   * @function redo
   * @function canUndo
   * @function canRedo
   * @function clearAll
   * @function sharedInstance
   */
  class UndoManager {
    /**
     * create a new instance
     * @returns {UndoManager}
     * @memberof UndoManager
     */
    static sharedInstance(): UndoManager
    /**
     * @param actionName NSString*
     * @param topicid NSString*
     * @param block JSValue*
     * @memberof UndoManager
     * @returns {void}
     */
    undoGrouping(actionName: string, topicid: string, block: JSValue): void
    /**
     * undo an action
     * @memberof UndoManager
     * @returns {void}
     */
    undo(): void
    /**
     * redo an action
     * @memberof UndoManager
     * @returns {void}
     */
    redo(): void
    /**
     * if can undo
     * @memberof UndoManager
     * @returns {boolean}
     */
    canUndo(): boolean
    /**
     * if can redo
     * @memberof UndoManager
     * @returns {boolean}
    */
    canRedo(): boolean
    /**
     * clear all actions
     * @memberof UndoManager
     * @returns {void}
     */
    clearAll(): void
  }

  /**
   * zip & unzip tools
   * @function unzipFileAtPathToDestination
   * @function unzipFileAtPathToDestinationOverwritePassword
   * @function createZipFileAtPathWithFilesAtPaths
   * @function createZipFileAtPathWithContentsOfDirectory
   * @function initWithPath
   * @function open
   * @function writeFile
   * @function writeDataFilename
   * @function close
   */
  class ZipArchive {
    /**
     * @param path NSString*
     * @param destination NSString*
     * @memberof ZipArchive
     * @returns {void}
     */
    static unzipFileAtPathToDestination(
      path: string,
      destination: string
    ): boolean
    /**
     * @param path NSString*
     * @param destination NSString*
     * @param password NSString*
     * @memberof ZipArchive
     * @returns {void}
     */
    static unzipFileAtPathToDestinationOverwritePassword(
      path: string,
      destination: string,
      overwrite: boolean,
      password: string
    ): boolean
    /**
     * @param path NSString*
     * @param filenames NSArray*
     * @memberof ZipArchive
     * @returns {void}
     */
    static createZipFileAtPathWithFilesAtPaths(
      path: string,
      filenames: Array<any>
    ): boolean
    /**
     * @param path NSString*
     * @param directoryPath NSString*
     * @memberof ZipArchive
     * @returns {void}
     */
    static createZipFileAtPathWithContentsOfDirectory(
      path: string,
      directoryPath: string
    ): boolean
    /**
     * @param path NSString*
     * @memberof ZipArchive
     * @returns {void}
     */
    initWithPath(path: string): WrapperObj<any>
    open(): boolean
    /**
     * @param path NSString*
     * @memberof ZipArchive 
     * @returns {void}
     */
    writeFile(path: string): boolean
    /**
     * @param data NSData*
     * @param filename NSString*
     * @memberof ZipArchive
     * @returns {void}
     */
    writeDataFilename(data: NSData, filename: string): boolean
    /**
     * @memberof ZipArchive
     * @returns {boolean}
     */
    close(): boolean
  }
  /**
   * @property {UITableView} menuTableView
   * @function new
   * @property {DictObj[]} commandTable
   * @property {Array<any>} sections
   * @property {number} rowHeight
   * @property {number} secHeight
   * @property {number} fontSize
   * @property {Object} preferredContentSize
   */
  class MenuController extends UIViewController {
    /**
     * new instance
     * @returns {MenuController}
     * @memberof MenuController
     */
    static new(): MenuController
    /**
     *
     *
     * @type {UITableView}
     * @memberof MenuController
     */
    menuTableView?: UITableView
    /**
     *
     * @memberof MenuController
     */
    commandTable?: {
      title: string
      /** OC Object */
      object: any
      selector: string
      height?: number
      param: AnyProperty<any>
      checked: boolean
    }[]
    /**
     *
     *
     * @type {Array<any>}
     * @memberof MenuController
     */
    sections?: Array<any>
    /**
     *  int
     * 
     * @type {number}
     * @memberof MenuController
     */
    rowHeight: number
    /**
     *  int
     * 
     * @type {number}
     * @memberof MenuController
     */
    secHeight: number
    /**
     *  int
     * 
     * @type {number}
     * @memberof MenuController
     */
    fontSize: number
    /**
     *
     *
     * @type {{
     *       width: number
     *       height: number
     *     }}
     * @memberof MenuController
     */
    preferredContentSize: {
      width: number
      height: number
    }
  }
}
