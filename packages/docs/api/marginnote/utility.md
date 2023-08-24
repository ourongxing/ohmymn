# Utility

## SpeechManager
朗读
```ts
const SpeechManager: {
  sharedInstance(): SpeechManager
}
```

```ts
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
```
如何使用:
来源于 [read-aloud](https://github.com/ourongxing/read-aloud/blob/main/main.js#L200)
```ts
class Speaker {
  constructor() {
    this.s = SpeechManager.sharedInstance()
    this.speakerStatus = "stop"
  }
  get status() {
    if (Date.now() - this.lastPlay < 300) return "playing"
    if (this.speakerStatus === "playing" && !this.s.sysSpeaking)
      return "over"
    return this.speakerStatus
  }
  play(content) {
    this.s.playText(content)
    this.lastPlay = Date.now()
    this.speakerStatus = "playing"
  }
  pause() {
    this.s.pauseSpeech()
    this.speakerStatus = "pause"
  }
  continue() {
    this.s.continueSpeech()
    this.lastPlay = Date.now()
    this.speakerStatus = "playing"
  }
  close() {
    this.s.stopSpeech()
    this.speakerStatus = "stop"
  }
}
```
## UndoManager
撤销操作
```ts
const UndoManager: {
  sharedInstance(): UndoManager
}
```
```ts
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
```
## ZipArchive
压缩和解压缩
```ts
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
```
```ts
export declare type ZipArchive = {
  open(): boolean
  writeFile(path: string): boolean
  writeDataFilename(data: NSData, filename: string): boolean
  close(): boolean
}
```

## MenuController
选项菜单
```ts
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
```