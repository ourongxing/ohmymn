import manifest from "../manifest"

class MNADDON {
  path!: string
  lastVersion!: string
  textColor = UIColor.blackColor()
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
