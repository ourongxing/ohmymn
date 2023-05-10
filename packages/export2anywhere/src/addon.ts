import type { OpenCC } from "~/modules/autosimplify/opencc"
import manifest from "../manifest"
import type { SQLiteDatabase } from "marginnote"
import { Prompt } from "./modules/ai/typings"

class MNADDON {
  path!: string
  dataAutoComplete?: SQLiteDatabase
  dataAutoSimplify?: OpenCC
  lastVersion!: string
  textColor = UIColor.blackColor()
  prompts?: Prompt[]
  readonly key = manifest.key
  readonly title = manifest.title
  readonly author = manifest.author
  readonly version = manifest.version
  readonly globalProfileKey = manifest.profileKey!.global
  readonly docProfileKey = manifest.profileKey!.doc
  readonly notebookProfileKey = manifest.profileKey!.notebook
  readonly borderColor = UIColor.colorWithHexString(manifest.color!.border)
  readonly buttonColor = UIColor.colorWithHexString(manifest.color!.button)
  readonly github = manifest.github
  readonly forum = MN.isZH ? manifest.forumZH : manifest.forum
  readonly doc = MN.isZH ? manifest.docZH : manifest.doc
}

export const Addon = new MNADDON()
