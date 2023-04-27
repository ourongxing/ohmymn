import { NSDictionary } from "."

declare global {
  const NSFileManager: {
    defaultManager(): NSFileManager
  }
}

export declare type NSFileManager = {
  contentsOfDirectoryAtPath(path: string): string[]
  subpathsOfDirectoryAtPath(path: string): string[]
  fileExistsAtPath(path: string): boolean
  isDirectoryAtPath(path: string): boolean
  moveItemAtPathToPath(path: string, toPath: string): boolean
  copyItemAtPathToPath(path: string, toPath: string): boolean
  // removeItemAtPath(path: string): boolean
  createDirectoryAtPathAttributes(
    path: string,
    attributes: NSDictionary
  ): boolean
  // createFileAtPathContentsAttributes(
  //   path: string,
  //   contents: NSData | undefined,
  //   attributes: NSDictionary
  // ): boolean
}
