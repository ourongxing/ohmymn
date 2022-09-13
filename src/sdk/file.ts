import { NSJSONReadingOptions } from "~/enum"

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
