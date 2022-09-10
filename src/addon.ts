import { OpenCC } from "~/modules/autosimplify/opencc"
import { mainfest } from "../mainfest"
import { MN } from "./sdk"
export const Addon = {
  path: "",
  key: mainfest.key,
  title: mainfest.title,
  author: mainfest.author,
  version: mainfest.version,
  globalProfileKey: mainfest.profileKey.global,
  docProfileKey: mainfest.profileKey.doc,
  notebookProfileKey: mainfest.profileKey.notebook,
  textColor: UIColor.blackColor(),
  borderColor: UIColor.colorWithHexString(mainfest.color.border),
  buttonColor: UIColor.colorWithHexString(mainfest.color.button),
  url: MN.isZH ? mainfest.bbs : mainfest.forum,
  enDict: undefined as SQLiteDatabase | undefined,
  OpenCC: undefined as OpenCC | undefined
}
