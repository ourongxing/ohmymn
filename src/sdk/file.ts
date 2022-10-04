import { NSJSONReadingOptions } from "~/enum"
import { postNotification } from "./common"
import { MN } from "./mn"

export function isfileExists(path: string) {
  return NSFileManager.defaultManager().fileExistsAtPath(path)
}

export function writeTextFile(path: string, text: string) {
  NSData.dataWithStringEncoding(text, 4).writeToFileAtomically(path, false)
}

export function readJSON(path: string) {
  const ret = NSJSONSerialization.JSONObjectWithDataOptions(
    NSData.dataWithContentsOfFile(path),
    NSJSONReadingOptions.MutableContainers
  )
  if (NSJSONSerialization.isValidJSONObject(ret)) {
    return ret
  } else throw "Invalid JSON"
}

export function writeJSON(path: string, data: any) {
  NSData.dataWithStringEncoding(
    JSON.stringify(data, undefined, 2),
    4
  ).writeToFileAtomically(path, false)
}

/**
 *
 * @param file file path
 * @param UTI https://developer.apple.com/library/archive/documentation/Miscellaneous/Reference/UTIRef/Articles/System-DeclaredUniformTypeIdentifiers.html#//apple_ref/doc/uid/TP40009259-SW1
 */
export function saveFile(file: string, UTI: string) {
  if (MN.isMac) {
    MN.app.saveFileWithUti(file, UTI)
  } else {
    postNotification("OpenInApp", {
      fileURL: file,
      UTI
      // UTI: "public.folder"
      // UTI:  "com.adobe.pdf"
    })
  }
}

export function saveTextFile(text: string, fileName: string, UTI: string) {
  const path = `${MN.app.tempPath}/${fileName}`
  writeTextFile(path, text)
  saveFile(path, UTI)
}
