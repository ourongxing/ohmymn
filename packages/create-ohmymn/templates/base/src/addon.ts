import manifest from "../manifest"

class MNADDON {
  path!: string
  readonly key = manifest.key
  readonly title = manifest.title
  readonly author = manifest.author
  readonly version = manifest.version
  readonly github = manifest.github
  readonly forum = MN.isZH ? manifest.forumZH : manifest.forum
  readonly doc = MN.isZH ? manifest.docZH : manifest.doc
}

export const Addon = new MNADDON()
