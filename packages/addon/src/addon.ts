import type { OpenCC } from "~/modules/autosimplify/opencc"
import mainfest from "../manifest"
import type { SQLiteDatabase } from "marginnote"

class MNADDON {
  path!: string
  dataAutoComplete?: SQLiteDatabase
  dataAutoSimplify?: OpenCC
  lastVersion!: string
  textColor = UIColor.blackColor()
  readonly key = mainfest.key
  readonly title = mainfest.title
  readonly author = mainfest.author
  readonly version = mainfest.version
  readonly globalProfileKey = mainfest.profileKey.global
  readonly docProfileKey = mainfest.profileKey.doc
  readonly notebookProfileKey = mainfest.profileKey.notebook
  readonly borderColor = UIColor.colorWithHexString(mainfest.color.border)
  readonly buttonColor = UIColor.colorWithHexString(mainfest.color.button)
  readonly github = mainfest.github
  readonly forum = MN.isZH ? mainfest.forumZH : mainfest.forum
  readonly doc = MN.isZH ? mainfest.docZH : mainfest.doc
}

export const Addon = new MNADDON()
