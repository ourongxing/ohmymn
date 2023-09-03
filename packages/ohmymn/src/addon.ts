import type { OpenCC } from "~/modules/autosimplify/opencc"
import manifest from "../manifest"
import type { SQLiteDatabase, UIImage } from "marginnote"
import { Prompt } from "./modules/ai/typings"
import { MyMap } from "./utils"

class MNADDON {
  private static instance?: MNADDON
  private constructor() {}
  static getInstance() {
    if (!MNADDON.instance) {
      MNADDON.instance = new MNADDON()
    }
    return MNADDON.instance
  }
  path!: string
  imagesCache = new MyMap<string, UIImage | undefined>()
  dataAutoComplete?: SQLiteDatabase
  dataAutoSimplify?: OpenCC
  lastVersion!: string
  textColor = UIColor.blackColor()
  barPosition: "left" | "right" = "left"
  prompts?: Prompt[]
  readonly mainColor =
    UIColor.colorWithHexString("#8A95A2").colorWithAlphaComponent(0.9)
  readonly key = manifest.key
  readonly title = manifest.title
  readonly author = manifest.author
  readonly version = manifest.version
  readonly globalProfileKey = manifest.profileKey!.global
  readonly docProfileKey = manifest.profileKey!.doc
  readonly notebookProfileKey = manifest.profileKey!.notebook
  readonly github = manifest.github
  readonly forum = MN.isZH ? manifest.forumZH : manifest.forum
  readonly doc = MN.isZH ? manifest.docZH : manifest.doc
}

export const Addon = MNADDON.getInstance()
