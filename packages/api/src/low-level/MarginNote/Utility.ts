import { UIWindow, UIViewController, UITableView } from "../UIKit"
import type { JSValue, NSData } from ".."

declare global {
  /**
   * Speech text
   */
  const SpeechManager: {
    sharedInstance(): SpeechManager
  }
  /**
   * Undo
   */
  const UndoManager: {
    sharedInstance(): UndoManager
  }
  /**
   * zip & unzip tools
   */
  const ZipArchive: {
    initWithPath(path: string): ZipArchive
    unzipFileAtPathToDestination(path: string, destination: string): boolean
    unzipFileAtPathToDestinationOverwritePassword(
      path: string,
      destination: string,
      overwrite: boolean,
      password: string
    ): boolean
    createZipFileAtPathWithFilesAtPaths(path: string, filenames: any[]): boolean
    createZipFileAtPathWithContentsOfDirectory(
      path: string,
      directoryPath: string
    ): boolean
  }
  class MenuController extends UIViewController {
    /**
     * new instance
     */
    static new(): MenuController
    menuTableView?: UITableView
    commandTable?: {
      title: string
      /** OC Object */
      object: any
      selector: string
      height?: number
      param: Record<string, any>
      checked: boolean
    }[]
    sections?: any[]
    rowHeight: number
    secHeight: number
    fontSize: number
    preferredContentSize: {
      width: number
      height: number
    }
  }
}

export declare type SpeechManager = {
  /**
   * start speech notes
   */
  startSpeechNotes(notes: any[]): void
  /**
   * stop speech
   */
  stopSpeech(): void
  /**
   * pause speech
   */
  pauseSpeech(): void
  /**
   * continue speech
   */
  continueSpeech(): void
  /**
   * previous speech
   */
  prevSpeech(): void
  /**
   * next speech
   */
  nextSpeech(): void
  canPrev(): boolean
  canNext(): boolean
  playText(text: string): void
  playTextLanguageTxt(text: string, languageTxt: string): void
  /**
   * If speaking
   */
  readonly speaking: boolean
  /**
   * If paused
   */
  readonly paused: boolean
  /**
   * when speak text
   */
  readonly sysSpeaking: boolean
  /**
   * Scene window
   */
  sceneWindow?: UIWindow
  languageCode?: string
}

export declare type UndoManager = {
  undoGrouping(actionName: string, notebookid: string, block: JSValue): void
  /**
   * undo an action
   */
  undo(): void
  /**
   * redo an action
   */
  redo(): void
  /**
   * if can undo
   */
  canUndo(): boolean
  /**
   * if can redo
   */
  canRedo(): boolean
  /**
   * clear all actions
   */
  clearAll(): void
}

export declare type ZipArchive = {
  open(): boolean
  writeFile(path: string): boolean
  writeDataFilename(data: NSData, filename: string): boolean
  close(): boolean
}
